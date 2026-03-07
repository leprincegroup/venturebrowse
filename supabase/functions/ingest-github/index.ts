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

    // Get last known state (JSON map of org -> {stars, repos})
    const { data: run } = await supabase
      .from("ingestion_runs")
      .select("last_cursor")
      .eq("source", "github")
      .single();

    let lastState: Record<string, { stars: number; repos: number }> = {};
    if (run?.last_cursor) {
      try {
        lastState = JSON.parse(run.last_cursor);
      } catch { /* start fresh */ }
    }

    // Get companies with GitHub orgs
    const { data: companies } = await supabase
      .from("companies")
      .select("id, name, slug, github")
      .eq("status", "active")
      .not("github", "is", null);

    if (!companies?.length) {
      return new Response(
        JSON.stringify({ ok: true, items: 0, msg: "No companies with GitHub" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let totalItems = 0;
    const newState: Record<string, { stars: number; repos: number }> = {};

    for (const co of companies) {
      if (!co.github) continue;

      // Fetch org repos (sorted by stars)
      const res = await fetch(
        `https://api.github.com/orgs/${co.github}/repos?sort=stars&per_page=10&direction=desc`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "VentureBrowse/1.0",
          },
        },
      );

      // Fall back to user endpoint if org not found
      let repos;
      if (res.status === 404) {
        const userRes = await fetch(
          `https://api.github.com/users/${co.github}/repos?sort=stars&per_page=10&direction=desc`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
              "User-Agent": "VentureBrowse/1.0",
            },
          },
        );
        if (!userRes.ok) continue;
        repos = await userRes.json();
      } else if (!res.ok) {
        continue;
      } else {
        repos = await res.json();
      }

      if (!Array.isArray(repos) || !repos.length) continue;

      // Aggregate current stats
      const totalStars = repos.reduce(
        (sum: number, r: { stargazers_count?: number }) =>
          sum + (r.stargazers_count ?? 0),
        0,
      );
      const repoCount = repos.length;

      newState[co.github] = { stars: totalStars, repos: repoCount };

      const prev = lastState[co.github];

      if (prev) {
        // Check for notable star milestones
        const starDelta = totalStars - prev.stars;
        if (starDelta > 0) {
          // Check if crossed a round milestone
          const milestones = [1000, 5000, 10000, 25000, 50000, 100000];
          for (const m of milestones) {
            if (prev.stars < m && totalStars >= m) {
              const formatted =
                m >= 1000 ? `${Math.floor(m / 1000)}K` : String(m);

              // Deduplicate
              const { data: existing } = await supabase
                .from("signals")
                .select("id")
                .eq("company_id", co.id)
                .eq("source", "github")
                .ilike("text", `%${formatted} stars%`)
                .limit(1);

              if (!existing?.length) {
                await supabase.from("signals").insert({
                  company_id: co.id,
                  co_name: co.name,
                  type: "product",
                  text: `GitHub repos surpassed ${formatted} total stars across ${repoCount} repositories`,
                  severity: m >= 50000 ? "high" : m >= 10000 ? "medium" : "low",
                  source: "github",
                  source_url: `https://github.com/${co.github}`,
                  time_label: "just now",
                });
                totalItems++;
              }
            }
          }

          // Significant star growth (>5% since last check)
          const growthPct = (starDelta / prev.stars) * 100;
          if (growthPct >= 5 && starDelta >= 100) {
            const { data: existing } = await supabase
              .from("signals")
              .select("id")
              .eq("company_id", co.id)
              .eq("source", "github")
              .gte(
                "created_at",
                new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
              )
              .ilike("text", "%star growth%")
              .limit(1);

            if (!existing?.length) {
              await supabase.from("signals").insert({
                company_id: co.id,
                co_name: co.name,
                type: "product",
                text: `GitHub star growth: +${starDelta.toLocaleString()} stars (+${growthPct.toFixed(1)}%) since last check`,
                severity: growthPct >= 20 ? "high" : "medium",
                source: "github",
                source_url: `https://github.com/${co.github}`,
                time_label: "just now",
              });
              totalItems++;
            }
          }
        }

        // New repo created
        if (repoCount > prev.repos) {
          const newRepos = repos
            .filter(
              (r: { created_at?: string }) =>
                r.created_at &&
                new Date(r.created_at).getTime() >
                  Date.now() - 24 * 3600 * 1000,
            )
            .slice(0, 3);

          for (const repo of newRepos) {
            const { data: existing } = await supabase
              .from("signals")
              .select("id")
              .eq("source_url", repo.html_url)
              .limit(1);

            if (!existing?.length) {
              await supabase.from("signals").insert({
                company_id: co.id,
                co_name: co.name,
                type: "product",
                text: `New GitHub repo: ${repo.name}${repo.description ? ` — ${repo.description.slice(0, 80)}` : ""}`,
                severity: "low",
                source: "github",
                source_url: repo.html_url,
                time_label: "just now",
              });
              totalItems++;
            }
          }
        }
      }
      // First run for this company — just record baseline, no signals
    }

    // Upsert ingestion run
    await supabase.from("ingestion_runs").upsert(
      {
        source: "github",
        last_cursor: JSON.stringify(newState),
        last_run_at: new Date().toISOString(),
        items_found: totalItems,
        status: "success",
        error: null,
      },
      { onConflict: "source" },
    );

    return new Response(
      JSON.stringify({ ok: true, items: totalItems, state: newState }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );
      await supabase.from("ingestion_runs").upsert(
        {
          source: "github",
          last_run_at: new Date().toISOString(),
          items_found: 0,
          status: "error",
          error: String(err),
        },
        { onConflict: "source" },
      );
    } catch { /* ignore */ }

    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
