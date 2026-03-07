import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Get last cursor (unix timestamp)
    const { data: run } = await supabase
      .from("ingestion_runs")
      .select("last_cursor")
      .eq("source", "hacker-news")
      .single();

    const lastCursor = run?.last_cursor
      ? parseInt(run.last_cursor, 10)
      : Math.floor(Date.now() / 1000) - 7200; // default: 2h ago

    // Get active companies
    const { data: companies } = await supabase
      .from("companies")
      .select("id, name, slug")
      .eq("status", "active");

    if (!companies?.length) {
      return new Response(
        JSON.stringify({ ok: true, items: 0, msg: "No companies" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let totalItems = 0;
    let maxTimestamp = lastCursor;

    for (const co of companies) {
      // Search HN Algolia for company mentions
      const query = encodeURIComponent(co.name);
      const url = `https://hn.algolia.com/api/v1/search?query=${query}&tags=story&numericFilters=created_at_i>${lastCursor}&hitsPerPage=5`;

      const res = await fetch(url);
      if (!res.ok) continue;

      const data = await res.json();
      if (!data.hits?.length) continue;

      for (const hit of data.hits) {
        // Skip low-quality posts
        if ((hit.points ?? 0) < 2) continue;

        const sourceUrl = `https://news.ycombinator.com/item?id=${hit.objectID}`;

        // Deduplicate by source_url
        const { data: existing } = await supabase
          .from("signals")
          .select("id")
          .eq("source_url", sourceUrl)
          .limit(1);

        if (existing?.length) continue;

        // Determine severity based on points
        const points = hit.points ?? 0;
        const severity =
          points >= 100 ? "high" : points >= 20 ? "medium" : "low";

        const title =
          hit.title?.length > 120
            ? hit.title.slice(0, 117) + "..."
            : hit.title;

        await supabase.from("signals").insert({
          company_id: co.id,
          co_name: co.name,
          type: "signal",
          text: `Mentioned on Hacker News: "${title}" (${points} pts, ${hit.num_comments ?? 0} comments)`,
          severity,
          source: "hacker-news",
          source_url: sourceUrl,
          time_label: "just now",
        });

        totalItems++;

        // Track latest timestamp
        if (hit.created_at_i > maxTimestamp) {
          maxTimestamp = hit.created_at_i;
        }
      }
    }

    // Upsert ingestion run
    await supabase.from("ingestion_runs").upsert(
      {
        source: "hacker-news",
        last_cursor: String(maxTimestamp),
        last_run_at: new Date().toISOString(),
        items_found: totalItems,
        status: "success",
        error: null,
      },
      { onConflict: "source" },
    );

    return new Response(
      JSON.stringify({ ok: true, items: totalItems }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    // Log error to ingestion_runs
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );
      await supabase.from("ingestion_runs").upsert(
        {
          source: "hacker-news",
          last_run_at: new Date().toISOString(),
          items_found: 0,
          status: "error",
          error: String(err),
        },
        { onConflict: "source" },
      );
    } catch { /* ignore logging errors */ }

    return new Response(
      JSON.stringify({ error: String(err) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
