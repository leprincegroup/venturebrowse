// ingest-company: Enrich company data from Crunchbase + Wappalyzer
// Source: Crunchbase Basic API (200/mo free), Wappalyzer (50/mo free)
// Schedule: Monthly on 1st at 2AM UTC
// Cost: $0

import { getServiceClient, corsHeaders, withRetry, checkBudget, incrementBudget, logRun, jsonResponse } from "../_shared/utils.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const start = Date.now();
  try {
    const supabase = getServiceClient();
    const crunchbaseKey = Deno.env.get("CRUNCHBASE_KEY");
    const wappalyzerKey = Deno.env.get("WAPPALYZER_KEY");

    const { data: companies } = await supabase
      .from("companies")
      .select("id, name, domain, crunchbase_slug")
      .eq("status", "active");

    if (!companies?.length) return jsonResponse({ ok: true, items: 0 });

    let totalItems = 0;

    for (const co of companies) {
      const enrichment: any = { company_id: co.id, source: "crunchbase" };

      // Crunchbase enrichment
      if (crunchbaseKey && co.crunchbase_slug) {
        const budget = await checkBudget(supabase, "crunchbase", "monthly");
        if (budget.allowed) {
          try {
            const url = `https://api.crunchbase.com/api/v4/entities/organizations/${co.crunchbase_slug}?user_key=${crunchbaseKey}&field_ids=num_employees_enum,short_description,funding_total,last_funding_type,founded_on,location_identifiers,investor_identifiers`;
            const res = await withRetry(() => fetch(url));
            if (res.ok) {
              const data = await res.json();
              const props = data?.properties || {};
              enrichment.employee_range = props.num_employees_enum;
              enrichment.total_funding_usd = props.funding_total?.value_usd ? Math.round(props.funding_total.value_usd * 100) : null;
              enrichment.last_funding_type = props.last_funding_type;
              enrichment.headquarters = props.location_identifiers?.[0]?.value;
              enrichment.crunchbase_url = `https://crunchbase.com/organization/${co.crunchbase_slug}`;
              enrichment.investor_names = (props.investor_identifiers || []).map((i: any) => i.value).slice(0, 10);
            }
            await incrementBudget(supabase, "crunchbase", "monthly");
          } catch (err) {
            console.error(`Crunchbase failed for ${co.name}:`, err.message);
          }
        }
      }

      // Wappalyzer tech stack detection
      if (wappalyzerKey && co.domain) {
        const budget = await checkBudget(supabase, "wappalyzer", "monthly");
        if (budget.allowed) {
          try {
            const url = `https://api.wappalyzer.com/v2/lookup/?urls=https://${co.domain}&sets=all`;
            const res = await withRetry(() => fetch(url, {
              headers: { "x-api-key": wappalyzerKey },
            }));
            if (res.ok) {
              const data = await res.json();
              const techs = data?.[0]?.technologies || [];
              enrichment.tech_stack = techs.map((t: any) => t.name).slice(0, 20);
              enrichment.tech_categories = {};
              for (const t of techs) {
                for (const cat of (t.categories || [])) {
                  enrichment.tech_categories[cat.name] = t.name;
                }
              }
            }
            await incrementBudget(supabase, "wappalyzer", "monthly");
          } catch (err) {
            console.error(`Wappalyzer failed for ${co.name}:`, err.message);
          }
        }
      }

      enrichment.enriched_at = new Date().toISOString();
      await supabase.from("company_enrichment").upsert(enrichment, { onConflict: "company_id,source" });
      totalItems++;

      await new Promise(r => setTimeout(r, 2000));
    }

    await logRun(supabase, "company-enrichment", "success", totalItems, undefined, Date.now() - start);
    return jsonResponse({ ok: true, items: totalItems, duration_ms: Date.now() - start });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message }, 500);
  }
});
