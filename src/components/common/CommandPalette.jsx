import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { BRANDS } from "../../data/deals";
import { IDEA_CATEGORIES, IDEA_PROBLEMS, IDEA_OPPORTUNITIES } from "../../data/ideas";
import { MARKET_TRENDS } from "../../data/trends";

const RESULT_TYPES = {
  brand: { label: "BRAND", color: "var(--b)", bg: "var(--bl)" },
  idea: { label: "IDEA", color: "var(--g)", bg: "var(--gl)" },
  problem: { label: "PROBLEM", color: "var(--r)", bg: "var(--rl)" },
  opportunity: { label: "OPP", color: "var(--a)", bg: "var(--al)" },
  trend: { label: "TREND", color: "var(--g)", bg: "var(--gl)" },
};

function buildIndex() {
  const items = [];
  BRANDS.forEach(b => items.push({
    type: "brand", id: b.id, title: b.name, subtitle: b.category,
    meta: b.status?.replace(/-/g, " "), data: b,
    search: `${b.name} ${b.category} ${b.hq || ""}`.toLowerCase(),
  }));
  IDEA_CATEGORIES.forEach(c => items.push({
    type: "idea", id: c.id, title: c.name, subtitle: `${c.brandCount} brands · +${c.growthRate}%`,
    meta: `Score ${c.trendScore}`, data: c,
    search: `${c.name} ${c.description || ""}`.toLowerCase(),
  }));
  (IDEA_PROBLEMS || []).forEach(p => items.push({
    type: "problem", id: p.id, title: p.title, subtitle: p.category,
    meta: `Severity ${p.severity}/10`, data: p,
    search: `${p.title} ${p.category} ${p.description || ""}`.toLowerCase(),
  }));
  (IDEA_OPPORTUNITIES || []).forEach(o => items.push({
    type: "opportunity", id: o.id, title: o.title, subtitle: o.category,
    meta: `Validated ${o.validation}/10`, data: o,
    search: `${o.title} ${o.category} ${o.description || ""}`.toLowerCase(),
  }));
  MARKET_TRENDS.forEach(t => items.push({
    type: "trend", id: t.id, title: t.keyword, subtitle: t.category,
    meta: t.isBreaking ? "BREAKING" : `Score ${t.trendScore}`, data: t,
    search: `${t.keyword} ${t.category} ${t.summary || ""}`.toLowerCase(),
  }));
  return items;
}

export default function CommandPalette({ open, onClose, onNavigate }) {
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const index = useMemo(() => buildIndex(), []);

  const results = useMemo(() => {
    if (!query.trim()) return index.slice(0, 8);
    const q = query.toLowerCase().trim();
    const terms = q.split(/\s+/);
    return index
      .filter(item => terms.every(t => item.search.includes(t)))
      .slice(0, 12);
  }, [query, index]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => { setSelectedIdx(0); }, [results]);

  useEffect(() => {
    if (listRef.current) {
      const active = listRef.current.querySelector(".cmd-item.active");
      if (active) active.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIdx]);

  const handleSelect = useCallback((item) => {
    onClose();
    if (item.type === "brand") onNavigate("deals", item.data);
    else if (item.type === "idea" || item.type === "problem" || item.type === "opportunity") onNavigate("ideas");
    else if (item.type === "trend") onNavigate("intel");
  }, [onClose, onNavigate]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && results[selectedIdx]) { handleSelect(results[selectedIdx]); }
    else if (e.key === "Escape") { onClose(); }
  }, [results, selectedIdx, handleSelect, onClose]);

  // Global keyboard shortcut
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); onClose("toggle"); }
      if (e.key === "Escape" && open) { onClose(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="cmd-overlay" onClick={onClose}>
      <div className="cmd-palette" onClick={e => e.stopPropagation()}>
        <div className="cmd-input-wrap">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            ref={inputRef}
            className="cmd-input"
            type="text"
            placeholder="Search brands, ideas, trends..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <kbd className="cmd-kbd">ESC</kbd>
        </div>
        <div className="cmd-results" ref={listRef}>
          {results.length === 0 && (
            <div className="cmd-empty">No results for "{query}"</div>
          )}
          {results.map((item, i) => {
            const typeInfo = RESULT_TYPES[item.type] || RESULT_TYPES.idea;
            return (
              <div
                key={item.id}
                className={`cmd-item${i === selectedIdx ? " active" : ""}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIdx(i)}
              >
                <span className="cmd-type-badge" style={{ color: typeInfo.color, background: typeInfo.bg }}>
                  {typeInfo.label}
                </span>
                <div className="cmd-item-info">
                  <span className="cmd-item-title">{item.title}</span>
                  <span className="cmd-item-sub">{item.subtitle}</span>
                </div>
                {item.meta && (
                  <span className={`cmd-item-meta${item.meta === "BREAKING" ? " breaking" : ""}`}>
                    {item.meta}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="cmd-footer">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
