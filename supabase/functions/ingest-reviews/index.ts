// ingest-reviews: Scrape Trustpilot JSON-LD for ratings
// Source: Trustpilot HTML (free, JSON-LD embedded in page)
// Schedule: Weekly on Wednesday at 3AM UTC
// Cost: $0

import { getServiceClient, corsHeaders, withRetry, checkBudget, logRun, jsonResponse } from "../_shared/utils.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const start = Date.now();
  try {
    const supabase = getServiceClient();

    const { data: companies } = await supabase
      .from("companies")
      .select("id, name, trustpilot_domain, domain")
      .eq("status", "active");

    if (!companies?.length) return jsonResponse({ ok: true, items: 0 });

    let totalItems = 0;
    const today = new Date().toISOString().split("T")[0];

    for (const co of companies) {
      const tpDomain = co.trustpilot_domain || co.domain;
      if (!tpDomain) continue;

      try {
        const url = `https://www.trustpilot.com/review/${tpDomain}`;
        const res = await withRetry(() => fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; VentureBrowse/1.0)",
            "Accept": "text/html",
          },
        }));

        if (!res.ok) continue;
        const html = await res.text();

        // Extract JSON-LD structured data
        const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
        if (!jsonLdMatch) continue;

        for (const match of jsonLdMatch) {
          try {
            const json = match.replace(/<script type="application\/ld\+json">/, "").replace(/<\/script>/, "");
            const ld = JSON.parse(json);

            if (ld["@type"] === "LocalBusiness" || ld.aggregateRating) {
              const ar = ld.aggregateRating || {};
              await supabase.from("review_snapshots").upsert({
                company_id: co.id,
                platform: "trustpilot",
                external_id: tpDomain,
                rating: parseFloat(ar.ratingValue) || null,
                review_count: parseInt(ar.reviewCount) || null,
                trust_score: parseFloat(ar.ratingValue) || null,
                snapshot_date: today,
              }, { onConflict: "company_id,platform,external_id,snapshot_date" });

              totalItems++;
              break;
            }
          } catch { /* skip malformed JSON-LD */ }
        }

        // 3 second delay to be respectful
        await new Promise(r => setTimeout(r, 3000));
      } catch (err) {
        console.error(`Trustpilot failed for ${co.name}:`, err.message);
      }
    }

    await logRun(supabase, "trustpilot", "success", totalItems, undefined, Date.now() - start);

    return jsonResponse({ ok: true, items: totalItems, duration_ms: Date.now() - start });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message }, 500);
  }
});
