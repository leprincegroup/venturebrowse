import { useMemo } from "react";
import { VALIDATED_IDEAS, IDEA_CATEGORIES, BRANDS, MARKET_TRENDS, COMMUNITY_SIGNALS } from "../../data";
import AreaChart from "../common/charts/AreaChart";
import Sparkline from "../common/Sparkline";

function topN(arr, key, n = 3) {
  return [...arr].sort((a, b) => (b[key] || 0) - (a[key] || 0)).slice(0, n);
}

function pickSpotlight() {
  // Rotate daily: pick the single most interesting item across all categories
  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const candidates = [
    ...VALIDATED_IDEAS.map(i => ({ type: "idea", score: i.validationScore * 10 + i.growthRate, item: i })),
    ...MARKET_TRENDS.filter(t => t.isBreaking).map(t => ({ type: "trend", score: t.growth + t.trendScore, item: t })),
    ...COMMUNITY_SIGNALS.filter(s => s.severity === "high").map(s => ({ type: "signal", score: s.growthRate * 2 + s.mentionCount / 1000, item: s })),
  ].sort((a, b) => b.score - a.score);
  return candidates[day % candidates.length];
}

const SPOT_COLORS = { idea: "var(--g)", trend: "var(--a)", signal: "var(--r)" };

function spotLabel(spot) {
  if (spot.type === "idea") return "Business opportunity";
  if (spot.type === "trend") return "Search trend gaining momentum";
  return "Consumer pain point";
}

function spotDescription(spot) {
  if (spot.type === "idea") return spot.item.description?.slice(0, 180) || spot.item.subtitle;
  if (spot.type === "trend") return spot.item.summary;
  // For signals, explain what the problem is and why it's an opportunity
  const cat = IDEA_CATEGORIES.find(c => c.id === spot.item.categoryId);
  const catName = cat?.name || "";
  return `Consumers are frustrated: ${spot.item.description.slice(0, 120)}. This creates a gap in ${catName} that founders and investors can capitalize on.`;
}

export default function DailyBriefAlt({ onSelectPillar, onSelectDeal, onSelectIdea, user, onShowAuth }) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const ideas = useMemo(() => topN(VALIDATED_IDEAS, "validationScore"), []);
  const brands = useMemo(() => topN(BRANDS, "employees"), []);
  const trends = useMemo(() => topN(MARKET_TRENDS, "growth"), []);
  const signals = useMemo(() => topN(COMMUNITY_SIGNALS, "growthRate"), []);
  const spot = useMemo(() => pickSpotlight(), []);
  const spotColor = SPOT_COLORS[spot.type];

  return (
    <div className="z">
      {/* Hero Spotlight */}
      {(() => {
        // Build chart data for any spotlight type
        const chartData = spot.type === "idea"
          ? (IDEA_CATEGORIES.find(c => c.id === spot.item.categoryId)?.sparkData || Array.from({ length: 12 }, (_, i) => Math.round(10 + (spot.item.growthRate * (i / 11)))))
          : spot.type === "trend"
            ? spot.item.sparkData
            : spot.item.sources.map(s => s.postCount).filter(Boolean);
        const growthNum = spot.type === "idea" ? spot.item.growthRate : spot.type === "trend" ? spot.item.growth : spot.item.growthRate;
        const title = spot.type === "idea" ? spot.item.title : spot.type === "trend" ? spot.item.keyword : spot.item.title;

        return (
          <div className="z-spotlight" onClick={() => onSelectPillar(spot.type === "idea" ? "ideas" : "intel")}>
            <div className="z-spot-left">
              <span className="z-spot-label">{spotLabel(spot)} &middot; {today}</span>
              <h1 className="z-spot-title">{title}</h1>
              <p className="z-spot-desc">{spotDescription(spot)}</p>
              <span className="z-spot-cta">Read the full analysis &rarr;</span>
            </div>
            <div className="z-spot-right">
              {/* Big growth number */}
              <div className="z-spot-hero-num" style={{ color: spotColor }}>+{growthNum}%</div>
              {/* Chart */}
              <div className="z-spot-chart">
                <AreaChart data={chartData} color={spotColor} w={520} h={160} filled={true} />
              </div>
              {/* Metric bar */}
              <div className="z-spot-metrics">
                {spot.type === "idea" && <>
                  <div className="z-spot-m"><span className="z-spot-m-v">{spot.item.marketSize}</span><span className="z-spot-m-l">market</span></div>
                  <div className="z-spot-m"><span className="z-spot-m-v">{spot.item.competitorCount}</span><span className="z-spot-m-l">competitors</span></div>
                  <div className="z-spot-m"><span className="z-spot-m-v">{spot.item.estimatedTAM}</span><span className="z-spot-m-l">TAM</span></div>
                  <div className="z-spot-m"><span className="z-spot-m-v">{spot.item.validationScore}/10</span><span className="z-spot-m-l">validation</span></div>
                </>}
                {spot.type === "trend" && <>
                  <div className="z-spot-m"><span className="z-spot-m-v">{(spot.item.volume / 1e6).toFixed(1)}M</span><span className="z-spot-m-l">searches</span></div>
                  <div className="z-spot-m"><span className="z-spot-m-v">{spot.item.trendScore}</span><span className="z-spot-m-l">score</span></div>
                  <div className="z-spot-m"><span className="z-spot-m-v">{spot.item.sentiment}/10</span><span className="z-spot-m-l">sentiment</span></div>
                </>}
                {spot.type === "signal" && <>
                  {spot.item.sources.filter(s => s.postCount > 0).map((s, i) => (
                    <div className="z-spot-m" key={i}><span className="z-spot-m-v">{(s.postCount / 1000).toFixed(1)}K</span><span className="z-spot-m-l">{s.platform} posts</span></div>
                  ))}
                  <div className="z-spot-m"><span className="z-spot-m-v">{(spot.item.searchVolume / 1000).toFixed(0)}K</span><span className="z-spot-m-l">monthly searches</span></div>
                </>}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Ideas */}
      <div className="z-section-hdr">
        <span className="z-section-label">Ideas Worth Building</span>
        <button className="z-see-all" onClick={() => onSelectPillar("ideas")}>See all {VALIDATED_IDEAS.length} &rarr;</button>
      </div>
      <div className="z-row">
        {ideas.map(idea => {
          const cat = IDEA_CATEGORIES.find(c => c.id === idea.categoryId);
          const spark = cat?.sparkData || Array.from({ length: 12 }, (_, i) => Math.round(10 + (idea.growthRate * (i / 11))));
          return (
            <div className="z-card" key={idea.id} onClick={() => onSelectIdea?.(idea)}>
              <div className="z-card-header">
                <span className="z-badge" style={{ color: "var(--g)" }}>{idea.stage}</span>
                <span className="z-date-sm">{new Date(idea.releasedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
              </div>
              <div className="z-chart-area">
                <Sparkline data={spark} color="var(--g)" w={320} h={48} filled={true} />
              </div>
              <div className="z-mini-stats">
                <span className="z-ms" style={{ color: "var(--g)" }}>+{idea.growthRate}%</span>
                <span className="z-ms">{idea.marketSize}</span>
                <span className="z-ms">{idea.competitorCount} comp.</span>
              </div>
              <h3 className="z-card-title">{idea.title}</h3>
              <p className="z-card-desc">{idea.subtitle}</p>
              {cat && <span className="z-tag">{cat.icon} {cat.name}</span>}
              <div className="z-card-footer"><span>Explore</span><span className="z-arrow">&rarr;</span></div>
            </div>
          );
        })}
      </div>

      {/* Brands */}
      <div className="z-section-hdr">
        <span className="z-section-label">Brands to Watch</span>
        <button className="z-see-all" onClick={() => onSelectPillar("deals")}>Browse all {BRANDS.length} &rarr;</button>
      </div>
      <div className="z-row">
        {brands.map(brand => {
          const down = brand.trafficTrend?.[0] > brand.trafficTrend?.[brand.trafficTrend.length - 1];
          return (
            <div className="z-card" key={brand.id} onClick={() => { onSelectPillar("deals"); onSelectDeal?.(brand); }}>
              <div className="z-brand-row">
                <div className="z-brand-avatar">{brand.logoUrl ? <img src={brand.logoUrl} alt={brand.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={e => { e.target.style.display = "none"; e.target.parentNode.textContent = brand.logo; }} /> : brand.logo}</div>
                <div>
                  <div className="z-brand-name">{brand.name}</div>
                  <div className="z-brand-meta">{brand.category} &middot; {brand.hq.split(",")[0]}</div>
                </div>
              </div>
              {brand.trafficTrend && (
                <div className="z-chart-area">
                  <Sparkline data={brand.trafficTrend} color={down ? "var(--r)" : "var(--g)"} w={320} h={48} filled={true} />
                </div>
              )}
              <div className="z-mini-stats">
                <span className="z-ms" style={{ color: down ? "var(--r)" : "var(--g)" }}>{brand.trafficTrend?.[brand.trafficTrend.length - 1]}K/mo</span>
                <span className="z-ms">{brand.employees} team</span>
                <span className="z-ms">{brand.advertising?.activeAds || 0} ads</span>
              </div>
              {brand.verifiedRevenue && <div className="z-revenue">{brand.verifiedRevenue}</div>}
              <div className="z-flag-row">
                {brand.redFlags?.length > 0 && <span className="z-flag z-fl-r">{brand.redFlags.length} red</span>}
                {brand.greenFlags?.length > 0 && <span className="z-flag z-fl-g">{brand.greenFlags.length} green</span>}
                <span className="z-flag">{brand.gaps?.length || 0} gaps</span>
              </div>
              <div className="z-card-footer"><span>Deep dive</span><span className="z-arrow">&rarr;</span></div>
            </div>
          );
        })}
      </div>

      {/* Trends */}
      <div className="z-section-hdr">
        <span className="z-section-label">Keyword Trends</span>
        <button className="z-see-all" onClick={() => onSelectPillar("intel")}>All trends &rarr;</button>
      </div>
      <div className="z-row">
        {trends.map(t => (
          <div className="z-card" key={t.id} onClick={() => onSelectPillar("intel")}>
            <div className="z-card-header">
              <span className="z-badge" style={{ color: "var(--a)" }}>{t.category}</span>
              {t.isBreaking && <span className="z-tag z-tag-r">Breaking</span>}
            </div>
            <div className="z-trend-top">
              <h3 className="z-card-title" style={{ margin: 0, flex: 1 }}>{t.keyword}</h3>
              <span className="z-trend-pct" style={{ color: t.growth >= 200 ? "var(--g)" : "var(--a)" }}>+{t.growth}%</span>
            </div>
            <div className="z-chart-area">
              <AreaChart data={t.sparkData} color={t.growth >= 200 ? "var(--g)" : "var(--a)"} w={320} h={80} filled={true} />
            </div>
            <div className="z-mini-stats">
              <span className="z-ms">{(t.volume / 1e6).toFixed(1)}M searches</span>
              <span className="z-ms">{t.sentiment}/10 sentiment</span>
            </div>
            <p className="z-card-desc">{t.summary.length > 100 ? t.summary.slice(0, 100) + "..." : t.summary}</p>
            {t.signals[0] && (
              <div className="z-signal-row">
                <span className="z-signal-src">{t.signals[0].platform}</span>
                <span className="z-signal-text">{t.signals[0].text.length > 80 ? t.signals[0].text.slice(0, 80) + "..." : t.signals[0].text}</span>
              </div>
            )}
            <div className="z-card-footer"><span>Explore</span><span className="z-arrow">&rarr;</span></div>
          </div>
        ))}
      </div>

      {/* Signals */}
      <div className="z-section-hdr">
        <span className="z-section-label">Community Signals</span>
        <button className="z-see-all" onClick={() => onSelectPillar("intel")}>All signals &rarr;</button>
      </div>
      <div className="z-row">
        {signals.map(s => {
          const cat = IDEA_CATEGORIES.find(c => c.id === s.categoryId);
          const quote = s.sources.find(src => src.sampleQuote)?.sampleQuote;
          return (
            <div className="z-card" key={s.id} onClick={() => onSelectPillar("intel")}>
              <div className="z-card-header">
                <span className="z-badge" style={{ color: "var(--r)" }}>{s.severity} severity</span>
                <span className="z-trend-pct" style={{ color: s.growthRate >= 50 ? "var(--g)" : "var(--a)", fontSize: 20 }}>+{s.growthRate}%</span>
              </div>
              <h3 className="z-card-title">{s.title}</h3>
              <p className="z-card-desc" style={{ marginBottom: 8 }}>{cat?.icon} {cat?.name} &middot; {(s.mentionCount / 1000).toFixed(1)}K mentions</p>
              <div className="z-mini-stats">
                {s.sources.filter(src => src.postCount > 0).map((src, i) => (
                  <span className="z-ms" key={i}>{(src.postCount / 1000).toFixed(1)}K {src.platform}</span>
                ))}
              </div>
              {quote && <div className="z-quote">&ldquo;{quote.length > 100 ? quote.slice(0, 100) + "..." : quote}&rdquo;</div>}
              <div className="z-card-footer"><span>Explore</span><span className="z-arrow">&rarr;</span></div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="z-bottom" onClick={() => onSelectPillar("ideas")}>
        <span>Explore all validated ideas, brands, and market signals</span>
        <span className="z-bottom-btn">Get started &rarr;</span>
      </div>
    </div>
  );
}
