import { useState } from "react";
import { INTEL_TABS, IDEA_SOURCES, IDEA_CATEGORIES_FILTER, SIGNAL_SORTS, TIME_RANGES } from "../../lib/constants";
import useTrends from "../../hooks/useTrends";
import { useNewsArticles, useCompanies } from "../../hooks/useSupabaseData";
import TrendCard from "./TrendCard";
import SignalCard from "./SignalCard";
import AreaChart from "../common/charts/AreaChart";
import { MARKET_TRENDS, COMMUNITY_SIGNALS, MARKET_NEWS, IDEA_CATEGORIES, BRANDS } from "../../data";

const TREND_SORTS = [
  { k: "trend", l: "Trend Score" },
  { k: "growth", l: "Growth Rate" },
  { k: "volume", l: "Search Volume" },
  { k: "name", l: "A \u2192 Z" },
];

const TYPE_ICON = { acquisition: "\u{1F91D}", funding: "\u{1F4B0}", ipo: "\u{1F4C8}", launch: "\u{1F680}" };
const TYPE_LABEL = { acquisition: "Acquisition", funding: "Funding", ipo: "IPO / Strategic", launch: "Launch" };

// Spotlight data
const topBreaking = MARKET_TRENDS.filter(t => t.isBreaking).sort((a, b) => b.growth - a.growth)[0];
const topSignal = [...COMMUNITY_SIGNALS].filter(s => s.severity === "high").sort((a, b) => b.growthRate - a.growthRate)[0];
const topSignalCat = topSignal ? IDEA_CATEGORIES.find(c => c.id === topSignal.categoryId) : null;

export default function IntelView({ onSelectDeal }) {
  const [subTab, setSubTab] = useState("Keyword Trends");
  const [srcFilter, setSrcFilter] = useState("All");
  const [catFilter, setCatFilter] = useState("All");
  const [sort, setSort] = useState("trend");
  const [search, setSearch] = useState("");
  const [timeRange, setTimeRange] = useState("all");

  const { keywords, signals } = useTrends({ subTab, sourceFilter: srcFilter, categoryFilter: catFilter, search, sort, timeRange });

  function switchTab(tab) {
    setSubTab(tab);
    setSrcFilter("All");
    setCatFilter("All");
    setSearch("");
    setTimeRange("all");
    setSort(tab === "Keyword Trends" ? "trend" : "growth");
  }

  const isKeywords = subTab === "Keyword Trends";
  const isSignals = subTab === "Community Signals";
  const isNews = subTab === "Market News";
  const activeSorts = isKeywords ? TREND_SORTS : SIGNAL_SORTS;

  // Real news from Supabase (with fallback to dummy data)
  const { articles: realNews, loading: newsLoading } = useNewsArticles(30);
  const { companies: dbCompanies } = useCompanies();

  return (
    <div className="feed">
      <div className="feed-hdr">
        <div>
          <h2 className="sec-title">Market Intelligence</h2>
          <p style={{ color: "var(--ink3)", fontSize: 14, marginTop: 6, fontWeight: 400 }}>
            What consumers are searching, saying, and complaining about — tracked across Reddit, TikTok, Amazon, Google, and Instagram.
          </p>
        </div>
        <div className="srch">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="var(--ink4)" strokeWidth="1.4" /><path d="M9.5 9.5l3 3" stroke="var(--ink4)" strokeWidth="1.4" strokeLinecap="round" /></svg>
          <input placeholder={isKeywords ? "Search trends..." : isSignals ? "Search signals..." : "Search news..."} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="idea-sub-tabs">
        {INTEL_TABS.map(t => (
          <button key={t} className={`ist-btn${subTab === t ? " on" : ""}`} onClick={() => switchTab(t)}>
            {t}
            <span className="ist-count">{t === "Keyword Trends" ? MARKET_TRENDS.length : t === "Community Signals" ? COMMUNITY_SIGNALS.length : MARKET_NEWS.length}</span>
          </button>
        ))}
      </div>

      {/* ── Keyword Trends Tab ── */}
      {isKeywords && <>
        {/* Spotlight — always visible */}
        {topBreaking && (
          <div className="z-spotlight">
            <div className="z-spot-left">
              <span className="z-spot-label">Top breaking trend</span>
              <h1 className="z-spot-title">{topBreaking.keyword}</h1>
              <p className="z-spot-desc">{topBreaking.summary}</p>
              {topBreaking.signals[0] && (
                <div className="z-signal-row" style={{ margin: "0 0 16px" }}>
                  <span className="z-signal-src">{topBreaking.signals[0].platform}</span>
                  <span className="z-signal-text">{topBreaking.signals[0].text}</span>
                </div>
              )}
              <span className="z-spot-cta">Read full analysis &rarr;</span>
            </div>
            <div className="z-spot-right">
              <div className="z-spot-hero-num" style={{ color: "var(--g)" }}>+{topBreaking.growth}%</div>
              <div className="z-spot-chart">
                <AreaChart data={topBreaking.sparkData} color="var(--g)" w={520} h={160} filled={true} />
              </div>
              <div className="z-spot-metrics">
                <div className="z-spot-m"><span className="z-spot-m-v">{(topBreaking.volume / 1e6).toFixed(1)}M</span><span className="z-spot-m-l">searches/mo</span></div>
                <div className="z-spot-m"><span className="z-spot-m-v">{topBreaking.trendScore}</span><span className="z-spot-m-l">trend score</span></div>
                <div className="z-spot-m"><span className="z-spot-m-v">{topBreaking.sentiment}/10</span><span className="z-spot-m-l">sentiment</span></div>
                <div className="z-spot-m"><span className="z-spot-m-v">{topBreaking.category}</span><span className="z-spot-m-l">category</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Time range + Source filters + Sorts */}
        <div className="filters">
          {TIME_RANGES.map(t => (
            <button key={t.k} className={`fchip${timeRange === t.k ? " on" : ""}`} onClick={() => setTimeRange(t.k)}>{t.l}</button>
          ))}
        </div>
        <div className="filters" style={{ marginTop: -8 }}>
          {IDEA_SOURCES.map(s => (
            <button key={s} className={`fchip sm${srcFilter === s ? " on" : ""}`} onClick={() => setSrcFilter(s)}>{s}</button>
          ))}
          <div className="sort-sep" />
          {activeSorts.map(s => (
            <button key={s.k} className={`sbtn${sort === s.k ? " on" : ""}`} onClick={() => setSort(s.k)}>{s.l}</button>
          ))}
        </div>

        {/* Grid */}
        {keywords.length > 0 ? (
          <div className="z-row">
            {keywords.map(t => <TrendCard key={t.id} trend={t} />)}
          </div>
        ) : (
          <div style={{ padding: 60, textAlign: "center", border: "1px solid var(--bd)" }}>
            <div style={{ fontSize: 15, color: "var(--ink3)", fontWeight: 300 }}>No trends match your filters.</div>
            <button className="fchip" style={{ marginTop: 14 }} onClick={() => { setSrcFilter("All"); setSearch(""); setTimeRange("all"); }}>Clear filters</button>
          </div>
        )}
      </>}

      {/* ── Community Signals Tab ── */}
      {isSignals && <>
        {/* Spotlight — always visible */}
        {topSignal && (
          <div className="z-spotlight">
            <div className="z-spot-left">
              <span className="z-spot-label">Top consumer pain point</span>
              <h1 className="z-spot-title">{topSignal.title}</h1>
              <p className="z-spot-desc">
                Consumers are frustrated: {topSignal.description.slice(0, 200)}{topSignal.description.length > 200 ? "..." : ""}
                {topSignalCat ? ` This creates a gap in ${topSignalCat.name} that founders and investors can capitalize on.` : ""}
              </p>
              <span className="z-spot-cta">Read full analysis &rarr;</span>
            </div>
            <div className="z-spot-right">
              <div className="z-spot-hero-num" style={{ color: "var(--r)" }}>+{topSignal.growthRate}%</div>
              <div className="z-spot-metrics" style={{ borderTop: "none", marginTop: 8 }}>
                {topSignal.sources.filter(s => s.postCount > 0).map((s, i) => (
                  <div className="z-spot-m" key={i}><span className="z-spot-m-v">{(s.postCount / 1000).toFixed(1)}K</span><span className="z-spot-m-l">{s.platform} posts</span></div>
                ))}
                <div className="z-spot-m"><span className="z-spot-m-v">{(topSignal.searchVolume / 1000).toFixed(0)}K</span><span className="z-spot-m-l">searches/mo</span></div>
              </div>
              {topSignal.sources.find(s => s.sampleQuote) && (
                <div className="z-quote" style={{ marginTop: 16 }}>
                  &ldquo;{topSignal.sources.find(s => s.sampleQuote).sampleQuote}&rdquo;
                </div>
              )}
            </div>
          </div>
        )}

        {/* Time range + Filters */}
        <div className="filters">
          {TIME_RANGES.map(t => (
            <button key={t.k} className={`fchip${timeRange === t.k ? " on" : ""}`} onClick={() => setTimeRange(t.k)}>{t.l}</button>
          ))}
        </div>
        <div className="filters" style={{ marginTop: -8 }}>
          {IDEA_SOURCES.map(s => (
            <button key={s} className={`fchip sm${srcFilter === s ? " on" : ""}`} onClick={() => setSrcFilter(s)}>{s}</button>
          ))}
          <div className="sort-sep" />
          {activeSorts.map(s => (
            <button key={s.k} className={`sbtn${sort === s.k ? " on" : ""}`} onClick={() => setSort(s.k)}>{s.l}</button>
          ))}
        </div>
        <div className="filters" style={{ marginTop: -8 }}>
          {IDEA_CATEGORIES_FILTER.slice(0, 8).map(f => (
            <button key={f} className={`fchip sm${catFilter === f ? " on" : ""}`} onClick={() => setCatFilter(f)}>{f}</button>
          ))}
        </div>

        {/* Grid */}
        {signals.length > 0 ? (
          <div className="z-row">
            {signals.map(s => <SignalCard key={s.id} signal={s} />)}
          </div>
        ) : (
          <div style={{ padding: 60, textAlign: "center", border: "1px solid var(--bd)" }}>
            <div style={{ fontSize: 15, color: "var(--ink3)", fontWeight: 300 }}>No signals match your filters.</div>
            <button className="fchip" style={{ marginTop: 14 }} onClick={() => { setSrcFilter("All"); setCatFilter("All"); setSearch(""); setTimeRange("all"); }}>Clear filters</button>
          </div>
        )}
      </>}

      {/* ── Market News Tab ── */}
      {isNews && <>
        <div style={{ marginTop: 24 }}>
          {newsLoading && <div style={{ padding: 40, textAlign: "center", color: "var(--ink4)" }}>Loading news...</div>}

          {/* Real news from Supabase */}
          {!newsLoading && realNews.length > 0 && realNews
            .filter(n => !search || n.title.toLowerCase().includes(search.toLowerCase()))
            .map(n => {
              const company = dbCompanies.find(c => c.id === n.company_id);
              return (
                <div className="z-card" key={n.id} style={{ marginBottom: 16 }}>
                  <div className="z-card-header">
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 16 }}>{"\u{1F4F0}"}</span>
                      <span className="z-badge">{n.source_name || "News"}</span>
                    </div>
                    <span className="z-date-sm">{n.published_at ? new Date(n.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}</span>
                  </div>
                  <h3 className="z-card-title">
                    <a href={n.source_url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                      {n.title}
                    </a>
                  </h3>
                  {n.description && <p className="z-card-desc">{n.description.length > 200 ? n.description.slice(0, 200) + "..." : n.description}</p>}
                  <div className="z-mini-stats">
                    {company && <span className="z-ms" style={{ fontWeight: 500 }}>{company.name}</span>}
                    {company?.cat && <span className="z-ms">{company.cat}</span>}
                    <span className="z-ms">{n.source_name}</span>
                  </div>
                </div>
              );
            })
          }

          {/* Fallback to dummy data if no real news */}
          {!newsLoading && realNews.length === 0 && MARKET_NEWS
            .filter(n => !search || n.title.toLowerCase().includes(search.toLowerCase()))
            .map(n => (
              <div className="z-card" key={n.id} style={{ marginBottom: 16 }}>
                <div className="z-card-header">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{TYPE_ICON[n.type] || "\u{1F4F0}"}</span>
                    <span className="z-badge">{TYPE_LABEL[n.type] || n.type}</span>
                  </div>
                  <span className="z-date-sm">{new Date(n.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                </div>
                <h3 className="z-card-title">{n.title}</h3>
                <p className="z-card-desc">{n.description}</p>
                <div className="z-mini-stats">
                  <span className="z-ms">{n.category}</span>
                  {n.value !== "N/A" && <span className="z-ms" style={{ fontWeight: 600, color: "var(--g)" }}>{n.value}</span>}
                </div>
              </div>
            ))
          }
        </div>
      </>}
    </div>
  );
}
