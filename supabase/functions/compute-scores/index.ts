import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Momentum weights (must sum to 1.0)
const WEIGHTS: Record<string, number> = {
  "Hiring Signal": 0.2,
  "Traffic Growth": 0.15,
  "Funding Proximity": 0.15,
  "Product Velocity": 0.15,
  "Social Buzz": 0.1,
  "Category Strength": 0.1,
  "Team Quality": 0.1,
  "Revenue Traction": 0.05,
};

function momentumColor(m: number): string {
  if (m >= 70) return "#1a7a52"; // green
  if (m >= 40) return "#8a5e0a"; // amber
  return "#9b2c2c"; // red
}

// Map signal types to score dimensions
function signalDimension(type: string): string | null {
  switch (type) {
    case "hiring":
      return "Hiring Signal";
    case "traffic":
      return "Traffic Growth";
    case "funding":
      return "Funding Proximity";
    case "product":
      return "Product Velocity";
    case "signal":
    case "event":
      return "Social Buzz";
    default:
      return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Find last compute-scores run
    const { data: lastRun } = await supabase
      .from("ingestion_runs")
      .select("last_run_at")
      .eq("source", "compute-scores")
      .single();

    const since = lastRun?.last_run_at || new Date(0).toISOString();

    // Find companies with new signals since last run
    const { data: recentSignals } = await supabase
      .from("signals")
      .select("company_id, type, severity")
      .gt("created_at", since)
      .not("company_id", "is", null);

    if (!recentSignals?.length) {
      // Update run timestamp even if nothing to do
      await supabase.from("ingestion_runs").upsert(
        {
          source: "compute-scores",
          last_run_at: new Date().toISOString(),
          items_found: 0,
          status: "success",
          error: null,
        },
        { onConflict: "source" },
      );

      return new Response(
        JSON.stringify({ ok: true, updated: 0, msg: "No new signals" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Group signals by company
    const companySignals = new Map<
      number,
      { type: string; severity: string }[]
    >();
    for (const s of recentSignals) {
      if (!s.company_id) continue;
      if (!companySignals.has(s.company_id)) {
        companySignals.set(s.company_id, []);
      }
      companySignals.get(s.company_id)!.push({
        type: s.type,
        severity: s.severity,
      });
    }

    let updatedCount = 0;

    for (const [companyId, signals] of companySignals) {
      // Get current scores for this company
      const { data: currentScores } = await supabase
        .from("company_scores")
        .select("name, score")
        .eq("company_id", companyId);

      const scoreMap = new Map<string, number>();
      for (const s of currentScores ?? []) {
        scoreMap.set(s.name, Number(s.score));
      }

      // Boost dimensions based on new signals
      for (const sig of signals) {
        const dim = signalDimension(sig.type);
        if (!dim) continue;

        const current = scoreMap.get(dim) ?? 5.0;
        const boost =
          sig.severity === "high" ? 0.3 : sig.severity === "medium" ? 0.2 : 0.1;
        const newScore = Math.min(10, current + boost);
        scoreMap.set(dim, newScore);
      }

      // Upsert updated scores
      for (const [name, score] of scoreMap) {
        const css = score >= 7 ? "sf-g" : score >= 4 ? "sf-a" : "sf-r";
        await supabase.from("company_scores").upsert(
          {
            company_id: companyId,
            name,
            score: Math.round(score * 10) / 10,
            css_class: css,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "company_id,name" },
        );
      }

      // Calculate weighted momentum
      let momentum = 0;
      for (const [dim, weight] of Object.entries(WEIGHTS)) {
        const score = scoreMap.get(dim) ?? 5.0;
        momentum += score * weight * 10; // scale 0-10 → 0-100
      }
      momentum = Math.round(Math.min(100, Math.max(0, momentum)) * 10) / 10;

      // Update company momentum
      await supabase
        .from("companies")
        .update({
          momentum,
          momentum_color: momentumColor(momentum),
        })
        .eq("id", companyId);

      updatedCount++;
    }

    // Update ticker data with fresh aggregates
    const { data: allCompanies } = await supabase
      .from("companies")
      .select("name, momentum")
      .eq("status", "active")
      .order("momentum", { ascending: false });

    if (allCompanies?.length) {
      const avgMomentum =
        allCompanies.reduce((s, c) => s + Number(c.momentum), 0) /
        allCompanies.length;

      // Count signals from today
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const { count: signalsToday } = await supabase
        .from("signals")
        .select("id", { count: "exact", head: true })
        .gte("created_at", todayStart.toISOString());

      await supabase.from("ticker_data").upsert(
        {
          name: "Avg Momentum",
          value: avgMomentum.toFixed(1),
          delta: null,
          is_up: true,
          sort_order: 100,
        },
        { onConflict: "name" },
      );

      // Note: ticker_data doesn't have a UNIQUE on name, so we delete+insert
      await supabase
        .from("ticker_data")
        .delete()
        .eq("name", "Signals Today");
      await supabase.from("ticker_data").insert({
        name: "Signals Today",
        value: String(signalsToday ?? 0),
        delta: null,
        is_up: true,
        sort_order: 101,
      });
    }

    // Record run
    await supabase.from("ingestion_runs").upsert(
      {
        source: "compute-scores",
        last_run_at: new Date().toISOString(),
        items_found: updatedCount,
        status: "success",
        error: null,
      },
      { onConflict: "source" },
    );

    return new Response(
      JSON.stringify({ ok: true, updated: updatedCount }),
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
          source: "compute-scores",
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
