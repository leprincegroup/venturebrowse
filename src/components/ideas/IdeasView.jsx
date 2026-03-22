import { useState } from "react";
import { IDEAS_TABS, IDEA_CATEGORIES_FILTER, IDEA_SOURCES } from "../../lib/constants";
import useIdeas from "../../hooks/useIdeas";
import CategoryCard from "./CategoryCard";
import ProblemCard from "./ProblemCard";
import OpportunityCard from "./OpportunityCard";
import IdeaDetailPanel from "./IdeaDetailPanel";

export default function IdeasView() {
  const [subTab, setSubTab] = useState("Trending");
  const [catFilter, setCatFilter] = useState("All");
  const [srcFilter, setSrcFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [selType, setSelType] = useState(null);

  const { categories, problems, opportunities } = useIdeas({
    categoryFilter: catFilter,
    sourceFilter: srcFilter,
    search,
  });

  function select(item, type) {
    setSelected(item);
    setSelType(type);
  }

  return (
    <div className="feed">
      <div className="feed-hdr">
        <div>
          <h2 className="sec-title">Find Ideas</h2>
          <p style={{ color: "var(--ink3)", fontSize: 14, marginTop: 6, fontWeight: 300 }}>
            Discover trending consumer brand categories, unmet problems, and validated product opportunities.
          </p>
        </div>
        <div className="srch">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#aeada5" strokeWidth="1.4" /><path d="M9.5 9.5l3 3" stroke="#aeada5" strokeWidth="1.4" strokeLinecap="round" /></svg>
          <input placeholder="Search ideas…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="idea-sub-tabs">
        {IDEAS_TABS.map(t => (
          <button key={t} className={`ist-btn${subTab === t ? " on" : ""}`} onClick={() => setSubTab(t)}>
            {t}
            <span className="ist-count">
              {t === "Trending" ? categories.length : t === "Problems" ? problems.length : opportunities.length}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="filters">
        {subTab !== "Trending" && IDEA_CATEGORIES_FILTER.slice(0, 7).map(f => (
          <button key={f} className={`fchip${catFilter === f ? " on" : ""}`} onClick={() => setCatFilter(f)}>{f}</button>
        ))}
        {subTab === "Problems" && <>
          <div className="sort-sep" />
          {IDEA_SOURCES.map(s => (
            <button key={s} className={`sbtn${srcFilter === s ? " on" : ""}`} onClick={() => setSrcFilter(s)}>{s}</button>
          ))}
        </>}
      </div>

      {/* Grid */}
      {subTab === "Trending" && (
        <div className="cgrid">
          {categories.map(c => <CategoryCard key={c.id} cat={c} onSelect={item => select(item, "category")} />)}
        </div>
      )}
      {subTab === "Problems" && (
        problems.length > 0 ? (
          <div className="cgrid">
            {problems.map(p => <ProblemCard key={p.id} problem={p} onSelect={item => select(item, "problem")} />)}
          </div>
        ) : (
          <div style={{ padding: 60, textAlign: "center", border: "1px solid var(--bd)", borderRadius: 14 }}>
            <div style={{ fontSize: 22, color: "var(--ink4)", marginBottom: 10 }}>◇</div>
            <div style={{ fontSize: 15, color: "var(--ink3)", fontWeight: 300 }}>No problems match your filters.</div>
            <button className="fchip" style={{ marginTop: 14 }} onClick={() => { setCatFilter("All"); setSrcFilter("All"); }}>Clear filters</button>
          </div>
        )
      )}
      {subTab === "Opportunities" && (
        opportunities.length > 0 ? (
          <div className="cgrid">
            {opportunities.map(o => <OpportunityCard key={o.id} opp={o} onSelect={item => select(item, "opportunity")} />)}
          </div>
        ) : (
          <div style={{ padding: 60, textAlign: "center", border: "1px solid var(--bd)", borderRadius: 14 }}>
            <div style={{ fontSize: 22, color: "var(--ink4)", marginBottom: 10 }}>◇</div>
            <div style={{ fontSize: 15, color: "var(--ink3)", fontWeight: 300 }}>No opportunities match your filters.</div>
            <button className="fchip" style={{ marginTop: 14 }} onClick={() => setCatFilter("All")}>Clear filters</button>
          </div>
        )
      )}

      {selected && <IdeaDetailPanel item={selected} type={selType} onClose={() => setSelected(null)} />}
    </div>
  );
}
