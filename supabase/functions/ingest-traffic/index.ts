// ingest-traffic: Fetch Tranco rank + SimilarWeb estimates
// Source: Tranco List CSV (free), SimilarWeb HTML (free, rate-limited)
// Schedule: Weekly on Monday at 3AM UTC
// Cost: $0

import { getServiceClient, corsHeaders, withRetry, checkBudget, incrementBudget, logRun, jsonResponse } from "../_shared/utils.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const start = Date.now();
  try {
    const supabase = getServiceClient();

    const { data: companies } = await supabase
      .from("companies")
      .select("id, name, domain")
      .eq("status", "active")
      .not("domain", "is", null);

    if (!companies?.length) return jsonResponse({ ok: true, items: 0 });

    let totalItems = 0;
    const today = new Date().toISOString().split("T")[0];

    // Step 1: Download Tranco top-1M list (gzipped CSV)
    let trancoMap: Map<string, number> = new Map();
    try {
      const trancoRes = await fetch("https://tranco-list.eu/top-1m.csv.zip");
      // For Edge Functions, parse the CSV directly (skip zip for now, use the plain CSV endpoint)
      const csvRes = await fetch("https://tranco-list.eu/download/ZQ24G/1000000"); // Latest list ID
      if (csvRes.ok) {
        const csv = await csvRes.text();
        const lines = csv.split("\n");
        for (const line of lines) {
          const [rank, domain] = line.split(",");
          if (domain) trancoMap.set(domain.trim(), parseInt(rank));
        }
      }
    } catch (err) {
      console.error("Tranco download failed:", err.message);
    }

    // Step 2: Match companies to Tranco ranks + scrape SimilarWeb
    for (const co of companies) {
      if (!co.domain) continue;

      const trancoRank = trancoMap.get(co.domain) || null;

      // SimilarWeb scrape (budget-limited)
      let visitsEst: number | null = null;
      const budget = await checkBudget(supabase, "similarweb");
      if (budget.allowed) {
        try {
          const swUrl = `https://www.similarweb.com/website/${co.domain}/`;
          const res = await fetch(swUrl, {
            headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" },
          });
          if (res.ok) {
            const html = await res.text();
            // Extract visits from embedded JSON or meta tags
            const visitsMatch = html.match(/"visits":(\d+)/);
            if (visitsMatch) visitsEst = parseInt(visitsMatch[1]);
          }
          await incrementBudget(supabase, "similarweb");
          await new Promise(r => setTimeout(r, 5000)); // 5s delay
        } catch { /* SimilarWeb scrape is best-effort */ }
      }

      await supabase.from("traffic_snapshots").upsert({
        company_id: co.id,
        domain: co.domain,
        tranco_rank: trancoRank,
        visits_est: visitsEst,
        source: visitsEst ? "similarweb" : "tranco",
        snapshot_date: today,
      }, { onConflict: "company_id,source,snapshot_date" });

      totalItems++;
    }

    await logRun(supabase, "traffic", "success", totalItems, undefined, Date.now() - start);
    return jsonResponse({ ok: true, items: totalItems, duration_ms: Date.now() - start });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message }, 500);
  }
});
