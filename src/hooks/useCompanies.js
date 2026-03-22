import { supabase } from "../lib/supabase";
import useSupabaseQuery from "./useSupabaseQuery";

export default function useCompanies() {
  return useSupabaseQuery("companies", async () => {
    // Fetch companies with all related data in parallel
    const [
      { data: companies, error: e1 },
      { data: metrics, error: e2 },
      { data: scores, error: e3 },
      { data: spark, error: e4 },
      { data: rounds, error: e5 },
      { data: comps, error: e6 },
      { data: ctags, error: e7 },
      { data: tags, error: e8 },
      { data: signals, error: e9 },
    ] = await Promise.all([
      supabase.from("companies").select("*").order("momentum", { ascending: false }),
      supabase.from("company_metrics").select("*"),
      supabase.from("company_scores").select("*"),
      supabase.from("spark_data").select("*").order("month_idx"),
      supabase.from("funding_rounds").select("*").order("sort_order"),
      supabase.from("competitors").select("*"),
      supabase.from("company_tags").select("company_id, tag_id"),
      supabase.from("tags").select("*"),
      supabase.from("signals").select("*").order("created_at", { ascending: false }),
    ]);

    const err = e1 || e2 || e3 || e4 || e5 || e6 || e7 || e8 || e9;
    if (err) throw err;

    // Build a tag lookup
    const tagMap = Object.fromEntries(tags.map(t => [t.id, t]));

    // Assemble each company with its related data
    return companies.map(co => {
      const coMetrics = metrics.filter(m => m.company_id === co.id);
      const coScores = scores.filter(s => s.company_id === co.id);
      const coSpark = spark.filter(s => s.company_id === co.id).map(s => s.value);
      const coRounds = rounds.filter(r => r.company_id === co.id);
      const coComps = comps.filter(c => c.company_id === co.id).map(c => c.name);
      const coTagIds = ctags.filter(ct => ct.company_id === co.id).map(ct => ct.tag_id);
      const coTags = coTagIds.map(tid => tagMap[tid]).filter(Boolean).map(t => ({ l: t.label, t: t.css_class }));
      const coSignals = signals.filter(s => s.company_id === co.id);

      // Extract sort values for social growth and revenue growth
      const socialMet  = coMetrics.find(m => m.label === "Social Growth");
      const revenueMet = coMetrics.find(m => m.label === "Revenue Growth");

      return {
        id: co.id,
        name: co.name,
        tag: co.tag,
        logo: co.logo,
        m: Number(co.momentum),
        mc: co.momentum_color,
        cat: co.cat,
        hq: co.hq,
        founded: co.founded,
        employees: co.employees,
        raised: co.raised,
        channels: co.channels,
        revenue_est: co.revenue_est,
        social_num:  socialMet  ? Number(socialMet.sort_value)  : 0,
        revenue_num: revenueMet ? Number(revenueMet.sort_value) : 0,
        metrics: coMetrics.map(m => ({ l: m.label, v: m.value, c: m.css_class })),
        scores: coScores.map(s => ({ n: s.name, s: Number(s.score), c: s.css_class })),
        spark: coSpark.length ? coSpark.map(Number) : [0],
        rounds: coRounds.map(r => ({ type: r.round_type, amount: r.amount, date: r.date, lead: r.lead })),
        competitors: coComps,
        tags: coTags,
        signals: coSignals.map(s => ({ text: s.text, time: s.time_label })),
      };
    });
  });
}
