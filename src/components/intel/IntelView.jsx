import { useState } from "react";
import { IDEA_SOURCES } from "../../lib/constants";
import useTrends from "../../hooks/useTrends";
import TrendCard from "./TrendCard";
import AreaChart from "../common/charts/AreaChart";
import BarChart from "../common/charts/BarChart";
import DonutChart from "../common/charts/DonutChart";
import { MARKET_TRENDS } from "../../data";

const TREND_SORTS = [
  { k: "trend", l: "Trend Score" },
  { k: "growth", l: "Growth Rate" },
  { k: "volume", l: "Search Volume" },
  { k: "name", l: "A → Z" },
];

const SRC_LABELS = { reddit: "Reddit", tiktok: "TikTok", amazon: "Amazon", google: "Google", instagram: "Instagram" };
const SRC_COLORS = { reddit: "#FF4500", tiktok: "#0d0d0b", amazon: "#FF9900", google: "#4285F4", instagram: "#E1306C" };

// Compute source distribution
const srcCounts = {};
MARKET_TRENDS.forEach(t => { srcCounts[t.source] = (srcCounts[t.source] || 0) + 1; });
const srcSegments = Object.entries(srcCounts).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({
  label: k, value: v, color: SRC_COLORS[k],
}));

// Top breaking trends
const breakingTrends = MARKET_TRENDS.filter(t => t.isBreaking).slice(0, 3);

// Growth bars for overview
const growthBars = [...MARKET_TRENDS].sort((a, b) => b.growth - a.growth).slice(0, 8).map(t => ({
  label: t.keyword.split(" ")[0].slice(0, 6), value: t.growth,
  displayValue: `+${t.growth}%`, color: t.growth >= 200 ? "var(--g)" : t.growth >= 100 ? "var(--a)" : "var(--ink3)",
}));

export default function IntelView() {
  const [srcFilter, setSrcFilter] = useState("All");
  const [sort, setSort] = useState("trend");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const { trends } = useTrends({ sourceFilter: srcFilter, search, sort });

  return (
    <div className="feed">
      <div className="feed-hdr">
        <div>
          <h2 className="sec-title">Market Intelligence</h2>
          <p style={{ color: "var(--ink3)", fontSize: 14, marginTop: 6, fontWeight: 300 }}>
            Emerging consumer trends before they become obvious. Data from Reddit, TikTok, Amazon, and Google.
          </p>
        </div>
        <div className="srch">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#aeada5" strokeWidth="1.4" /><path d="M9.5 9.5l3 3" stroke="#aeada5" strokeWidth="1.4" strokeLinecap="round" /></svg>
          <input placeholder="Search trends…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Breaking Trends Spotlight */}
      {!search && srcFilter === "All" && (
        <div className="intel-spotlight">
          <div className="eyebrow">Breaking Trends</div>
          <div className="intel-spotlight-grid">
            {breakingTrends.map(t => {
              const gc = t.growth >= 200 ? "var(--g)" : "var(--a)";
              return (
                <div className="intel-spot-card" key={t.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div>
                      <span className="intel-breaking">Breaking</span>
                      <div className="intel-keyword" style={{ fontSize: 20 }}>{t.keyword}</div>
                      <div className="intel-cat">{t.category}</div>
                    </div>
                    <div className="intel-growth" style={{ color: gc, fontSize: 28 }}>+{t.growth}%</div>
                  </div>
                  <AreaChart data={t.sparkData} color={gc} w={340} h={64} filled={true} />
                  <p className="intel-summary" style={{ marginTop: 10 }}>{t.summary.length > 100 ? t.summary.slice(0, 100) + "…" : t.summary}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Overview Bar */}
      {!search && srcFilter === "All" && (
        <div className="intel-overview">
          <div className="intel-ov-left">
            <div className="pstl">Growth Leaders</div>
            <BarChart bars={growthBars} h={120} barWidth={28} gap={6} />
          </div>
          <div className="intel-ov-right">
            <div className="pstl">Signal Sources</div>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <DonutChart segments={srcSegments} size={80} strokeWidth={10} label={MARKET_TRENDS.length.toString()} sublabel="trends" />
              <div className="hp-pulse-legend">
                {srcSegments.map(s => (
                  <div className="hp-pulse-leg-item" key={s.label}>
                    <div className="hp-pulse-leg-dot" style={{ background: s.color }} />
                    <span className="hp-pulse-leg-label">{SRC_LABELS[s.label]}</span>
                    <span className="hp-pulse-leg-val">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="filters">
        {IDEA_SOURCES.map(s => (
          <button key={s} className={`fchip${srcFilter === s ? " on" : ""}`} onClick={() => setSrcFilter(s)}>{s}</button>
        ))}
        <div className="sort-sep" />
        {TREND_SORTS.map(s => (
          <button key={s.k} className={`sbtn${sort === s.k ? " on" : ""}`} onClick={() => setSort(s.k)}>{s.l}</button>
        ))}
      </div>

      {/* Grid */}
      {trends.length > 0 ? (
        <div className="cgrid intel-grid">
          {trends.map(t => <TrendCard key={t.id} trend={t} onSelect={setSelected} />)}
        </div>
      ) : (
        <div style={{ padding: 60, textAlign: "center", border: "1px solid var(--bd)", borderRadius: 14 }}>
          <div style={{ fontSize: 22, color: "var(--ink4)", marginBottom: 10 }}>⬆</div>
          <div style={{ fontSize: 15, color: "var(--ink3)", fontWeight: 300 }}>No trends match your filters.</div>
          <button className="fchip" style={{ marginTop: 14 }} onClick={() => { setSrcFilter("All"); setSearch(""); }}>Clear filters</button>
        </div>
      )}
    </div>
  );
}
