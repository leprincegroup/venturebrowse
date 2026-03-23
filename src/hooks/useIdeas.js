import { useMemo } from "react";
import { IDEA_CATEGORIES, VALIDATED_IDEAS } from "../data";

export default function useIdeas({ categoryFilter = "All", ideaTypeFilter = "All", search = "", sort = "validation" } = {}) {
  const ideas = useMemo(() => {
    let out = VALIDATED_IDEAS;
    if (categoryFilter !== "All") {
      const cat = IDEA_CATEGORIES.find(c => c.name === categoryFilter);
      if (cat) out = out.filter(i => i.categoryId === cat.id);
    }
    if (ideaTypeFilter !== "All") {
      out = out.filter(i => i.ideaType === ideaTypeFilter.toLowerCase());
    }
    if (search) out = out.filter(i => i.title.toLowerCase().includes(search.toLowerCase()));
    return out.sort((a, b) => {
      if (sort === "validation") return b.validationScore - a.validationScore;
      if (sort === "growth") return b.growthRate - a.growthRate;
      if (sort === "market") {
        const parse = s => parseFloat(s.replace(/[^0-9.]/g, ""));
        return parse(b.marketSize) - parse(a.marketSize);
      }
      if (sort === "recent") return new Date(b.releasedAt) - new Date(a.releasedAt);
      return 0;
    });
  }, [categoryFilter, ideaTypeFilter, search, sort]);

  return { ideas, categories: IDEA_CATEGORIES, loading: false };
}
