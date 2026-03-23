import { useState, useEffect, useMemo } from "react";
import { BRAND_SORTS } from "../../lib/constants";
import { BRANDS } from "../../data";
import DealCard from "./DealCard";
import BrandPage from "./BrandPage";
import ListBrandModal from "./ListBrandModal";

const AI_EXAMPLES = [
  "Show me stalled beauty brands in the US",
  "Which brands have the most red flags?",
  "Pet brands open to consulting",
  "Brands with declining traffic and high gap count",
];

// Derive filter options from data
const ALL_CATEGORIES = ["All", ...Array.from(new Set(BRANDS.map(b => b.category))).sort()];
const ALL_LOCATIONS = ["All", ...Array.from(new Set(BRANDS.map(b => b.hq.split(",").pop().trim()))).sort()];
const TEAM_RANGES = ["All", "1–20", "21–100", "101–500", "500+"];
const AD_RANGES = ["All", "0", "1–20", "21–50", "50+"];
const STATUS_OPTIONS = ["All", "Looking to Sell", "Growth Stalled", "Open to Consulting", "Growing"];
const CLAIM_OPTIONS = ["All", "Claimed", "Unclaimed"];
const REVENUE_OPTIONS = ["All", "Verified only"];

const STATUS_MAP = { "Looking to Sell": "looking-to-sell", "Growth Stalled": "growth-stalled", "Open to Consulting": "open-to-consulting", "Growing": "growing" };

function matchTeam(employees, range) {
  if (range === "All") return true;
  if (range === "1–20") return employees <= 20;
  if (range === "21–100") return employees > 20 && employees <= 100;
  if (range === "101–500") return employees > 100 && employees <= 500;
  if (range === "500+") return employees > 500;
  return true;
}
function matchAds(ads, range) {
  if (range === "All") return true;
  if (range === "0") return ads === 0;
  if (range === "1–20") return ads >= 1 && ads <= 20;
  if (range === "21–50") return ads > 20 && ads <= 50;
  if (range === "50+") return ads > 50;
  return true;
}

export default function DealsView({ watchlist, onToggleWatch, initialDeal, onClearInitialDeal }) {
  // Filters
  const [filters, setFilters] = useState({
    status: "All", claim: "All", category: "All",
    location: "All", team: "All", ads: "All", revenue: "All",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState("name");
  const [aiQuery, setAiQuery] = useState("");
  const [selected, setSelected] = useState(initialDeal || null);
  const [showListModal, setShowListModal] = useState(false);

  useEffect(() => {
    if (initialDeal) { setSelected(initialDeal); onClearInitialDeal?.(); }
  }, [initialDeal]);

  function selectBrand(brand) {
    setSelected(brand);
    window.scrollTo({ top: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  function setFilter(key, val) {
    setFilters(prev => ({ ...prev, [key]: val }));
  }

  const activeFilterCount = Object.values(filters).filter(v => v !== "All").length;

  // Apply filters + sort
  const brands = useMemo(() => {
    let out = BRANDS;
    const f = filters;
    if (f.status !== "All") out = out.filter(b => b.status === STATUS_MAP[f.status]);
    if (f.claim === "Claimed") out = out.filter(b => b.verification === "claimed" || b.verification === "verified");
    else if (f.claim === "Unclaimed") out = out.filter(b => b.verification === "unverified");
    if (f.category !== "All") out = out.filter(b => b.category === f.category);
    if (f.location !== "All") out = out.filter(b => b.hq.includes(f.location));
    if (f.team !== "All") out = out.filter(b => matchTeam(b.employees, f.team));
    if (f.ads !== "All") out = out.filter(b => matchAds(b.advertising?.activeAds || 0, f.ads));
    if (f.revenue === "Verified only") out = out.filter(b => !!b.verifiedRevenue);

    return out.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "red") return (b.redFlags?.length || 0) - (a.redFlags?.length || 0);
      if (sort === "green") return (b.greenFlags?.length || 0) - (a.greenFlags?.length || 0);
      if (sort === "gaps") return b.gaps.length - a.gaps.length;
      if (sort === "traffic") return (b.trafficTrend?.[b.trafficTrend.length - 1] || 0) - (a.trafficTrend?.[a.trafficTrend.length - 1] || 0);
      if (sort === "recent") return new Date(b.lastActivity || 0) - new Date(a.lastActivity || 0);
      return 0;
    });
  }, [filters, sort]);

  // AI search
  function handleAiSearch() {
    if (!aiQuery.trim()) return;
    const q = aiQuery.toLowerCase();
    const next = { status: "All", claim: "All", category: "All", location: "All", team: "All", ads: "All", revenue: "All" };

    if (q.includes("sell")) next.status = "Looking to Sell";
    else if (q.includes("stall")) next.status = "Growth Stalled";
    else if (q.includes("consult")) next.status = "Open to Consulting";
    else if (q.includes("growing") || q.includes("growth")) next.status = "Growing";
    if (q.includes("claimed")) next.claim = "Claimed";
    else if (q.includes("unclaimed")) next.claim = "Unclaimed";
    if (q.includes("revenue") || q.includes("verified")) next.revenue = "Verified only";

    for (const cat of ALL_CATEGORIES.slice(1)) {
      if (q.includes(cat.toLowerCase()) || cat.toLowerCase().split(/[\s/]+/).some(w => w.length > 3 && q.includes(w))) {
        next.category = cat; break;
      }
    }
    for (const loc of ALL_LOCATIONS.slice(1)) {
      if (q.includes(loc.toLowerCase())) { next.location = loc; break; }
    }
    if (q.includes("red flag")) setSort("red");
    else if (q.includes("traffic")) setSort("traffic");
    else if (q.includes("gap")) setSort("gaps");

    setFilters(next);
  }

  function clearAll() {
    setFilters({ status: "All", claim: "All", category: "All", location: "All", team: "All", ads: "All", revenue: "All" });
    setSort("name");
    setAiQuery("");
  }

  if (selected) {
    return (
      <BrandPage brand={selected} onBack={() => selectBrand(null)}
        watched={watchlist.includes(selected.id)} onToggleWatch={onToggleWatch} />
    );
  }

  return (
    <div className="feed">
      {/* Header */}
      <div className="feed-hdr" style={{ flexDirection: "column", alignItems: "stretch", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 className="sec-title">Browse Brands</h2>
            <p style={{ color: "var(--ink3)", fontSize: 14, marginTop: 6, fontWeight: 300 }}>
              Consumer brand profiles with gap analysis, white space, and acquisition signals.
            </p>
          </div>
          <button className="bw-list" onClick={() => setShowListModal(true)}>List Your Brand</button>
        </div>

        {/* AI Search */}
        <div className="ai-search">
          <div className="ai-search-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l1.5 3.5L13 6l-3.5 1.5L8 11 6.5 7.5 3 6l3.5-1.5L8 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.2"/></svg>
          </div>
          <input className="ai-search-input"
            placeholder="Ask anything — e.g. 'stalled beauty brands in the US with declining traffic'"
            value={aiQuery} onChange={e => setAiQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAiSearch()} />
          {aiQuery && <button className="ai-search-go" onClick={handleAiSearch}>Search</button>}
        </div>
        {!aiQuery && (
          <div className="ai-examples">
            {AI_EXAMPLES.map((ex, i) => <button key={i} className="ai-ex" onClick={() => setAiQuery(ex)}>{ex}</button>)}
          </div>
        )}
      </div>

      {/* Filter + Sort bar */}
      <div className="fb-bar">
        <div className="fb-left">
          <button className={`fb-filter-btn${showFilters ? " on" : ""}`} onClick={() => setShowFilters(p => !p)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            Filters
            {activeFilterCount > 0 && <span className="fb-count">{activeFilterCount}</span>}
          </button>
          {activeFilterCount > 0 && (
            <button className="fb-clear" onClick={clearAll}>Clear all</button>
          )}
          <span className="fb-result-count">{brands.length} brand{brands.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="fb-right">
          <span className="fb-sort-label">Sort</span>
          {BRAND_SORTS.map(s => (
            <button key={s.k} className={`sbtn${sort === s.k ? " on" : ""}`} onClick={() => setSort(s.k)}>{s.l}</button>
          ))}
        </div>
      </div>

      {/* Filter panel (collapsible) */}
      {showFilters && (
        <div className="fp-panel">
          <FilterGroup label="Status" options={STATUS_OPTIONS} value={filters.status} onChange={v => setFilter("status", v)} />
          <FilterGroup label="Listing" options={CLAIM_OPTIONS} value={filters.claim} onChange={v => setFilter("claim", v)} />
          <FilterGroup label="Category" options={ALL_CATEGORIES} value={filters.category} onChange={v => setFilter("category", v)} />
          <FilterGroup label="Location" options={ALL_LOCATIONS} value={filters.location} onChange={v => setFilter("location", v)} />
          <FilterGroup label="Team size" options={TEAM_RANGES} value={filters.team} onChange={v => setFilter("team", v)} />
          <FilterGroup label="Active ads" options={AD_RANGES} value={filters.ads} onChange={v => setFilter("ads", v)} />
          <FilterGroup label="Revenue" options={REVENUE_OPTIONS} value={filters.revenue} onChange={v => setFilter("revenue", v)} />
        </div>
      )}

      {/* Active filter tags */}
      {activeFilterCount > 0 && (
        <div className="fp-tags">
          {Object.entries(filters).filter(([, v]) => v !== "All").map(([k, v]) => (
            <span key={k} className="fp-tag">
              {k}: {v}
              <button className="fp-tag-x" onClick={() => setFilter(k, "All")}>×</button>
            </span>
          ))}
        </div>
      )}

      {/* Grid */}
      {brands.length > 0 ? (
        <div className="z-row" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
          {brands.map(b => (
            <DealCard key={b.id} brand={b} watched={watchlist.includes(b.id)}
              onSelect={selectBrand} onToggleWatch={onToggleWatch} />
          ))}
        </div>
      ) : (
        <div style={{ padding: 60, textAlign: "center", border: "1px solid var(--bd)" }}>
          <div style={{ fontSize: 15, color: "var(--ink3)", fontWeight: 300 }}>No brands match your filters.</div>
          <button className="fchip" style={{ marginTop: 14 }} onClick={clearAll}>Clear filters</button>
        </div>
      )}

      {showListModal && <ListBrandModal onClose={() => setShowListModal(false)} />}
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div className="fp-group">
      <div className="fp-label">{label}</div>
      <div className="fp-options">
        {options.map(o => (
          <button key={o} className={`fp-opt${value === o ? " on" : ""}`} onClick={() => onChange(o)}>{o}</button>
        ))}
      </div>
    </div>
  );
}
