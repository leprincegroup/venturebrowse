import { IDEA_CATEGORIES, VALIDATED_IDEAS, BRANDS, MARKET_TRENDS, COMMUNITY_SIGNALS } from "../../data";
import AreaChart from "../common/charts/AreaChart";
import BarChart from "../common/charts/BarChart";
import DonutChart from "../common/charts/DonutChart";
import HeatBar from "../common/charts/HeatBar";
import Sparkline from "../common/Sparkline";

const topIdeas = [...VALIDATED_IDEAS].sort((a, b) => b.validationScore - a.validationScore).slice(0, 3);
const topBrands = BRANDS.filter(b => b.gaps.length >= 3).slice(0, 3);
const topTrends = [...MARKET_TRENDS].sort((a, b) => b.growth - a.growth).slice(0, 3);
const topSignals = [...COMMUNITY_SIGNALS].sort((a, b) => b.growthRate - a.growthRate).slice(0, 3);

// Stats
const avgGrowth = Math.round(VALIDATED_IDEAS.reduce((s, i) => s + i.growthRate, 0) / VALIDATED_IDEAS.length);

// Source distribution
const srcCounts = {};
COMMUNITY_SIGNALS.forEach(s => s.sources.forEach(src => { srcCounts[src.platform] = (srcCounts[src.platform] || 0) + src.postCount; }));
const srcSegments = Object.entries(srcCounts)
  .sort((a, b) => b[1] - a[1])
  .map(([k, v]) => ({
    label: k, value: v,
    color: k === "reddit" ? "#FF4500" : k === "tiktok" ? "#0d0d0b" : k === "amazon" ? "#FF9900" : k === "google" ? "#4285F4" : "#E1306C",
  }));

const growthBars = topIdeas.map(i => ({
  label: i.title.split(" ")[0].slice(0, 6), value: i.validationScore * 10,
  displayValue: `${i.validationScore}`, color: i.validationScore >= 8.5 ? "var(--g)" : i.validationScore >= 7 ? "var(--a)" : "var(--ink3)",
}));

const SRC_LABELS = { reddit: "Reddit", tiktok: "TikTok", amazon: "Amazon", google: "Google", instagram: "Instagram" };
const SEV_COLOR = { high: "var(--r)", medium: "var(--a)", low: "var(--ink4)" };
const TYPE_STYLE = {
  build: { label: "BUILD", color: "var(--g)", bg: "var(--gl)" },
  acquire: { label: "ACQUIRE", color: "#4a9eff", bg: "rgba(74,158,255,.1)" },
  "roll-up": { label: "ROLL-UP", color: "#a855f7", bg: "rgba(168,85,247,.1)" },
};

export default function HomePage({ onSelectPillar, onSelectDeal }) {
  return (
    <div className="home">
      {/* Compact Hero */}
      <div className="hp-hero">
        <h1 className="hp-title">Consumer Brand Intelligence</h1>
        <p className="hp-subtitle">Trending opportunities, distressed acquisitions, and market signals — updated daily.</p>
      </div>

      {/* Latest Validated Ideas */}
      <section className="hp-section">
        <div className="hp-section-hdr">
          <h2 className="hp-section-title">Latest Validated Ideas</h2>
          <button className="hp-link" onClick={() => onSelectPillar("ideas")}>View all {VALIDATED_IDEAS.length} →</button>
        </div>
        <div className="hp-opps-grid">
          {topIdeas.map(idea => {
            const cat = IDEA_CATEGORIES.find(c => c.id === idea.categoryId);
            const ts = TYPE_STYLE[idea.ideaType] || TYPE_STYLE.build;
            return (
              <div className="hp-opp-card" key={idea.id} onClick={() => onSelectPillar("ideas")}>
                <div className="hp-opp-top">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                      <span className="idea-type-badge" style={{ color: ts.color, background: ts.bg, borderColor: ts.color, fontSize: 9, padding: "1px 6px" }}>{ts.label}</span>
                    </div>
                    <div className="hp-opp-name">{idea.title}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                      {cat && <span className="tag tm" style={{ fontSize: 9, padding: "1px 6px" }}>{cat.name}</span>}
                      <span className="tag tg" style={{ fontSize: 9, padding: "1px 6px" }}>+{idea.growthRate}% growth</span>
                    </div>
                  </div>
                </div>
                <p className="hp-opp-desc">{idea.subtitle}</p>
                <div className="hp-opp-stats">
                  <div><span className="cml">Market</span><span className="hp-opp-sv">{idea.marketSize}</span></div>
                  <div><span className="cml">TAM</span><span className="hp-opp-sv">{idea.estimatedTAM}</span></div>
                  <div><span className="cml">Score</span><span className="hp-opp-sv" style={{ color: "var(--g)" }}>{idea.validationScore}/10</span></div>
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
                  <div className="dc2-logo" style={{ borderColor: "rgba(255,255,255,.3)", width: 36, height: 36, fontSize: 12, overflow: "hidden" }}>{brand.logoUrl ? <img src={brand.logoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={e => { e.target.style.display = "none"; e.target.parentNode.textContent = brand.logo; }} /> : brand.logo}</div>
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

      {/* Trending Signals */}
      <section className="hp-section">
        <div className="hp-section-hdr">
          <h2 className="hp-section-title">Trending Signals</h2>
          <button className="hp-link" onClick={() => onSelectPillar("intel")}>View all →</button>
        </div>
        <div className="hp-signals-split">
          <div className="hp-signals-col">
            <div className="eyebrow" style={{ marginBottom: 10 }}>Keyword Trends</div>
            {topTrends.map(t => {
              const gc = t.growth >= 200 ? "var(--g)" : "var(--a)";
              return (
                <div className="hp-signal-row" key={t.id} onClick={() => onSelectPillar("intel")}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{t.keyword}</div>
                    <div style={{ fontSize: 11, color: "var(--ink4)", marginTop: 2 }}>{t.category} · {(t.volume / 1000).toFixed(0)}K vol</div>
                  </div>
                  <Sparkline data={t.sparkData} color={gc} w={60} h={20} />
                  <span style={{ fontFamily: "var(--mono)", fontSize: 14, fontWeight: 600, color: gc, marginLeft: 10, minWidth: 55, textAlign: "right" }}>+{t.growth}%</span>
                </div>
              );
            })}
          </div>
          <div className="hp-signals-col">
            <div className="eyebrow" style={{ marginBottom: 10 }}>Community Signals</div>
            {topSignals.map(s => {
              const cat = IDEA_CATEGORIES.find(c => c.id === s.categoryId);
              return (
                <div className="hp-signal-row" key={s.id} onClick={() => onSelectPillar("intel")}>
                  <div className="prob-sev" style={{ background: SEV_COLOR[s.severity], flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{s.title}</div>
                    <div style={{ fontSize: 11, color: "var(--ink4)", marginTop: 2 }}>{cat?.name} · {(s.mentionCount / 1000).toFixed(1)}K mentions</div>
                  </div>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 14, fontWeight: 600, color: s.growthRate >= 50 ? "var(--g)" : "var(--a)", minWidth: 55, textAlign: "right" }}>+{s.growthRate}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Market Pulse */}
      <section className="hp-section">
        <div className="hp-section-hdr">
          <h2 className="hp-section-title">Market Pulse</h2>
        </div>
        <div className="hp-pulse-stats">
          <div className="hp-ps"><div className="hp-ps-v">{VALIDATED_IDEAS.length}</div><div className="hp-ps-l">Validated Ideas</div></div>
          <div className="hp-ps"><div className="hp-ps-v">{MARKET_TRENDS.length + COMMUNITY_SIGNALS.length}</div><div className="hp-ps-l">Signals Tracked</div></div>
          <div className="hp-ps"><div className="hp-ps-v">{BRANDS.length}</div><div className="hp-ps-l">Brands Monitored</div></div>
          <div className="hp-ps"><div className="hp-ps-v">+{avgGrowth}%</div><div className="hp-ps-l">Avg Growth Rate</div></div>
        </div>
        <div className="hp-pulse-charts">
          <div className="hp-pulse-chart-box">
            <div className="pstl" style={{ marginBottom: 16 }}>Idea Validation Scores</div>
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
