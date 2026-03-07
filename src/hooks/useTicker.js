import { supabase } from "../lib/supabase";
import useSupabaseQuery from "./useSupabaseQuery";

export default function useTicker() {
  return useSupabaseQuery("ticker", async () => {
    const { data, error } = await supabase
      .from("ticker_data")
      .select("*")
      .order("sort_order");

    if (error) throw error;

    return data.map(t => ({
      name: t.name,
      v: t.value,
      d: t.delta,
      up: t.is_up,
    }));
  });
}
