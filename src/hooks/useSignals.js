import { supabase } from "../lib/supabase";
import useSupabaseQuery from "./useSupabaseQuery";

export default function useSignals() {
  return useSupabaseQuery("signals", async () => {
    const { data, error } = await supabase
      .from("signals")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    return data.map(s => ({
      id: s.id,
      co: s.co_name,
      coId: s.company_id,
      type: s.type,
      text: s.text,
      time: s.time_label,
      severity: s.severity,
    }));
  });
}
