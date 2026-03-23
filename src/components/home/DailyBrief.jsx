import { useMemo } from "react";
import { VALIDATED_IDEAS, IDEA_CATEGORIES, BRANDS, MARKET_TRENDS, COMMUNITY_SIGNALS } from "../../data";
import Sparkline from "../common/Sparkline";
import AreaChart from "../common/charts/AreaChart";

// (type styles removed — ideas are all "build" now)
const SEV_COLOR = { high: "var(--r)", medium: "var(--a)", low: "var(--ink4)" };
const STATUS_LABEL = { "looking-to-sell": "Selling", "growth-stalled": "Stalled", "open-to-consulting": "Consulting", "growing": "Growing" };
const STATUS_COLOR = { "looking-to-sell": "var(--a)", "growth-stalled": "var(--r)", "open-to-consulting": "#4a9eff", "growing": "var(--g)" };

// Pick "daily" items based on the day of year so they rotate
function dailyIndex(arr) {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return dayOfYear % arr.length;
}

export default function DailyBrief({ onSelectPillar, onSelectDeal }) {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const dailyIdea = useMemo(() => VALIDATED_IDEAS[dailyIndex(VALIDATED_IDEAS)], []);
  const dailyBrand = useMemo(() => BRANDS[dailyIndex(BRANDS)], []);
  const dailyTrend = useMemo(() => MARKET_TRENDS[dailyIndex(MARKET_TRENDS)], []);
  const dailySignal = useMemo(() => COMMUNITY_SIGNALS[dailyIndex(COMMUNITY_SIGNALS)], []);

  const ideaCat = IDEA_CATEGORIES.find(c => c.id === dailyIdea.categoryId);
  const ideaSparkData = ideaCat?.sparkData || Array.from({ length: 12 }, (_, i) => Math.round(10 + (dailyIdea.growthRate * (i / 11))));
  const ideaGc = dailyIdea.growthRate >= 30 ? "var(--g)" : "var(--a)";
  const signalCat = IDEA_CATEGORIES.find(c => c.id === dailySignal.categoryId);
  const topQuote = dailySignal.sources.find(s => s.sampleQuote)?.sampleQuote;
  const trafficDown = dailyBrand.trafficTrend && dailyBrand.trafficTrend[0] > dailyBrand.trafficTrend[dailyBrand.trafficTrend.length - 1];
  const tc = trafficDown ? "var(--r)" : "var(--g)";
  const trendGc = dailyTrend.growth >= 200 ? "var(--g)" : "var(--a)";

  return (
    <div className="db">
      {/* Hero */}
      <div className="db-hero">
        <div className="db-hero-top">
          <div>
            <div className="db-date">{today}</div>
            <h1 className="db-title">Daily Brief</h1>
            <p className="db-subtitle">Your daily snapshot of consumer brand intelligence — one idea, one brand, one trend, one signal.</p>
          </div>
          <button className="db-cta" onClick={() => onSelectPillar(null)}>
            Open Radar →
          </button>
        </div>
      </div>

      {/* Idea of the Day */}
      <section className="db-section">
        <div className="db-sec-hdr">
          <div className="db-sec-label">Idea of the Day</div>
          <button className="hp-link" onClick={() => onSelectPillar("ideas")}>Explore all ideas →</button>
        </div>
        <div className="db-idea" onClick={() => onSelectPillar("ideas")}>
          <div className="db-idea-left">
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
              <span className="idea-type-badge" style={{ color: dailyIdea.stage === "validated" ? "var(--g)" : "var(--a)", background: dailyIdea.stage === "validated" ? "var(--gl)" : "rgba(212,175,55,.08)", borderColor: dailyIdea.stage === "validated" ? "var(--g)" : "var(--a)" }}>{dailyIdea.stage === "validated" ? "VALIDATED" : "EMERGING"}</span>
              {ideaCat && <span className="tag tm" style={{ fontSize: 10, padding: "2px 8px" }}>{ideaCat.icon} {ideaCat.name}</span>}
            </div>
            <h2 className="db-idea-title">{dailyIdea.title}</h2>
            <p className="db-idea-sub">{dailyIdea.subtitle}</p>
            <p className="db-idea-desc">{dailyIdea.description}</p>
            <div className="db-idea-metrics">
              <div><span className="db-mv">{dailyIdea.marketSize}</span><span className="db-ml">Market</span></div>
              <div><span className="db-mv" style={{ color: "var(--g)" }}>+{dailyIdea.growthRate}%</span><span className="db-ml">Growth</span></div>
              <div><span className="db-mv">{dailyIdea.estimatedTAM}</span><span className="db-ml">TAM</span></div>
              <div><span className="db-mv">{dailyIdea.competitorCount}</span><span className="db-ml">Competitors</span></div>
            </div>
          </div>
          <div className="db-idea-right">
            <div className="db-val-box">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span className="db-ml">Category Growth (12mo)</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 22, fontWeight: 700, color: ideaGc }}>+{dailyIdea.growthRate}%</span>
              </div>
              <AreaChart data={ideaSparkData} color={ideaGc} w={360} h={100} filled={true} />
            </div>
            {dailyIdea.communitySignals[0] && (
              <div className="db-signal-preview">
                <span className="db-sig-src">{dailyIdea.communitySignals[0].platform}</span>
                <span className="db-sig-text">{dailyIdea.communitySignals[0].signal}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Brand of the Day */}
      <section className="db-section">
        <div className="db-sec-hdr">
          <div className="db-sec-label">Brand of the Day</div>
          <button className="hp-link" onClick={() => onSelectPillar("deals")}>Browse all brands →</button>
        </div>
        <div className="db-brand" onClick={() => { onSelectPillar("deals"); onSelectDeal?.(dailyBrand); }}>
          <div className="db-brand-header" style={{ background: dailyBrand.bgGradient || dailyBrand.brandColor }}>
            <div className="db-brand-id">
              <div className="dc2-logo" style={{ borderColor: "rgba(255,255,255,.3)", width: 44, height: 44, fontSize: 14, overflow: "hidden" }}>{dailyBrand.logoUrl ? <img src={dailyBrand.logoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={e => { e.target.style.display = "none"; e.target.parentNode.textContent = dailyBrand.logo; }} /> : dailyBrand.logo}</div>
              <div>
                <div className="db-brand-name">{dailyBrand.name}</div>
                <div className="db-brand-cat">{dailyBrand.category} · {dailyBrand.hq}</div>
              </div>
            </div>
            <div className="db-brand-status">
              <span className="rf-status" style={{ color: "#fff", borderColor: "rgba(255,255,255,.4)" }}>{STATUS_LABEL[dailyBrand.status]}</span>
            </div>
          </div>
          <div className="db-brand-body">
            <div className="db-brand-chart">
              <div className="db-brand-chart-hdr">
                <span className="db-ml">Web Traffic (12mo)</span>
                <span className="db-mv" style={{ color: tc }}>{dailyBrand.trafficTrend?.[dailyBrand.trafficTrend.length - 1]}K/mo</span>
              </div>
              {dailyBrand.trafficTrend && <AreaChart data={dailyBrand.trafficTrend} color={tc} w={400} h={80} filled={true} />}
            </div>
            <div className="db-brand-stats">
              <div><span className="db-mv">{dailyBrand.employees}</span><span className="db-ml">Team</span></div>
              <div><span className="db-mv">{dailyBrand.advertising?.activeAds || 0}</span><span className="db-ml">Active Ads</span></div>
              <div><span className="db-mv">{dailyBrand.verifiedRevenue || "—"}</span><span className="db-ml">Revenue</span></div>
              <div><span className="db-mv">{dailyBrand.gaps?.length || 0}</span><span className="db-ml">Gaps</span></div>
              <div><span className="db-mv">{dailyBrand.socialFollowing?.instagram || "—"}</span><span className="db-ml">Instagram</span></div>
              <div><span className="db-mv">{dailyBrand.customerVoice?.trustpilotRating || "—"}/5</span><span className="db-ml">Trustpilot</span></div>
            </div>
            <div className="db-brand-flags">
              {dailyBrand.redFlags?.length > 0 && <span className="rf-flag red">{dailyBrand.redFlags.length} red flags</span>}
              {dailyBrand.greenFlags?.length > 0 && <span className="rf-flag green">{dailyBrand.greenFlags.length} green flags</span>}
              {dailyBrand.whiteSpace?.length > 0 && <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink4)" }}>{dailyBrand.whiteSpace.length} white space opportunities</span>}
            </div>
          </div>
        </div>
      </section>

      {/* Market Signals — Trend + Community Signal side by side */}
      <section className="db-section">
        <div className="db-sec-hdr">
          <div className="db-sec-label">Market Signals</div>
          <button className="hp-link" onClick={() => onSelectPillar("intel")}>View all signals →</button>
        </div>
        <div className="db-signals">
          {/* Trend */}
          <div className="db-trend" onClick={() => onSelectPillar("intel")}>
            <div className="db-sec-sublabel">Keyword Trend</div>
            <div className="db-trend-top">
              <div>
                {dailyTrend.isBreaking && <span className="intel-breaking" style={{ marginBottom: 6, display: "inline-block" }}>Breaking</span>}
                <h3 className="db-trend-keyword">{dailyTrend.keyword}</h3>
                <div className="db-trend-cat">{dailyTrend.category} · {(dailyTrend.volume / 1000).toFixed(0)}K monthly searches</div>
              </div>
              <span className="db-trend-growth" style={{ color: trendGc }}>+{dailyTrend.growth}%</span>
            </div>
            <div className="db-trend-chart">
              <AreaChart data={dailyTrend.sparkData} color={trendGc} w={440} h={100} filled={true} />
            </div>
            <p className="db-trend-summary">{dailyTrend.summary}</p>
            <div className="db-trend-signals">
              {dailyTrend.signals.map((s, i) => (
                <div className="db-trend-sig" key={i}>
                  <span className="db-sig-src">{s.platform}</span>
                  <span className="db-sig-text">{s.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Community Signal */}
          <div className="db-csignal" onClick={() => onSelectPillar("intel")}>
            <div className="db-sec-sublabel">Community Signal</div>
            <div className="db-csignal-top">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="signal-sev-dot" style={{ background: SEV_COLOR[dailySignal.severity] }} />
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, color: SEV_COLOR[dailySignal.severity], textTransform: "uppercase" }}>{dailySignal.severity} severity</span>
              </div>
              <span style={{ fontFamily: "var(--mono)", fontSize: 18, fontWeight: 700, color: dailySignal.growthRate >= 50 ? "var(--g)" : "var(--a)" }}>+{dailySignal.growthRate}%</span>
            </div>
            <h3 className="db-csignal-title">{dailySignal.title}</h3>
            <p className="db-csignal-desc">{dailySignal.description}</p>
            {signalCat && <div className="db-csignal-cat">{signalCat.icon} {signalCat.name}</div>}
            <div className="db-csignal-sources">
              {dailySignal.sources.filter(s => s.postCount > 0).map((s, i) => (
                <div className="db-csignal-src" key={i}>
                  <span className="db-csrc-name">{s.platform}</span>
                  <span className="db-csrc-val">{(s.postCount / 1000).toFixed(1)}K posts</span>
                  <span className="db-csrc-val">{s.avgEngagement > 0 ? s.avgEngagement.toLocaleString() + " avg eng" : "—"}</span>
                </div>
              ))}
            </div>
            {topQuote && <div className="db-csignal-quote">"{topQuote}"</div>}
            <div className="db-csignal-metrics">
              <span>{(dailySignal.searchVolume / 1000).toFixed(0)}K searches</span>
              <span>{(dailySignal.mentionCount / 1000).toFixed(1)}K mentions</span>
            </div>
          </div>
        </div>
      </section>

      {/* A/B Test toggle */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <button style={{ fontSize: 11, color: "var(--ink4)", background: "none", border: "1px dashed var(--bd)", padding: "6px 14px", cursor: "pointer", fontFamily: "var(--mono)" }} onClick={() => onSelectPillar("daily-alt")}>
          Try alternative design →
        </button>
      </div>

      {/* CTA */}
      <div className="db-bottom-cta">
        <div>
          <h3>Want more?</h3>
          <p>Create a personalized Radar to get a tailored intelligence feed matching your investment thesis.</p>
        </div>
        <button className="bw-list" onClick={() => onSelectPillar(null)}>Create your Radar →</button>
      </div>
    </div>
  );
}
