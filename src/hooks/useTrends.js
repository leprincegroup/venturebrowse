import { useMemo } from "react";
import { MARKET_TRENDS } from "../data";

export default function useTrends({ sourceFilter = "All", search = "", sort = "trend" } = {}) {
  const trends = useMemo(() => {
    let out = MARKET_TRENDS;
    if (sourceFilter !== "All") out = out.filter(t => t.source === sourceFilter.toLowerCase());
    if (search) out = out.filter(t => t.keyword.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
    return out.sort((a, b) => {
      if (sort === "trend") return b.trendScore - a.trendScore;
      if (sort === "growth") return b.growth - a.growth;
      if (sort === "volume") return b.volume - a.volume;
      if (sort === "name") return a.keyword.localeCompare(b.keyword);
      return 0;
    });
  }, [sourceFilter, search, sort]);

  return { trends, loading: false };
}
