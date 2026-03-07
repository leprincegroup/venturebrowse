import { useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useRealtime } from "../contexts/RealtimeContext";
import useSupabaseQuery from "./useSupabaseQuery";

export default function useSignals() {
  const [realtimeSignals, setRealtimeSignals] = useState([]);

  const result = useSupabaseQuery("signals", async () => {
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

  // Prepend new signals from Realtime without refetching
  useRealtime("signal:new", useCallback((newSignal) => {
    setRealtimeSignals(prev => {
      // Avoid duplicates
      if (prev.some(s => s.id === newSignal.id)) return prev;
      return [{
        id: newSignal.id,
        co: newSignal.co_name,
        coId: newSignal.company_id,
        type: newSignal.type,
        text: newSignal.text,
        time: "just now",
        severity: newSignal.severity,
      }, ...prev].slice(0, 10); // keep max 10 realtime signals
    });
  }, []));

  // Merge realtime signals on top of fetched ones
  const mergedData = result.data
    ? [...realtimeSignals, ...result.data.filter(s =>
        !realtimeSignals.some(r => r.id === s.id)
      )].slice(0, 20)
    : realtimeSignals.length ? realtimeSignals : null;

  return { ...result, data: mergedData };
}
