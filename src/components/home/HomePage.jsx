import { IDEA_CATEGORIES, IDEA_PROBLEMS, IDEA_OPPORTUNITIES, BRANDS } from "../../data";
import AreaChart from "../common/charts/AreaChart";
import BarChart from "../common/charts/BarChart";
import DonutChart from "../common/charts/DonutChart";
import HeatBar from "../common/charts/HeatBar";
import Sparkline from "../common/Sparkline";

const topTrending = [...IDEA_CATEGORIES].sort((a, b) => b.growthRate - a.growthRate).slice(0, 6);
const topOpps = [...IDEA_OPPORTUNITIES].sort((a, b) => b.validationScore - a.validationScore).slice(0, 3);
const topBrands = BRANDS.filter(b => b.gaps.length >= 3).slice(0, 3);
const topProblems = [...IDEA_PROBLEMS].sort((a, b) => b.growthRate - a.growthRate).slice(0, 5);

// Source distribution across all problems
const srcCounts = {};
IDEA_PROBLEMS.forEach(p => p.sources.forEach(s => { srcCounts[s.platform] = (srcCounts[s.platform] || 0) + s.postCount; }));
const srcSegments = Object.entries(srcCounts)
  .sort((a, b) => b[1] - a[1])
  .map(([k, v]) => ({
    label: k, value: v,
    color: k === "reddit" ? "#FF4500" : k === "tiktok" ? "#0d0d0b" : k === "amazon" ? "#FF9900" : k === "google" ? "#4285F4" : "#E1306C",
  }));

const growthBars = topTrending.map(c => ({
  label: c.icon, value: c.growthRate, displayValue: `+${c.growthRate}%`,
  color: c.growthRate >= 50 ? "var(--g)" : c.growthRate >= 35 ? "var(--a)" : "var(--ink3)",
}));

const avgGrowth = Math.round(IDEA_CATEGORIES.reduce((s, c) => s + c.growthRate, 0) / IDEA_CATEGORIES.length);

const SRC_LABELS = { reddit: "Reddit", tiktok: "TikTok", amazon: "Amazon", google: "Google", instagram: "Instagram" };
const SEV_COLOR = { high: "var(--r)", medium: "var(--a)", low: "var(--ink4)" };

export default function HomePage({ onSelectPillar, onSelectDeal, onSelectIdeasTab }) {
  return (
    <div className="home">
      {/* Compact Hero */}
      <div className="hp-hero">
        <h1 className="hp-title">Consumer Brand Intelligence</h1>
        <p className="hp-subtitle">Trending opportunities, distressed acquisitions, and market signals — updated daily.</p>
      </div>

      {/* Trending Categories */}
      <section className="hp-section">
        <div className="hp-section-hdr">
          <h2 className="hp-section-title">Trending Categories</h2>
          <button className="hp-link" onClick={() => onSelectPillar("ideas")}>View all {IDEA_CATEGORIES.length} →</button>
        </div>
        <div className="hp-trending-grid">
          {topTrending.map(cat => {
            const gc = cat.growthRate >= 40 ? "var(--g)" : "var(--a)";
            return (
              <div className="hp-trend-card" key={cat.id} onClick={() => onSelectPillar("ideas")}>
                <div className="hp-tc-top">
                  <div className="hp-tc-info">
                    <span className="hp-tc-icon">{cat.icon}</span>
                    <div>
                      <div className="hp-tc-name">{cat.name}</div>
                      <div className="hp-tc-meta">{cat.brandCount} brands · {cat.sentiment}/10 sentiment</div>
                    </div>
                  </div>
                  <div className="hp-tc-growth" style={{ color: gc }}>+{cat.growthRate}%</div>
                </div>
                <div className="hp-tc-chart">
                  <AreaChart data={cat.sparkData} color={gc} w={280} h={52} filled={true} />
                </div>
                <div className="hp-tc-bottom">
                  <div className="hp-tc-sources">
                    {cat.topSources.map(s => <span key={s} className="ic-src">{SRC_LABELS[s]}</span>)}
                  </div>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink4)" }}>{cat.brandCount} brands</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Top Opportunities */}
      <section className="hp-section">
        <div className="hp-section-hdr">
          <h2 className="hp-section-title">Top Opportunities</h2>
          <button className="hp-link" onClick={() => { onSelectPillar("ideas"); onSelectIdeasTab?.("Opportunities"); }}>View all {IDEA_OPPORTUNITIES.length} →</button>
        </div>
        <div className="hp-opps-grid">
          {topOpps.map(opp => {
            const cat = IDEA_CATEGORIES.find(c => c.id === opp.categoryId);
            return (
              <div className="hp-opp-card" key={opp.id} onClick={() => onSelectPillar("ideas")}>
                <div className="hp-opp-top">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="hp-opp-name">{opp.title}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                      {cat && <span className="tag tm">{cat.name}</span>}
                      <span className="tag tg">+{opp.growthRate}% growth</span>
                    </div>
                  </div>
                </div>
                <p className="hp-opp-desc">{opp.description.length > 100 ? opp.description.slice(0, 100) + "…" : opp.description}</p>
                {opp.communitySignals[0] && (
                  <div className="hp-opp-signal">
                    <span className="opp-signal-platform">{opp.communitySignals[0].platform}</span>
                    <span className="opp-signal-text">{opp.communitySignals[0].signal.length > 70 ? opp.communitySignals[0].signal.slice(0, 70) + "…" : opp.communitySignals[0].signal}</span>
                  </div>
                )}
                <div className="hp-opp-stats">
                  <div><span className="cml">Market</span><span className="hp-opp-sv">{opp.marketSize}</span></div>
                  <div><span className="cml">Growth</span><span className="hp-opp-sv" style={{ color: "var(--g)" }}>+{opp.growthRate}%</span></div>
                  <div><span className="cml">TAM</span><span className="hp-opp-sv">{opp.estimatedTAM}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Brands with Potential */}
      <section className="hp-section">
        <div className="hp-section-hdr">
          <h2 className="hp-section-title">Brands with Potential</h2>
          <button className="hp-link" onClick={() => onSelectPillar("deals")}>Browse all {BRANDS.length} brands →</button>
        </div>
        <div className="hp-deals-grid">
          {topBrands.map(brand => {
            const trafficDown = brand.trafficTrend && brand.trafficTrend[0] > brand.trafficTrend[brand.trafficTrend.length - 1];
            return (
              <div className="hp-deal-card-v2" key={brand.id} onClick={() => { onSelectPillar("deals"); onSelectDeal?.(brand); }}>
                <div className="hp-dc2-header" style={{ background: brand.bgGradient || brand.brandColor }}>
                  <div className="dc2-logo" style={{ borderColor: "rgba(255,255,255,.3)", width: 36, height: 36, fontSize: 12 }}>{brand.logo}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>{brand.name}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)" }}>{brand.category}</div>
                  </div>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "rgba(255,255,255,.6)" }}>{brand.gaps.length} gaps</span>
                </div>
                {brand.trafficTrend && (
                  <div style={{ padding: "12px 18px 8px" }}>
                    <AreaChart data={brand.trafficTrend} color={trafficDown ? "var(--r)" : "var(--g)"} w={240} h={44} filled={true} />
                  </div>
                )}
                <div className="hp-dc2-footer">
                  <span>{brand.employees} team</span>
                  <span>{brand.hq.split(",")[0]}</span>
                  <span>{brand.whiteSpace.length} opportunities</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Problems Worth Solving */}
      <section className="hp-section">
        <div className="hp-section-hdr">
          <h2 className="hp-section-title">Problems Worth Solving</h2>
          <button className="hp-link" onClick={() => { onSelectPillar("ideas"); onSelectIdeasTab?.("Problems"); }}>View all {IDEA_PROBLEMS.length} →</button>
        </div>
        <div className="hp-problems">
          {topProblems.map((p, i) => {
            const cat = IDEA_CATEGORIES.find(c => c.id === p.categoryId);
            return (
              <div className="hp-prob-row" key={p.id} onClick={() => onSelectPillar("ideas")}>
                <div className="hp-prob-rank">{i + 1}</div>
                <div className="prob-sev" style={{ background: SEV_COLOR[p.severity] }} />
                <div className="hp-prob-info">
                  <div className="hp-prob-title">{p.title}</div>
                  <div className="hp-prob-meta">{cat?.name} · {(p.mentionCount / 1000).toFixed(1)}K mentions</div>
                </div>
                <div className="hp-prob-chart">
                  <Sparkline data={[0, p.growthRate * 0.3, p.growthRate * 0.5, p.growthRate * 0.7, p.growthRate]} color={p.growthRate >= 50 ? "var(--g)" : "var(--a)"} w={60} h={20} />
                </div>
                <div className="hp-prob-growth" style={{ color: p.growthRate >= 50 ? "var(--g)" : "var(--a)" }}>+{p.growthRate}%</div>
                <div className="hp-prob-heat">
                  <HeatBar value={p.sentiment} max={10} colorLow="var(--r)" colorHigh="var(--g)" w="80px" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Market Pulse */}
      <section className="hp-section">
        <div className="hp-section-hdr">
          <h2 className="hp-section-title">Market Pulse</h2>
        </div>
        <div className="hp-pulse-stats">
          <div className="hp-ps"><div className="hp-ps-v">{IDEA_CATEGORIES.length}</div><div className="hp-ps-l">Categories Tracked</div></div>
          <div className="hp-ps"><div className="hp-ps-v">{IDEA_PROBLEMS.length}</div><div className="hp-ps-l">Problems Identified</div></div>
          <div className="hp-ps"><div className="hp-ps-v">{BRANDS.length}</div><div className="hp-ps-l">Brands Monitored</div></div>
          <div className="hp-ps"><div className="hp-ps-v">+{avgGrowth}%</div><div className="hp-ps-l">Avg Category Growth</div></div>
        </div>
        <div className="hp-pulse-charts">
          <div className="hp-pulse-chart-box">
            <div className="pstl" style={{ marginBottom: 16 }}>Category Growth Rates</div>
            <BarChart bars={growthBars} h={130} barWidth={32} gap={10} />
          </div>
          <div className="hp-pulse-chart-box">
            <div className="pstl" style={{ marginBottom: 16 }}>Signal Sources</div>
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <DonutChart
                segments={srcSegments}
                size={100} strokeWidth={12}
                label={srcSegments.length.toString()} sublabel="sources"
              />
              <div className="hp-pulse-legend">
                {srcSegments.map(s => (
                  <div className="hp-pulse-leg-item" key={s.label}>
                    <div className="hp-pulse-leg-dot" style={{ background: s.color }} />
                    <span className="hp-pulse-leg-label">{SRC_LABELS[s.label] || s.label}</span>
                    <span className="hp-pulse-leg-val">{(s.value / 1000).toFixed(0)}K</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
