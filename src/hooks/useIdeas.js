import { useMemo } from "react";
import { IDEA_CATEGORIES, IDEA_PROBLEMS, IDEA_OPPORTUNITIES } from "../data";

export default function useIdeas({ categoryFilter = "All", sourceFilter = "All", search = "" } = {}) {
  const categories = useMemo(() => {
    let out = IDEA_CATEGORIES;
    if (search) out = out.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    return out.sort((a, b) => b.trendScore - a.trendScore);
  }, [search]);

  const problems = useMemo(() => {
    let out = IDEA_PROBLEMS;
    if (categoryFilter !== "All") {
      const cat = IDEA_CATEGORIES.find(c => c.name === categoryFilter);
      if (cat) out = out.filter(p => p.categoryId === cat.id);
    }
    if (sourceFilter !== "All") {
      out = out.filter(p => p.sources.some(s => s.platform === sourceFilter.toLowerCase()));
    }
    if (search) out = out.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    return out.sort((a, b) => b.growthRate - a.growthRate);
  }, [categoryFilter, sourceFilter, search]);

  const opportunities = useMemo(() => {
    let out = IDEA_OPPORTUNITIES;
    if (categoryFilter !== "All") {
      const cat = IDEA_CATEGORIES.find(c => c.name === categoryFilter);
      if (cat) out = out.filter(o => o.categoryId === cat.id);
    }
    if (search) out = out.filter(o => o.title.toLowerCase().includes(search.toLowerCase()));
    return out.sort((a, b) => b.validationScore - a.validationScore);
  }, [categoryFilter, search]);

  return { categories, problems, opportunities, loading: false };
}
