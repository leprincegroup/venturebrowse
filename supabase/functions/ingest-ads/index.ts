// ingest-ads: Fetch Meta Ad Library data for each company
// Source: Meta Ad Library API (free, official, requires access token)
// Schedule: Weekly on Tuesday at 3AM UTC
// Cost: $0

import { getServiceClient, corsHeaders, withRetry, logRun, jsonResponse } from "../_shared/utils.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const start = Date.now();
  try {
    const supabase = getServiceClient();
    const accessToken = Deno.env.get("META_ACCESS_TOKEN");
    if (!accessToken) return jsonResponse({ ok: false, error: "META_ACCESS_TOKEN not set" }, 500);

    const { data: companies } = await supabase
      .from("companies")
      .select("id, name, meta_page_id")
      .eq("status", "active")
      .not("meta_page_id", "is", null);

    if (!companies?.length) return jsonResponse({ ok: true, items: 0, msg: "No companies with Meta Page IDs" });

    let totalItems = 0;
    const today = new Date().toISOString().split("T")[0];

    for (const co of companies) {
      try {
        // Search Meta Ad Library by page
        const searchUrl = `https://graph.facebook.com/v19.0/ads_archive?search_page_ids=${co.meta_page_id}&ad_reached_countries=US&ad_active_status=ACTIVE&fields=id,ad_creative_bodies,ad_creative_link_titles,ad_delivery_start_time,ad_delivery_stop_time,page_name&limit=25&access_token=${accessToken}`;

        const res = await withRetry(() => fetch(searchUrl));
        if (!res.ok) continue;

        const data = await res.json();
        const ads = data?.data || [];

        // Count formats
        const formats: Record<string, number> = {};
        const creatives: any[] = [];

        for (const ad of ads) {
          // Track creative
          creatives.push({
            company_id: co.id,
            platform: "meta",
            ad_id: ad.id,
            page_name: ad.page_name,
            body_text: ad.ad_creative_bodies?.[0]?.slice(0, 500),
            cta: ad.ad_creative_link_titles?.[0],
            ad_start_date: ad.ad_delivery_start_time?.split("T")[0],
            ad_end_date: ad.ad_delivery_stop_time?.split("T")[0],
            is_active: true,
            last_seen_at: new Date().toISOString(),
          });
        }

        // Upsert ad snapshot
        await supabase.from("ad_snapshots").upsert({
          company_id: co.id,
          platform: "meta",
          page_id: co.meta_page_id,
          active_ad_count: ads.length,
          ad_formats: formats,
          snapshot_date: today,
        }, { onConflict: "company_id,platform,snapshot_date" });

        // Upsert creatives (batch)
        if (creatives.length > 0) {
          await supabase.from("ad_creatives").upsert(creatives, { onConflict: "platform,ad_id" });
        }

        totalItems += ads.length;

        // 2 second delay
        await new Promise(r => setTimeout(r, 2000));
      } catch (err) {
        console.error(`Meta Ads failed for ${co.name}:`, err.message);
      }
    }

    await logRun(supabase, "meta-ads", "success", totalItems, undefined, Date.now() - start);

    return jsonResponse({ ok: true, items: totalItems, companies: companies.length, duration_ms: Date.now() - start });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message }, 500);
  }
});
