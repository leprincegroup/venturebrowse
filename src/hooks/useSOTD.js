import { useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useRealtime } from "../contexts/RealtimeContext";
import useSupabaseQuery from "./useSupabaseQuery";

export default function useSOTD() {
  const [realtimeSotd, setRealtimeSotd] = useState(null);

  const result = useSupabaseQuery("sotd", async () => {
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

  // Listen for new SOTD via Realtime
  useRealtime("sotd:new", useCallback((newSotd) => {
    setRealtimeSotd({
      name: newSotd.name,
      italic: newSotd.italic,
      desc: newSotd.description,
      tags: newSotd.tags || [],
      sigs: newSotd.sigs || [],
      scores: newSotd.scores || [],
    });
  }, []));

  return { ...result, data: realtimeSotd || result.data };
}
