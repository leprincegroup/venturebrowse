// ingest-social: Fetch Instagram + TikTok metrics via RapidAPI
// Source: RapidAPI scrapers (~$30/mo for both)
// Schedule: Daily at 7AM UTC
// Cost: ~$30/mo

import { getServiceClient, corsHeaders, withRetry, checkBudget, incrementBudget, logRun, jsonResponse } from "../_shared/utils.ts";

async function fetchInstagram(handle: string, apiKey: string): Promise<any> {
  const res = await fetch(`https://instagram-scraper-api2.p.rapidapi.com/v1/info?username_or_id_or_url=${handle}`, {
    headers: { "x-rapidapi-key": apiKey, "x-rapidapi-host": "instagram-scraper-api2.p.rapidapi.com" },
  });
  if (!res.ok) throw new Error(`IG API ${res.status}`);
  return res.json();
}

async function fetchTikTok(handle: string, apiKey: string): Promise<any> {
  const res = await fetch(`https://tiktok-scraper7.p.rapidapi.com/user/info?unique_id=${handle}`, {
    headers: { "x-rapidapi-key": apiKey, "x-rapidapi-host": "tiktok-scraper7.p.rapidapi.com" },
  });
  if (!res.ok) throw new Error(`TT API ${res.status}`);
  return res.json();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const start = Date.now();
  try {
    const supabase = getServiceClient();
    const apiKey = Deno.env.get("RAPIDAPI_KEY");
    if (!apiKey) return jsonResponse({ ok: false, error: "RAPIDAPI_KEY not set" }, 500);

    const { data: companies } = await supabase
      .from("companies")
      .select("id, name, instagram, tiktok")
      .eq("status", "active");

    if (!companies?.length) return jsonResponse({ ok: true, items: 0 });

    let totalItems = 0;
    const today = new Date().toISOString().split("T")[0];

    for (const co of companies) {
      // Instagram
      if (co.instagram) {
        const budget = await checkBudget(supabase, "rapidapi_instagram");
        if (budget.allowed) {
          try {
            const data = await withRetry(() => fetchInstagram(co.instagram, apiKey));
            const user = data?.data;
            if (user) {
              await supabase.from("social_snapshots").upsert({
                company_id: co.id,
                platform: "instagram",
                handle: co.instagram,
                followers: user.follower_count,
                following: user.following_count,
                posts_count: user.media_count,
                snapshot_date: today,
                raw_data: user,
              }, { onConflict: "company_id,platform,snapshot_date" });
              totalItems++;
            }
            await incrementBudget(supabase, "rapidapi_instagram");
          } catch (err) {
            console.error(`IG failed for ${co.name}:`, err.message);
          }
        }
      }

      // TikTok
      if (co.tiktok) {
        const budget = await checkBudget(supabase, "rapidapi_tiktok");
        if (budget.allowed) {
          try {
            const data = await withRetry(() => fetchTikTok(co.tiktok, apiKey));
            const user = data?.data?.user;
            const stats = data?.data?.stats;
            if (user || stats) {
              await supabase.from("social_snapshots").upsert({
                company_id: co.id,
                platform: "tiktok",
                handle: co.tiktok,
                followers: stats?.followerCount,
                following: stats?.followingCount,
                posts_count: stats?.videoCount,
                avg_views: stats?.heartCount ? Math.round(stats.heartCount / Math.max(stats.videoCount, 1)) : null,
                snapshot_date: today,
                raw_data: data?.data,
              }, { onConflict: "company_id,platform,snapshot_date" });
              totalItems++;
            }
            await incrementBudget(supabase, "rapidapi_tiktok");
          } catch (err) {
            console.error(`TT failed for ${co.name}:`, err.message);
          }
        }
      }

      // 1 second delay between companies
      await new Promise(r => setTimeout(r, 1000));
    }

    await logRun(supabase, "social", "success", totalItems, undefined, Date.now() - start);

    return jsonResponse({ ok: true, items: totalItems, duration_ms: Date.now() - start });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message }, 500);
  }
});
