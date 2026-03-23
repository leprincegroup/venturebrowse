import { useMemo } from "react";
import { BRANDS } from "../data";
import { computeBrandScore } from "../lib/brandScore";

export default function useDeals({ statusFilter = "All", categoryFilter = "All", claimFilter = "All", sort = "name", search = "" } = {}) {
  const brands = useMemo(() => {
    let out = BRANDS;
    if (statusFilter === "Looking to Sell") out = out.filter(b => b.status === "looking-to-sell");
    else if (statusFilter === "Growth Stalled") out = out.filter(b => b.status === "growth-stalled");
    else if (statusFilter === "Open to Consulting") out = out.filter(b => b.status === "open-to-consulting");
    else if (statusFilter === "Growing") out = out.filter(b => b.status === "growing");
    if (categoryFilter !== "All") out = out.filter(b => b.category === categoryFilter);
    if (claimFilter === "Claimed") out = out.filter(b => b.verification === "claimed" || b.verification === "verified");
    else if (claimFilter === "Unclaimed") out = out.filter(b => b.verification === "unverified");
    if (search) {
      const q = search.toLowerCase();
      out = out.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q) ||
        b.hq.toLowerCase().includes(q) ||
        b.summary?.toLowerCase().includes(q) ||
        b.brandStory?.toLowerCase().includes(q) ||
        (b.relatedCategories || []).some(c => c.toLowerCase().includes(q)) ||
        (b.relatedTrendKeywords || []).some(k => k.toLowerCase().includes(q))
      );
    }
    return out.sort((a, b) => {
      if (sort === "score") return computeBrandScore(b).overall - computeBrandScore(a).overall;
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "red") return (b.redFlags?.length || 0) - (a.redFlags?.length || 0);
      if (sort === "green") return (b.greenFlags?.length || 0) - (a.greenFlags?.length || 0);
      if (sort === "gaps") return b.gaps.length - a.gaps.length;
      if (sort === "traffic") return (b.trafficTrend?.[b.trafficTrend.length-1] || 0) - (a.trafficTrend?.[a.trafficTrend.length-1] || 0);
      if (sort === "recent") return new Date(b.lastActivity || 0) - new Date(a.lastActivity || 0);
      return 0;
    });
  }, [statusFilter, categoryFilter, claimFilter, sort, search]);

  return { brands, loading: false };
}
