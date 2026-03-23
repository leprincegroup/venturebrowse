// ingest-trends: Fetch Google Trends interest data
// Source: Google Trends HTTP endpoints (free, no auth)
// Schedule: Weekly on Thursday at 3AM UTC
// Cost: $0

import { getServiceClient, corsHeaders, withRetry, checkBudget, incrementBudget, logRun, jsonResponse } from "../_shared/utils.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const start = Date.now();
  try {
    const supabase = getServiceClient();

    const { data: companies } = await supabase
      .from("companies")
      .select("id, name")
      .eq("status", "active");

    if (!companies?.length) return jsonResponse({ ok: true, items: 0 });

    let totalItems = 0;
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 86400000);

    for (const co of companies) {
      const budget = await checkBudget(supabase, "google_trends");
      if (!budget.allowed) break;

      try {
        // Google Trends explore endpoint (returns JSON after token fetch)
        const query = encodeURIComponent(co.name);
        const url = `https://trends.google.com/trends/api/dailytrends?hl=en-US&tz=-60&geo=US&ns=15`;

        // Note: Google Trends requires a 2-step process (get token, then data)
        // For MVP, use the daily trends endpoint which doesn't need auth
        const res = await withRetry(() => fetch(
          `https://trends.google.com/trends/api/realtimetrends?hl=en-US&tz=-60&cat=all&fi=0&fs=0&geo=US&ri=300&rs=20&sort=0`,
          { headers: { "User-Agent": "Mozilla/5.0 (compatible; VentureBrowse/1.0)" } }
        ));

        if (!res.ok) continue;
        const text = await res.text();

        // Google Trends prefixes response with ")]}'\n" — strip it
        const jsonText = text.replace(/^\)\]\}'\n/, "");
        const data = JSON.parse(jsonText);

        // Search for company mentions in trending stories
        const stories = data?.storySummaries?.trendingStories || [];
        for (const story of stories) {
          const articles = story.articles || [];
          const mentionsBrand = articles.some((a: any) =>
            a.articleTitle?.toLowerCase().includes(co.name.toLowerCase())
          );

          if (mentionsBrand) {
            await supabase.from("search_trends").upsert({
              company_id: co.id,
              keyword: co.name,
              interest_score: story.image?.imgUrl ? 80 : 50, // Trending = high interest
              source: "google_trends",
              period_start: weekAgo.toISOString().split("T")[0],
              period_end: today.toISOString().split("T")[0],
            }, { onConflict: "company_id,keyword,geo,period_start,source" });
            totalItems++;
          }
        }

        await incrementBudget(supabase, "google_trends");
        await new Promise(r => setTimeout(r, 5000)); // 5s delay for rate limiting
      } catch (err) {
        console.error(`Trends failed for ${co.name}:`, err.message);
      }
    }

    await logRun(supabase, "google-trends", "success", totalItems, undefined, Date.now() - start);
    return jsonResponse({ ok: true, items: totalItems, duration_ms: Date.now() - start });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message }, 500);
  }
});
