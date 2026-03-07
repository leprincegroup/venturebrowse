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

    // Check if SOTD already exists for today
    const today = new Date().toISOString().split("T")[0];
    const { data: existing } = await supabase
      .from("signal_of_the_day")
      .select("id")
      .eq("selected_at", today)
      .limit(1);

    if (existing?.length) {
      return new Response(
        JSON.stringify({ ok: true, msg: "SOTD already selected for today" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Get companies that haven't been SOTD in last 7 days
    const weekAgo = new Date(Date.now() - 7 * 86400000)
      .toISOString()
      .split("T")[0];
    const { data: recentSotd } = await supabase
      .from("signal_of_the_day")
      .select("company_id")
      .gte("selected_at", weekAgo);

    const excludeIds = (recentSotd ?? [])
      .map((s) => s.company_id)
      .filter(Boolean);

    // Get top company by momentum, excluding recent SOTDs
    let query = supabase
      .from("companies")
      .select("id, name, tag, momentum")
      .eq("status", "active")
      .order("momentum", { ascending: false })
      .limit(1);

    if (excludeIds.length) {
      query = query.not("id", "in", `(${excludeIds.join(",")})`);
    }

    const { data: candidates } = await query;

    if (!candidates?.length) {
      return new Response(
        JSON.stringify({ ok: true, msg: "No eligible companies" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const co = candidates[0];

    // Fetch company details for SOTD card
    const [tagsRes, signalsRes, scoresRes, metricsRes] = await Promise.all([
      supabase
        .from("company_tags")
        .select("tag_id, tags(label, css_class)")
        .eq("company_id", co.id),
      supabase
        .from("signals")
        .select("type, text, severity")
        .eq("company_id", co.id)
        .order("created_at", { ascending: false })
        .limit(4),
      supabase
        .from("company_scores")
        .select("name, score, css_class")
        .eq("company_id", co.id),
      supabase
        .from("company_metrics")
        .select("label, value, css_class")
        .eq("company_id", co.id),
    ]);

    // Build JSONB fields
    const tags = (tagsRes.data ?? []).map((t: Record<string, unknown>) => {
      const tag = t.tags as { label: string; css_class: string } | null;
      return { l: tag?.label ?? "", t: tag?.css_class ?? "tm" };
    });

    // Add momentum as first metric-style tag
    const metricTags = (metricsRes.data ?? [])
      .filter((m: { label: string }) =>
        m.label === "Hiring Δ" || m.label === "Traffic Δ",
      )
      .map((m: { label: string; value: string; css_class: string | null }) => ({
        l: `${m.label} ${m.value}`,
        t: m.css_class === "g" ? "ta" : "tm",
      }));

    const sotdTags = [...tags, ...metricTags];

    const sigs = [
      {
        l: "Momentum",
        v: `${co.momentum}/100`,
        c: Number(co.momentum) >= 80 ? "sv-g" : "sv-a",
      },
      ...(metricsRes.data ?? []).map(
        (m: { label: string; value: string; css_class: string | null }) => ({
          l: m.label,
          v: m.value,
          c: m.css_class === "g" ? "sv-g" : "sv-a",
        }),
      ),
    ];

    const scores = (scoresRes.data ?? []).map(
      (s: { name: string; score: number; css_class: string }) => ({
        n: s.name,
        s: Number(s.score),
        c: s.css_class,
      }),
    );

    // Build description from recent signals
    const signalTexts = (signalsRes.data ?? [])
      .slice(0, 3)
      .map((s: { text: string }) => s.text);
    const description = signalTexts.length
      ? signalTexts.join(". ") + "."
      : co.tag ?? `${co.name} is showing strong momentum signals.`;

    // Insert SOTD
    await supabase.from("signal_of_the_day").insert({
      company_id: co.id,
      name: co.name,
      italic: co.tag?.split(" ").slice(0, 3).join(" ").toLowerCase() ?? "",
      description,
      selected_at: today,
      tags: sotdTags,
      sigs,
      scores,
    });

    return new Response(
      JSON.stringify({ ok: true, company: co.name }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
