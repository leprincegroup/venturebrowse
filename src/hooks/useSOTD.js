import { supabase } from "../lib/supabase";
import useSupabaseQuery from "./useSupabaseQuery";

export default function useSOTD() {
  return useSupabaseQuery("sotd", async () => {
    const { data, error } = await supabase
      .from("signal_of_the_day")
      .select("*")
      .order("selected_at", { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;

    return {
      name: data.name,
      italic: data.italic,
      desc: data.description,
      tags: data.tags || [],
      sigs: data.sigs || [],
      scores: data.scores || [],
    };
  });
}
