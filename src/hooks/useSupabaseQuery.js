import { useState, useEffect, useRef } from "react";

/**
 * Generic Supabase query hook with stale-while-revalidate caching.
 * Caches results in memory so tab switches don't refetch.
 */
const cache = new Map();

export default function useSupabaseQuery(key, queryFn, deps = []) {
  const [data, setData] = useState(() => cache.get(key) ?? null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!cache.has(key));
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    async function run() {
      // If cached, show stale data immediately but still revalidate
      if (!cache.has(key)) setLoading(true);

      try {
        const result = await queryFn();
        if (cancelled) return;
        cache.set(key, result);
        setData(result);
        setError(null);
      } catch (e) {
        if (cancelled) return;
        setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => { cancelled = true; mountedRef.current = false; };
  }, deps);

  return { data, error, loading };
}

export function invalidateCache(keyPrefix) {
  for (const k of cache.keys()) {
    if (k.startsWith(keyPrefix)) cache.delete(k);
  }
}
