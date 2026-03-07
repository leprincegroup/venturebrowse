import { createContext, useContext, useEffect, useRef, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { invalidateCache } from "../hooks/useSupabaseQuery";

const RealtimeContext = createContext(null);

export function RealtimeProvider({ children }) {
  const listenersRef = useRef(new Set());

  const subscribe = useCallback((event, callback) => {
    const entry = { event, callback };
    listenersRef.current.add(entry);
    return () => listenersRef.current.delete(entry);
  }, []);

  const emit = useCallback((event, payload) => {
    for (const entry of listenersRef.current) {
      if (entry.event === event) entry.callback(payload);
    }
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("realtime-updates")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "signals" },
        (payload) => {
          invalidateCache("signals");
          emit("signal:new", payload.new);
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "companies" },
        (payload) => {
          invalidateCache("companies");
          emit("company:updated", payload.new);
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "signal_of_the_day" },
        (payload) => {
          invalidateCache("sotd");
          emit("sotd:new", payload.new);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [emit]);

  return (
    <RealtimeContext.Provider value={{ subscribe }}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime(event, callback) {
  const ctx = useContext(RealtimeContext);
  useEffect(() => {
    if (!ctx) return;
    return ctx.subscribe(event, callback);
  }, [ctx, event, callback]);
}
