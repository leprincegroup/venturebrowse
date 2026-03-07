import { supabase } from "../lib/supabase";
import useSupabaseQuery from "./useSupabaseQuery";

export default function useInvestors() {
  return useSupabaseQuery("investors", async () => {
    const [
      { data: investors, error: e1 },
      { data: stats, error: e2 },
      { data: focus, error: e3 },
      { data: activity, error: e4 },
    ] = await Promise.all([
      supabase.from("investors").select("*"),
      supabase.from("investor_stats").select("*"),
      supabase.from("investor_focus").select("*"),
      supabase.from("investor_activity").select("*").order("month_idx"),
    ]);

    const err = e1 || e2 || e3 || e4;
    if (err) throw err;

    return investors.map(inv => ({
      name: inv.name,
      type: inv.type,
      init: inv.initials,
      badge: { l: inv.badge_label, t: inv.badge_class },
      stats: stats.filter(s => s.investor_id === inv.id).map(s => ({ l: s.label, v: s.value })),
      focus: focus.filter(f => f.investor_id === inv.id).map(f => ({ l: f.label, t: f.css_class })),
      act: activity.filter(a => a.investor_id === inv.id).map(a => a.value),
    }));
  });
}
