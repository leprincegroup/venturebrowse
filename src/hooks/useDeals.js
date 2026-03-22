import { useMemo } from "react";
import { BRANDS } from "../data";

export default function useDeals({ statusFilter = "All", categoryFilter = "All", sort = "name", search = "" } = {}) {
  const brands = useMemo(() => {
    let out = BRANDS;
    if (statusFilter === "Looking to Sell") out = out.filter(b => b.status === "looking-to-sell");
    else if (statusFilter === "Growth Stalled") out = out.filter(b => b.status === "growth-stalled");
    else if (statusFilter === "Open to Consulting") out = out.filter(b => b.status === "open-to-consulting");
    else if (statusFilter === "Growing") out = out.filter(b => b.status === "growing");
    if (categoryFilter !== "All") out = out.filter(b => b.category === categoryFilter);
    if (search) out = out.filter(b => b.name.toLowerCase().includes(search.toLowerCase()) || b.category.toLowerCase().includes(search.toLowerCase()));
    return out.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "red") return (b.redFlags?.length || 0) - (a.redFlags?.length || 0);
      if (sort === "green") return (b.greenFlags?.length || 0) - (a.greenFlags?.length || 0);
      if (sort === "gaps") return b.gaps.length - a.gaps.length;
      if (sort === "traffic") return (b.trafficTrend?.[b.trafficTrend.length-1] || 0) - (a.trafficTrend?.[a.trafficTrend.length-1] || 0);
      if (sort === "recent") return new Date(b.lastActivity || 0) - new Date(a.lastActivity || 0);
      return 0;
    });
  }, [statusFilter, categoryFilter, sort, search]);

  return { brands, loading: false };
}
