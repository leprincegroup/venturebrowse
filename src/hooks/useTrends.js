import { useMemo } from "react";
import { MARKET_TRENDS, COMMUNITY_SIGNALS } from "../data";
import { IDEA_CATEGORIES } from "../data";

const SEV_ORDER = { high: 0, medium: 1, low: 2 };

function filterByTimeRange(items, timeRange) {
  if (!timeRange || timeRange === "all") return items;
  const now = new Date();
  const cutoff = new Date(now);
  if (timeRange === "7d") cutoff.setDate(now.getDate() - 7);
  else if (timeRange === "30d") cutoff.setDate(now.getDate() - 30);
  else if (timeRange === "90d") cutoff.setDate(now.getDate() - 90);
  else if (timeRange === "6m") cutoff.setMonth(now.getMonth() - 6);
  return items.filter(item => {
    if (!item.firstSeen) return true;
    return new Date(item.firstSeen) >= cutoff;
  });
}

export default function useTrends({ subTab = "Keyword Trends", sourceFilter = "All", categoryFilter = "All", search = "", sort = "trend", timeRange = "all" } = {}) {
  const keywords = useMemo(() => {
    if (subTab !== "Keyword Trends") return [];
    let out = filterByTimeRange(MARKET_TRENDS, timeRange);
    if (sourceFilter !== "All") out = out.filter(t => t.source === sourceFilter.toLowerCase());
    if (search) out = out.filter(t => t.keyword.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()));
    return out.sort((a, b) => {
      if (sort === "trend") return b.trendScore - a.trendScore;
      if (sort === "growth") return b.growth - a.growth;
      if (sort === "volume") return b.volume - a.volume;
      if (sort === "name") return a.keyword.localeCompare(b.keyword);
      return 0;
    });
  }, [subTab, sourceFilter, search, sort, timeRange]);

  const signals = useMemo(() => {
    if (subTab !== "Community Signals") return [];
    let out = filterByTimeRange(COMMUNITY_SIGNALS, timeRange);
    if (categoryFilter !== "All") {
      const cat = IDEA_CATEGORIES.find(c => c.name === categoryFilter);
      if (cat) out = out.filter(s => s.categoryId === cat.id);
    }
    if (sourceFilter !== "All") {
      out = out.filter(s => s.sources.some(src => src.platform === sourceFilter.toLowerCase()));
    }
    if (search) out = out.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));
    return out.sort((a, b) => {
      if (sort === "growth") return b.growthRate - a.growthRate;
      if (sort === "severity") return (SEV_ORDER[a.severity] ?? 2) - (SEV_ORDER[b.severity] ?? 2);
      if (sort === "mentions") return b.mentionCount - a.mentionCount;
      if (sort === "name") return a.title.localeCompare(b.title);
      return b.growthRate - a.growthRate;
    });
  }, [subTab, categoryFilter, sourceFilter, search, sort, timeRange]);

  return { keywords, signals, loading: false };
}
