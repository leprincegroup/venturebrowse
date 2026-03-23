import { useState, useEffect } from "react";
import { IDEA_CATEGORIES_FILTER, IDEA_SORTS } from "../../lib/constants";
import useIdeas from "../../hooks/useIdeas";
import IdeaCard from "./IdeaCard";
import IdeaDetailPanel from "./IdeaDetailPanel";

export default function IdeasView({ initialIdea, onClearInitialIdea }) {
  const [catFilter, setCatFilter] = useState("All");
  const [sort, setSort] = useState("validation");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(initialIdea || null);

  useEffect(() => {
    if (initialIdea) {
      setSelected(initialIdea);
      onClearInitialIdea?.();
    }
  }, [initialIdea]);

  const { ideas } = useIdeas({ categoryFilter: catFilter, search, sort });

  return (
    <div className="feed">
      <div className="feed-hdr">
        <div>
          <h2 className="sec-title">Find Ideas</h2>
          <p style={{ color: "var(--ink3)", fontSize: 14, marginTop: 6, fontWeight: 300 }}>
            Business ideas worth building — validated with market data, execution plans, and community signals.
          </p>
        </div>
        <div className="srch">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#aeada5" strokeWidth="1.4" /><path d="M9.5 9.5l3 3" stroke="#aeada5" strokeWidth="1.4" strokeLinecap="round" /></svg>
          <input placeholder="Search ideas…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Sort */}
      <div className="filters">
        {IDEA_SORTS.map(s => (
          <button key={s.k} className={`sbtn${sort === s.k ? " on" : ""}`} onClick={() => setSort(s.k)}>{s.l}</button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="filters" style={{ marginTop: -8 }}>
        {IDEA_CATEGORIES_FILTER.slice(0, 8).map(f => (
          <button key={f} className={`fchip sm${catFilter === f ? " on" : ""}`} onClick={() => setCatFilter(f)}>{f}</button>
        ))}
      </div>

      {/* Grid */}
      {ideas.length > 0 ? (
        <div className="cgrid ideas-grid">
          {ideas.map(idea => <IdeaCard key={idea.id} idea={idea} onSelect={setSelected} />)}
        </div>
      ) : (
        <div style={{ padding: 60, textAlign: "center", border: "1px solid var(--bd)" }}>
          <div style={{ fontSize: 15, color: "var(--ink3)", fontWeight: 300 }}>No ideas match your filters.</div>
          <button className="fchip" style={{ marginTop: 14 }} onClick={() => { setCatFilter("All"); setTypeFilter("All"); setSearch(""); }}>Clear filters</button>
        </div>
      )}

      {selected && <IdeaDetailPanel idea={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
