import { supabase } from "../lib/supabase";
import useSupabaseQuery from "./useSupabaseQuery";

export default function useCategories() {
  return useSupabaseQuery("categories", async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("id");

    if (error) throw error;

    return data.map(c => ({
      icon: c.icon,
      name: c.name,
      sub: c.sub,
      count: c.count,
      growth: c.growth,
    }));
  });
}
