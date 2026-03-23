// ingest-news: Fetch Google News RSS for each active company
// Source: Google News RSS (free, unlimited, no auth)
// Schedule: Daily at 9AM UTC
// Cost: $0

import { getServiceClient, corsHeaders, withRetry, parseRSS, md5, logRun, jsonResponse } from "../_shared/utils.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const start = Date.now();
  try {
    const supabase = getServiceClient();

    // Get active companies
    const { data: companies } = await supabase
      .from("companies")
      .select("id, name, slug, domain")
      .eq("status", "active");

    if (!companies?.length) return jsonResponse({ ok: true, items: 0, msg: "No companies" });

    let totalItems = 0;

    for (const co of companies) {
      // Build search query: "brand name" + consumer/DTC context
      const query = encodeURIComponent(`"${co.name}" consumer OR DTC OR brand`);
      const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;

      try {
        const res = await withRetry(() => fetch(rssUrl, {
          headers: { "User-Agent": "VentureBrowse/1.0 (news aggregator)" },
        }));

        if (!res.ok) continue;
        const xml = await res.text();
        const items = parseRSS(xml).slice(0, 5); // Max 5 per company per day

        for (const item of items) {
          const fingerprint = await md5(item.link);

          // Upsert with fingerprint dedup
          const { error } = await supabase.from("news_articles").upsert({
            company_id: co.id,
            title: item.title.slice(0, 500),
            source_name: item.source || "Unknown",
            source_url: item.link,
            published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
            description: item.description.slice(0, 500),
            fingerprint,
          }, { onConflict: "fingerprint" });

          if (!error) totalItems++;
        }

        // Rate limit: 2 second delay between companies to be respectful
        await new Promise(r => setTimeout(r, 2000));
      } catch (err) {
        console.error(`News fetch failed for ${co.name}:`, err.message);
      }
    }

    await logRun(supabase, "google-news", "success", totalItems, undefined, Date.now() - start);

    return jsonResponse({ ok: true, items: totalItems, companies: companies.length, duration_ms: Date.now() - start });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message }, 500);
  }
});
