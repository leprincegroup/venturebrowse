import { useState, useLayoutEffect, useRef } from "react";
import { IDEA_CATEGORIES, VALIDATED_IDEAS } from "../../data";
import { COMMUNITY_SIGNALS } from "../../data/trends";
import { MARKET_TRENDS } from "../../data/trends";
import AreaChart from "../common/charts/AreaChart";
import { computeBrandScore, scoreColor, scoreLabel } from "../../lib/brandScore";
import AnalyticalChart from "../common/charts/AnalyticalChart";
import BarChart from "../common/charts/BarChart";
import RadarChart from "../common/charts/RadarChart";
import ComparisonBars from "../common/charts/ComparisonBars";
import DonutChart from "../common/charts/DonutChart";
import SignalTimeline from "../common/charts/SignalTimeline";
import FlagList from "../common/charts/FlagList";
import StarDistribution from "../common/charts/StarDistribution";
import Sparkline from "../common/Sparkline";

const STATUS_LABEL = {
  "looking-to-sell": "Looking to Sell", "growth-stalled": "Growth Stalled",
  "open-to-consulting": "Open to Consulting", "growing": "Growing",
};
const STATUS_CLASS = {
  "looking-to-sell": "ta", "growth-stalled": "tr", "open-to-consulting": "tb", "growing": "tg",
};
const SEV_CLASS = { critical: "tr", high: "ta", medium: "tm", low: "tm" };
const SRC_COLORS = { organic: "#34c759", direct: "#007aff", paid: "#ff9f0a", social: "#af52de", referral: "#86868b", email: "#ff2d55" };
const SRC_GRADIENTS = { organic: "linear-gradient(90deg,#34c759,#30d158)", direct: "linear-gradient(90deg,#007aff,#5ac8fa)", paid: "linear-gradient(90deg,#ff9f0a,#ffcc02)", social: "linear-gradient(90deg,#af52de,#bf5af2)", referral: "linear-gradient(90deg,#86868b,#aeaeb2)", email: "linear-gradient(90deg,#ff2d55,#ff6482)" };

function buildRadar(brand) {
  const td = brand.trafficTrend ? (brand.trafficTrend[brand.trafficTrend.length - 1] / brand.trafficTrend[0]) * 10 : 5;
  const sd = brand.searchInterest ? (brand.searchInterest[brand.searchInterest.length - 1] / brand.searchInterest[0]) * 10 : 5;
  const soc = brand.socialFollowing?.instagram ? (parseInt(brand.socialFollowing.instagram) >= 1000 ? 8 : 6) : 3;
  const gaps = Math.max(0, 10 - brand.gaps.length * 2);
  const opps = Math.min(10, brand.whiteSpace.length * 2.5);
  const rev = brand.customerVoice?.trustpilotRating ? brand.customerVoice.trustpilotRating * 2 : 5;
  return [
    { label: "Traffic", value: Math.min(10, Math.max(1, Math.round(td * 10) / 10)) },
    { label: "Social", value: soc },
    { label: "Reviews", value: Math.round(rev * 10) / 10 },
    { label: "Ops", value: Math.round(gaps * 10) / 10 },
    { label: "Oppty", value: Math.round(opps * 10) / 10 },
    { label: "Search", value: Math.min(10, Math.max(1, Math.round(sd * 10) / 10)) },
  ];
}

export default function BrandPage({ brand, onBack, watched, onToggleWatch }) {
  const topRef = useRef(null);
  const headerRef = useRef(null);
  useLayoutEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [brand]);

  const trafficDown = brand.trafficTrend && brand.trafficTrend[0] > brand.trafficTrend[brand.trafficTrend.length - 1];
  const brandScore = computeBrandScore(brand);
  const trafficColor = trafficDown ? "var(--r)" : "var(--g)";
  const radar = buildRadar(brand);

  const TABS = [
    { id: "bp-sec-overview", label: "Overview" },
    { id: "bp-sec-analysis", label: "Analysis" },
    { id: "bp-sec-signals", label: "Signals" },
    { id: "bp-sec-leadership", label: "Leadership" },
    { id: "bp-sec-legal", label: "Legal" },
    { id: "bp-sec-digital", label: "Digital" },
    { id: "bp-sec-advertising", label: "Advertising" },
    { id: "bp-sec-products", label: "Products" },
    { id: "bp-sec-social", label: "Social" },
    { id: "bp-sec-seo", label: "SEO" },
    { id: "bp-sec-competition", label: "Competition" },
    { id: "bp-sec-hiring", label: "Hiring" },
    { id: "bp-sec-ma", label: "M&A" },
    { id: "bp-sec-pricing", label: "Pricing" },
    { id: "bp-sec-financial", label: "Financial" },
    { id: "bp-sec-reviews", label: "Reviews" },
    { id: "bp-sec-intel", label: "Market Intel" },
    { id: "bp-sec-sources", label: "Sources" },
  ];

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const trafficSrcSegments = Object.entries(brand.trafficSources || {}).map(([k, v]) => ({
    value: v, color: SRC_COLORS[k] || "var(--ink4)", gradient: SRC_GRADIENTS[k], label: k,
  }));

  const countryBars = (brand.topCountries || []).map(c => ({
    label: c.country.length > 12 ? c.country.slice(0, 10) + "…" : c.country,
    value: c.pct, displayValue: `${c.pct}%`, color: "#5ac8fa", gradient: "linear-gradient(90deg,#5ac8fa,#64d2ff)",
  }));

  return (
    <div className="bp" ref={topRef}>
      {/* Header */}
      <div className="bp-header-z" ref={headerRef}>
        <button className="bp-back-z" onClick={onBack}>← Back</button>

        {/* Two-column split */}
        <div className="bp-split">
          {/* LEFT — identity + thesis */}
          <div className="bp-split-left">
            <span style={{ fontSize: 11, color: "var(--ink4)", letterSpacing: ".06em", textTransform: "uppercase", display: "block", marginBottom: 16 }}>{brand.category}</span>

            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20 }}>
              <div className="bp-logo-z" style={{ overflow: "hidden" }}>
                {brand.logoUrl
                  ? <img src={brand.logoUrl} alt={brand.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={e => { e.target.style.display = "none"; e.target.parentNode.textContent = brand.logo; }} />
                  : brand.logo
                }
              </div>
              <div>
                <h1 style={{ fontSize: 32, fontWeight: 500, letterSpacing: "-.03em", color: "var(--ink)", margin: 0 }}>
                  {brand.name}
                  <span style={{ fontSize: 14, fontWeight: 500, color: scoreColor(brandScore.overall), marginLeft: 12, verticalAlign: "middle" }}>
                    {brandScore.overall}/100 · {scoreLabel(brandScore.overall)}
                  </span>
                </h1>
                <div style={{ fontSize: 13, color: "var(--ink4)", marginTop: 4 }}>{brand.hq} · Est. {brand.founded} · {brand.website}</div>
              </div>
              {(brand.verification === "verified" || brand.verification === "claimed") && (
                <span className="bp-verified-z">Verified</span>
              )}
              {!(brand.verification === "verified" || brand.verification === "claimed") && (
                <button style={{ fontSize: 11, fontWeight: 500, padding: "5px 14px", background: "var(--w)", border: "1px solid var(--bd)", color: "var(--ink)", cursor: "pointer", marginLeft: "auto" }}>Claim brand</button>
              )}
            </div>

            <p style={{ fontSize: 14, color: "var(--ink3)", lineHeight: 1.7, fontWeight: 400 }}>
              {brand.brandStory}
            </p>
          </div>

          {/* RIGHT — chart + data */}
          <div className="bp-split-right">
            {brand.trafficTrend && (
              <>
                <div style={{ fontSize: 36, fontWeight: 500, color: trafficDown ? "var(--r)" : "var(--g)", letterSpacing: "-.04em", lineHeight: 1, marginBottom: 8 }}>
                  {brand.trafficTrend[brand.trafficTrend.length - 1]}K<span style={{ fontSize: 14, fontWeight: 400, color: "var(--ink4)" }}>/mo</span>
                </div>
                <div className="z-chart-area" style={{ margin: "0 -16px" }}>
                  <AreaChart data={brand.trafficTrend} color={trafficDown ? "var(--r)" : "var(--g)"} w={600} h={180} filled={true} interactive={true} />
                </div>
              </>
            )}

            <div className="bp-split-metrics">
              <div><span className="bp-sm-v">{brand.employees}</span><span className="bp-sm-l">team</span></div>
              <div><span className="bp-sm-v">{brand.socialFollowing?.instagram || "—"}</span><span className="bp-sm-l">instagram</span></div>
              <div><span className="bp-sm-v">{brand.socialFollowing?.tiktok || "—"}</span><span className="bp-sm-l">tiktok</span></div>
              {brand.verifiedRevenue && <div><span className="bp-sm-v">{brand.verifiedRevenue}</span><span className="bp-sm-l">revenue</span></div>}
              <div><span className="bp-sm-v">{brand.customerVoice?.trustpilotRating || "—"}/5</span><span className="bp-sm-l">trustpilot</span></div>
              <div><span className="bp-sm-v">{brand.advertising?.activeAds || 0}</span><span className="bp-sm-l">ads live</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky brand bar + tabs */}
      <div className="bp-sticky-bar">
        <div className="bp-tabs-inner">
          {TABS.map(t => (
            <button key={t.id} className="bp-tab" onClick={() => scrollToSection(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bp-body">

        {/* Executive Summary */}
        {brand.summary && (
          <div className="bp-exec">
            <h3 className="bp-exec-label">Executive Summary</h3>
            <p className="bp-exec-text">{brand.summary}</p>
          </div>
        )}

        {/* ─── SECTION: Overview ─── */}
        <div id="bp-sec-overview" />
        <div className="bp-section-divider">
          <span className="bp-section-label">Overview</span>
        </div>

        <div className="bp-row bp-row-3">
          <div className="bp-card">
            <div className="bp-card-title">Brand Health</div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <RadarChart axes={radar} size={200} color={brand.brandColor} />
            </div>
          </div>
          <div className="bp-card">
            <div className="bp-card-title">Signals</div>
            <div style={{ marginBottom: 12 }}>
              <span className="dc3-flag red" style={{ marginRight: 6 }}>{brand.redFlags?.length || 0} red flags</span>
              <span className="dc3-flag green">{brand.greenFlags?.length || 0} green flags</span>
            </div>
            <SignalTimeline events={(brand.signalTimeline || []).slice(0, 4)} />
          </div>
          <div className="bp-card">
            <div className="bp-card-title">Competitive Landscape</div>
            {brand.competitors.map((c, i) => (
              <div key={i} style={{ padding: "10px 0", borderBottom: i < brand.competitors.length - 1 ? "1px solid var(--bd)" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink3)" }}>{c.metric}</span>
                </div>
                <p style={{ fontSize: 11, color: "var(--ink4)", fontWeight: 300 }}>{c.strength}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="bp-sec-analysis" />
        {/* ─── SECTION: Analysis & Opportunities ─── */}
        <div className="bp-section-divider">
          <span className="bp-section-label">Analysis & Opportunities</span>
        </div>
        <div className="bp-row bp-row-2">
          <div className="bp-card">
            <div className="bp-card-title">Gap Analysis</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "var(--bd)", border: "1px solid var(--bd)", marginBottom: 16 }}>
              <div style={{ background: "var(--w)", padding: "10px", textAlign: "center" }}>
                <span className="dc3-sv" style={{ color: "var(--r)" }}>{brand.gaps.filter(g => g.severity === "critical").length}</span>
                <span className="dc3-sl">Critical</span>
              </div>
              <div style={{ background: "var(--w)", padding: "10px", textAlign: "center" }}>
                <span className="dc3-sv" style={{ color: "var(--a)" }}>{brand.gaps.filter(g => g.severity === "high").length}</span>
                <span className="dc3-sl">High</span>
              </div>
              <div style={{ background: "var(--w)", padding: "10px", textAlign: "center" }}>
                <span className="dc3-sv" style={{ color: "var(--ink4)" }}>{brand.gaps.filter(g => g.severity === "medium" || g.severity === "low").length}</span>
                <span className="dc3-sl">Medium/Low</span>
              </div>
            </div>
            {brand.gaps.map((g, i) => (
              <div key={i} style={{ padding: "10px 0", borderTop: "1px solid var(--bd)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{g.area}</span>
                  <span className={`tag ${SEV_CLASS[g.severity]}`} style={{ fontSize: 10, padding: "2px 8px" }}>{g.severity}</span>
                </div>
                <p style={{ fontSize: 12, color: "var(--ink3)", fontWeight: 300, lineHeight: 1.5 }}>{g.description}</p>
                {g.competitor && <div style={{ fontSize: 11, color: "var(--ink4)", marginTop: 4 }}>Benchmark: {g.competitor}</div>}
              </div>
            ))}
          </div>
          <div className="bp-card">
            <div className="bp-card-title">White Space Opportunities</div>
            {brand.whiteSpace.map((o, i) => (
              <div key={i} style={{ padding: 14, background: "var(--off)", borderRadius: 8, border: "1px solid var(--bd)", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{o.opportunity}</span>
                  <span className={`tag ${o.impact === "High" ? "tg" : "ta"}`} style={{ fontSize: 10, padding: "2px 8px" }}>{o.impact}</span>
                </div>
                <p style={{ fontSize: 12, color: "var(--ink3)", fontWeight: 300, lineHeight: 1.5, marginBottom: 6 }}>{o.description}</p>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink4)" }}>Timeframe: {o.timeframe}</span>
              </div>
            ))}
          </div>
        </div>

        <div id="bp-sec-signals" />
        {/* ─── SECTION: Risk & Opportunity Signals ─── */}
        <div className="bp-section-divider">
          <span className="bp-section-label">Risk & Opportunity Signals</span>
        </div>
        <div className="bp-row bp-row-2">
          <div className="bp-card">
            <div className="bp-card-title">Red Flags ({brand.redFlags?.length || 0})</div>
            <FlagList flags={brand.redFlags || []} type="red" />
          </div>
          <div className="bp-card">
            <div className="bp-card-title">Green Flags ({brand.greenFlags?.length || 0})</div>
            <FlagList flags={brand.greenFlags || []} type="green" />
          </div>
        </div>

        <div id="bp-sec-leadership" />
        {/* ─── SECTION: Leadership & Ownership ─── */}
        {brand.leadership && (
          <>
            <div className="bp-section-divider">
              <span className="bp-section-label">Leadership & Ownership</span>
            </div>
            <div className="bp-row bp-row-2" style={{ marginBottom: 16 }}>
              <div className="bp-card">
                <div className="bp-card-title">Key People</div>
                {brand.leadership.map((p, i) => (
                  <div key={i} style={{ padding: "12px 0", borderBottom: i < brand.leadership.length - 1 ? "1px solid var(--bd)" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</span>
                      <span className={`tag ${p.status === "active" ? "tg" : p.status === "inactive" ? "tr" : "ta"}`}>{p.status}</span>
                    </div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink3)", marginBottom: 6 }}>{p.role}</div>
                    <p style={{ fontSize: 12, color: "var(--ink3)", fontWeight: 400, lineHeight: 1.5 }}>{p.note}</p>
                  </div>
                ))}
              </div>
              <div className="bp-card">
                <div className="bp-card-title">Funding & Investors</div>
                {brand.boardAndInvestors && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div><span className="dc3-sv">{brand.boardAndInvestors.fundingRounds}</span><span className="dc3-sl">Funding Rounds</span></div>
                    <div><span className="dc3-sv">{brand.boardAndInvestors.estimatedTotalRaised}</span><span className="dc3-sl">Est. Total Raised</span></div>
                  </div>
                )}
                <div style={{ fontSize: 13, color: "var(--ink2)", marginBottom: 16 }}>
                  <span style={{ fontWeight: 600 }}>Known Investors: </span>{brand.boardAndInvestors?.knownInvestors || "Unknown"}
                </div>
                {brand.certifications && <>
                  <div className="bp-card-subtitle">Certifications</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                    {brand.certifications.map((c, i) => <span key={i} className="tag tg">{c}</span>)}
                  </div>
                </>}
                {brand.patents && brand.patents.length > 0 && <>
                  <div className="bp-card-subtitle">IP / Patents</div>
                  {brand.patents.map((p, i) => (
                    <div key={i} style={{ padding: "6px 0", fontSize: 12, borderBottom: "1px solid var(--bd)" }}>
                      <span style={{ fontWeight: 500 }}>{p.title}</span>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink4)", marginTop: 2 }}>
                        {p.status} · {p.jurisdiction} · {p.year}
                      </div>
                    </div>
                  ))}
                </>}
              </div>
            </div>
          </>
        )}

        <div id="bp-sec-legal" />
        {/* ─── SECTION: Legal & Regulatory Risk ─── */}
        {brand.legalRisk && (
          <>
            <div className="bp-section-divider">
              <span className="bp-section-label">Legal & Regulatory Risk</span>
            </div>
            <div className="bp-row bp-row-3" style={{ marginBottom: 16 }}>
              <div className="bp-card">
                <div className="bp-card-title">Regulatory Status</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div><span className="dc3-sv" style={{ color: brand.legalRisk.fdaWarnings > 0 ? "var(--r)" : "var(--g)" }}>{brand.legalRisk.fdaWarnings}</span><span className="dc3-sl">FDA Warnings</span></div>
                  <div><span className="dc3-sv" style={{ color: brand.legalRisk.ftcActions > 0 ? "var(--r)" : "var(--g)" }}>{brand.legalRisk.ftcActions}</span><span className="dc3-sl">FTC Actions</span></div>
                  <div><span className="dc3-sv" style={{ color: brand.legalRisk.bbbComplaints > 5 ? "var(--r)" : "var(--a)" }}>{brand.legalRisk.bbbComplaints}</span><span className="dc3-sl">BBB Complaints</span></div>
                  <div><span className="dc3-sv">{brand.legalRisk.bbbRating}</span><span className="dc3-sl">BBB Rating</span></div>
                </div>
                {brand.legalRisk.regulatoryNotes && (
                  <p style={{ fontSize: 12, color: "var(--ink3)", fontWeight: 400, lineHeight: 1.5, padding: "10px 0", borderTop: "1px solid var(--bd)" }}>{brand.legalRisk.regulatoryNotes}</p>
                )}
              </div>
              <div className="bp-card">
                <div className="bp-card-title">Active Legal Issues</div>
                {brand.legalRisk.activeLawsuits?.length > 0 ? brand.legalRisk.activeLawsuits.map((l, i) => (
                  <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid var(--bd)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span className="tag tr">{l.type}</span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink4)" }}>{l.date}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "var(--ink2)", fontWeight: 400, lineHeight: 1.5 }}>{l.description}</p>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--a)", marginTop: 4 }}>Status: {l.status}</div>
                  </div>
                )) : <p style={{ fontSize: 13, color: "var(--g)", fontWeight: 500 }}>No active legal issues found</p>}
              </div>
              <div className="bp-card">
                <div className="bp-card-title">Trademarks</div>
                {brand.legalRisk.trademarks?.map((t, i) => (
                  <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid var(--bd)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{t.name}</div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink4)" }}>{t.jurisdiction}</div>
                    </div>
                    <span className={`tag ${t.status === "active" ? "tg" : "ta"}`}>{t.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div id="bp-sec-digital" />
        {/* ─── SECTION: Digital Performance ─── */}
        <div className="bp-section-divider">
          <span className="bp-section-label">Digital Performance</span>
        </div>

        {/* Traffic Chart + Sources — side by side */}
        <div className="bp-row bp-row-2">
          <div className="bp-card">
            <div className="dp-chart-header">
              <div className="bp-card-title" style={{ marginBottom: 0 }}>Website Traffic</div>
              <div className="dp-chart-meta">
                <span className="dp-chart-val">{brand.trafficTrend?.[brand.trafficTrend.length - 1] || "—"}K</span>
                <span className="dp-chart-label">visits/mo</span>
                {brand.trafficTrend && (() => {
                  const first = brand.trafficTrend[0], last = brand.trafficTrend[brand.trafficTrend.length - 1];
                  const pct = Math.round(((last - first) / first) * 100);
                  return <span className={`dp-chart-delta ${pct >= 0 ? "up" : "down"}`}>{pct >= 0 ? "+" : ""}{pct}%</span>;
                })()}
              </div>
            </div>
            <AnalyticalChart
              series={[{ name: brand.name, data: brand.trafficTrend || [], color: trafficColor }]}
              height={160} showMinMax={true}
              formatValue={v => `${v}K`}
            />
          </div>
          <div className="bp-card">
            <div className="bp-card-title">Traffic Sources</div>
            <div className="dp-sources">
              {trafficSrcSegments.sort((a, b) => b.value - a.value).map(s => (
                <div className="dp-src-row" key={s.label}>
                  <span className="dp-src-dot" style={{ background: s.color }} />
                  <span className="dp-src-name">{s.label}</span>
                  <div className="dp-src-bar-wrap">
                    <div className="dp-src-bar" style={{ width: `${(s.value / Math.max(...trafficSrcSegments.map(x => x.value))) * 100}%`, background: s.gradient || s.color }} />
                  </div>
                  <span className="dp-src-pct">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Countries */}
        <div className="bp-row bp-row-2">
          <div className="bp-card">
            <div className="bp-card-title">Top Countries</div>
            <ComparisonBars items={countryBars} unit="%" />
          </div>
          <div className="bp-card">
            <div className="bp-card-title">Email & Retention</div>
            <div className="bp-pricing-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div><span className="dc3-sv">{brand.trafficSources?.email || "—"}%</span><span className="dc3-sl">Email Traffic Share</span></div>
              <div><span className="dc3-sv">{brand.pricing?.hasSubscription ? "Active" : "None"}</span><span className="dc3-sl">Subscription Model</span></div>
              <div><span className="dc3-sv">{brand.techStack?.includes("Klaviyo") ? "Klaviyo" : brand.techStack?.includes("Mailchimp") ? "Mailchimp" : "—"}</span><span className="dc3-sl">Email Platform</span></div>
              <div><span className="dc3-sv">{brand.pricing?.subDiscount || "—"}</span><span className="dc3-sl">Sub Discount</span></div>
            </div>
          </div>
        </div>

        <div id="bp-sec-advertising" />
        {/* ─── SECTION: Advertising ─── */}
        <div className="bp-section-divider">
          <span className="bp-section-label">Advertising</span>
        </div>

        {/* ── Part 1: Ad Analytics Dashboard ── */}
        {brand.advertising && brand.advertising.totalAds > 0 ? (<>
          <div className="ad-analytics">
            {/* KPI Row */}
            <div className="ad-kpi-row">
              <div className="ad-kpi">
                <div className="ad-kpi-val">{brand.advertising.activeAds}</div>
                <div className="ad-kpi-label">Active Ads</div>
              </div>
              <div className="ad-kpi">
                <div className="ad-kpi-val">{brand.advertising.totalAds}</div>
                <div className="ad-kpi-label">Total Ads</div>
              </div>
              <div className="ad-kpi ad-kpi-formats">
                <div className="ad-kpi-label" style={{ marginBottom: 8 }}>By Format</div>
                <div className="ad-format-bars">
                  {Object.entries(brand.advertising.formats).filter(([,v]) => v > 0).map(([fmt, count]) => (
                    <div className="ad-format-item" key={fmt}>
                      <div className="ad-format-icon">{fmt === "video" ? "▶" : fmt === "image" ? "◻" : fmt === "carousel" ? "◫" : "👤"}</div>
                      <div className="ad-format-bar-wrap">
                        <div className="ad-format-bar" style={{ width: `${(count / brand.advertising.totalAds) * 100}%` }} />
                      </div>
                      <span className="ad-format-count">{count}</span>
                      <span className="ad-format-name">{fmt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Hooks + Landing Pages Row */}
            <div className="ad-insights-row">
              <div className="ad-insight-panel">
                <div className="ad-insight-title">Top Performing Hooks</div>
                <div className="ad-hooks-list">
                  {(brand.advertising.topHooks || []).map((h, i) => (
                    <div className="ad-hook-item" key={i}>
                      <div className="ad-hook-rank">#{i + 1}</div>
                      <div className="ad-hook-body">
                        <div className="ad-hook-text">"{h.hook}"</div>
                        <div className="ad-hook-stats">
                          <span>{h.impressions} impr</span>
                          <span className="ad-hook-ctr">{h.ctr} CTR</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="ad-insight-panel">
                <div className="ad-insight-title">Top Landing Pages</div>
                <div className="ad-lp-list">
                  {(brand.advertising.topLandingPages || []).map((lp, i) => (
                    <div className="ad-lp-item" key={i}>
                      <div className="ad-lp-rank">#{i + 1}</div>
                      <div className="ad-lp-body">
                        <div className="ad-lp-url">{lp.url}</div>
                        <div className="ad-lp-stats">
                          <span>{lp.visits} visits</span>
                          <span className="ad-lp-conv">{lp.convRate} conv</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Part 2: Top Winning Ads (Foreplay-style content-first) ── */}
          <div className="ad-winners-header">
            <div className="bp-card-title" style={{ padding: 0 }}>Top Winning Ads</div>
            <span className="ad-winners-count">{brand.metaAds?.length || 0} creatives</span>
          </div>
          <div className="ad-winners-grid">
            {(brand.metaAds || []).slice(0, 4).map((ad, i) => (
              <div className="ad-winner" key={i}>
                {/* Header bar */}
                <div className="ad-winner-bar">
                  <div className="ad-winner-bar-left">
                    <div className="ad-winner-av" style={{ background: brand.brandColor }}>{brand.logo}</div>
                    <span className="ad-winner-brand-name">{brand.name}</span>
                  </div>
                  <div className="ad-winner-bar-right">
                    <span className={`bp-ad-status ${ad.status}`}>{ad.status}</span>
                    <span className="ad-winner-days">{ad.daysRunning}D</span>
                  </div>
                </div>
                {/* Visual — content-first, tall aspect ratio */}
                <div className="ad-winner-creative" style={{ background: ad.color || brand.brandColor }}>
                  {(ad.format === "Video" || ad.format === "UGC") && (
                    <div className="ad-winner-play">▶</div>
                  )}
                  {ad.format === "Carousel" && (
                    <div className="ad-winner-carousel-nav">
                      <span className="ad-winner-arrow">‹</span>
                      <span className="ad-winner-arrow">›</span>
                    </div>
                  )}
                  {/* Hook text overlay */}
                  <div className="ad-winner-hook-overlay">
                    <span>{ad.hook || ad.headline}</span>
                  </div>
                  {/* Format pill */}
                  <div className="ad-winner-format-pill">{ad.format}</div>
                </div>
                {/* Footer */}
                <div className="ad-winner-foot">
                  <span className="ad-winner-impr">{ad.impressions} impr</span>
                  {ad.ctr && <span className="ad-winner-ctr">{ad.ctr} CTR</span>}
                </div>
              </div>
            ))}
          </div>
        </>) : (
          <div style={{ padding: 40, textAlign: "center", color: "var(--ink4)", fontSize: 13, border: "1px solid var(--bd)", borderRadius: 14 }}>No active Meta ads detected</div>
        )}

        <div id="bp-sec-products" />
        {/* ─── SECTION: Products ─── */}
        <div className="bp-section-divider">
          <span className="bp-section-label">Products</span>
        </div>
        {/* Pricing Overview */}
        <div className="bp-row bp-row-2" style={{ marginBottom: 16 }}>
          <div className="bp-card">
            <div className="bp-card-title">Pricing Architecture</div>
            <div className="bp-pricing-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              <div><span className="dc3-sv">{brand.pricing?.skuCount || "—"}</span><span className="dc3-sl">Total SKUs</span></div>
              <div><span className="dc3-sv">{brand.pricing?.priceRange || "—"}</span><span className="dc3-sl">Price Range</span></div>
              <div><span className="dc3-sv">${brand.pricing?.avgPrice || "—"}</span><span className="dc3-sl">Avg Price</span></div>
              <div><span className="dc3-sv">{brand.pricing?.hasSubscription ? "Yes" : "No"}</span><span className="dc3-sl">Subscription</span></div>
            </div>
            {brand.pricing?.hasSubscription && brand.pricing?.subDiscount && (
              <div style={{ marginTop: 12, padding: "8px 10px", background: "var(--gl)", fontSize: 12, color: "var(--g)", fontWeight: 500, textAlign: "center" }}>
                Subscription discount: {brand.pricing.subDiscount}
              </div>
            )}
          </div>
          <div className="bp-card">
            <div className="bp-card-title">Production & Supply</div>
            <div className="bp-pricing-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div><span className="dc3-sv">{brand.production?.location || brand.hq.split(",").pop().trim()}</span><span className="dc3-sl">Manufacturing</span></div>
              <div><span className="dc3-sv">{brand.production?.type || "Contract"}</span><span className="dc3-sl">Type</span></div>
              <div><span className="dc3-sv">{brand.production?.certifications || "—"}</span><span className="dc3-sl">Certifications</span></div>
              <div><span className="dc3-sv">{brand.techStack?.[0] || "—"}</span><span className="dc3-sl">Platform</span></div>
            </div>
          </div>
        </div>

        {/* Best Sellers — Detailed Product Cards */}
        <div className="bp-card" style={{ marginBottom: 16 }}>
          <div className="bp-card-title">Best Selling Products</div>
          <div className="bp-prod-detail-grid">
            {(brand.bestSellers || []).map((p, i) => (
              <div className="bp-prod-detail" key={i}>
                <div className="bp-prod-detail-hdr" style={{ background: p.color || brand.brandColor }}>
                  <span className="bp-prod-detail-icon">{p.icon || "📦"}</span>
                  <span className="bp-prod-detail-rank">#{i + 1}</span>
                </div>
                <div className="bp-prod-detail-body">
                  <div className="bp-prod-detail-name">{p.name}</div>
                  <div className="bp-prod-detail-cat">{p.category}</div>
                  <div className="bp-prod-detail-price">{p.price}</div>
                  <div className="bp-prod-detail-meta">
                    {brand.amazon?.products?.[i] && (
                      <>
                        <div className="bp-prod-meta-row">
                          <span className="bp-prod-meta-label">Amazon BSR</span>
                          <span className="bp-prod-meta-val">#{brand.amazon.products[i].bsr.toLocaleString()}</span>
                        </div>
                        <div className="bp-prod-meta-row">
                          <span className="bp-prod-meta-label">Rating</span>
                          <span className="bp-prod-meta-val">{brand.amazon.products[i].rating}/5 ({brand.amazon.products[i].reviews} reviews)</span>
                        </div>
                      </>
                    )}
                    <div className="bp-prod-meta-row">
                      <span className="bp-prod-meta-label">Made in</span>
                      <span className="bp-prod-meta-val">{p.madeIn || brand.production?.location || brand.hq.split(",").pop().trim()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="bp-sec-social" />
        {/* ─── SECTION: Social Media Presence ─── */}
        <div className="bp-section-divider">
          <span className="bp-section-label">Social Media Presence</span>
        </div>

        {/* Platform Velocity */}
        <div className="bp-row bp-row-2" style={{ marginBottom: 16 }}>
          {Object.entries(brand.socialVelocity || {}).map(([platform, data]) => (
            <div className="bp-card" key={platform}>
              <div className="bp-card-title">{platform} Performance</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div><span className="dc3-sv" style={{ fontSize: 20 }}>{brand.socialFollowing?.[platform] || "—"}</span><span className="dc3-sl">Followers</span></div>
                <div><span className="dc3-sv">{data.postsPerWeek}/wk</span><span className="dc3-sl">Post Frequency</span></div>
                <div><span className="dc3-sv">{data.engagementRate}%</span><span className="dc3-sl">Engagement Rate</span></div>
              </div>
              <AnalyticalChart
                series={[{ name: "Followers", data: data.followerTrend, color: brand.brandColor }]}
                yLabel={platform === "instagram" ? "Followers (K)" : "Followers (K)"} height={140}
                formatValue={v => `${v}K`}
              />
            </div>
          ))}
        </div>

        {/* Latest Posts */}
        {brand.socialPosts && (
          <>
            {brand.socialPosts.instagram && (
              <div style={{ marginBottom: 16 }}>
                <div className="bp-card-title" style={{ padding: "0 0 12px" }}>Latest Instagram Posts</div>
                <div className="bp-post-grid">
                  {brand.socialPosts.instagram.map((post, i) => (
                    <div className="bp-post" key={i}>
                      <div className="bp-post-img" style={{ background: post.color || brand.brandColor }}>
                        <span className="bp-post-type">{post.type === "reel" ? "Reel" : post.type === "carousel" ? "Carousel" : "Post"}</span>
                        <span className="bp-post-icon">{post.icon || "📷"}</span>
                      </div>
                      <div className="bp-post-body">
                        <p className="bp-post-caption">{post.caption.length > 80 ? post.caption.slice(0, 80) + "…" : post.caption}</p>
                        <div className="bp-post-metrics">
                          <span>♡ {post.likes >= 1000 ? (post.likes / 1000).toFixed(1) + "K" : post.likes}</span>
                          <span>💬 {post.comments}</span>
                          <span>{post.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {brand.socialPosts.tiktok && (
              <div style={{ marginBottom: 16 }}>
                <div className="bp-card-title" style={{ padding: "0 0 12px" }}>Latest TikTok Posts</div>
                <div className="bp-post-grid">
                  {brand.socialPosts.tiktok.map((post, i) => (
                    <div className="bp-post" key={i}>
                      <div className="bp-post-img bp-post-tiktok" style={{ background: post.color || "#0d0d0b" }}>
                        <span className="bp-post-type">Video</span>
                        <span className="bp-post-icon">{post.icon || "🎬"}</span>
                      </div>
                      <div className="bp-post-body">
                        <p className="bp-post-caption">{post.caption.length > 80 ? post.caption.slice(0, 80) + "…" : post.caption}</p>
                        <div className="bp-post-metrics">
                          <span>♡ {post.likes >= 1000 ? (post.likes / 1000).toFixed(1) + "K" : post.likes}</span>
                          <span>💬 {post.comments}</span>
                          <span>{post.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div id="bp-sec-seo" />
        {/* ─── SECTION: SEO, Keywords & Search ─── */}
        {brand.keywords && brand.keywords.length > 0 && (
          <>
            <div className="bp-section-divider">
              <span className="bp-section-label">SEO, Keywords & Search</span>
            </div>

            {/* Keyword trend chart + table — side by side */}
            <div className="bp-row bp-row-2" style={{ marginBottom: 16 }}>
            <div className="bp-card">
              <div className="bp-card-title">Keyword Volume Trends</div>
              <AnalyticalChart
                series={brand.keywords.slice(0, 3).map(k => ({
                  name: k.keyword, data: k.trend, color: k.position <= 3 ? "var(--g)" : k.position <= 10 ? "var(--a)" : "var(--r)",
                }))}
                yLabel="Monthly searches" height={160} showMinMax={false}
                formatValue={v => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v}
              />
            </div>
            <div className="bp-card">
              <div className="bp-card-title">Top Keywords</div>
              <div className="bp-kw-table">
                <div className="bp-kw-header">
                  <span className="bp-kw-cell bp-kw-keyword">Keyword</span>
                  <span className="bp-kw-cell bp-kw-vol">Volume</span>
                  <span className="bp-kw-cell bp-kw-cpc">CPC</span>
                  <span className="bp-kw-cell bp-kw-comp">Competition</span>
                  <span className="bp-kw-cell bp-kw-pos">Position</span>
                  <span className="bp-kw-cell bp-kw-trend">12mo Trend</span>
                </div>
                {brand.keywords.map((k, i) => (
                  <div className="bp-kw-row" key={i}>
                    <span className="bp-kw-cell bp-kw-keyword">{k.keyword}</span>
                    <span className="bp-kw-cell bp-kw-vol">{k.volume.toLocaleString()}</span>
                    <span className="bp-kw-cell bp-kw-cpc">${k.cpc.toFixed(2)}</span>
                    <span className="bp-kw-cell bp-kw-comp">
                      <span className={`bp-kw-comp-badge ${k.competition}`}>{k.competition}</span>
                    </span>
                    <span className="bp-kw-cell bp-kw-pos">
                      <span className={`bp-kw-pos-badge ${k.position <= 3 ? "top3" : k.position <= 10 ? "top10" : k.position <= 20 ? "top20" : "low"}`}>#{k.position}</span>
                    </span>
                    <span className="bp-kw-cell bp-kw-trend">
                      <Sparkline data={k.trend} color={k.trend[0] < k.trend[11] ? "var(--g)" : "var(--r)"} w={60} h={18} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
            </div>

            {/* SEO metrics */}
            <div className="bp-row bp-row-2" style={{ marginBottom: 16 }}>
              <div className="bp-card">
                <div className="bp-card-title">Organic Keyword Rankings (12mo)</div>
                <AnalyticalChart
                  series={[{ name: "Organic Keywords", data: brand.seoHealth?.keywordTrend || [], color: brand.seoHealth?.keywordTrend?.[0] > brand.seoHealth?.keywordTrend?.[11] ? "var(--r)" : "var(--g)" }]}
                  yLabel="Keywords" height={160}
                  formatValue={v => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v}
                />
              </div>
              <div className="bp-card">
                <div className="bp-card-title">SEO Overview</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div><span className="dc3-sv" style={{ fontSize: 28 }}>{brand.seoHealth?.domainAuthority || "—"}</span><span className="dc3-sl">Domain Authority</span></div>
                  <div><span className="dc3-sv" style={{ fontSize: 28 }}>{brand.seoHealth?.organicKeywords?.toLocaleString() || "—"}</span><span className="dc3-sl">Organic Keywords</span></div>
                </div>
                <ComparisonBars items={[
                  { label: "Top 3 positions", value: brand.keywords.filter(k => k.position <= 3).length, displayValue: String(brand.keywords.filter(k => k.position <= 3).length), color: "var(--g)" },
                  { label: "Top 10 positions", value: brand.keywords.filter(k => k.position <= 10).length, displayValue: String(brand.keywords.filter(k => k.position <= 10).length), color: "var(--a)" },
                  { label: "Page 1 (top 20)", value: brand.keywords.filter(k => k.position <= 20).length, displayValue: String(brand.keywords.filter(k => k.position <= 20).length), color: "var(--b)" },
                ]} maxValue={brand.keywords.length} />
              </div>
            </div>

            <div className="bp-card" style={{ marginBottom: 16 }}>
              <div className="bp-card-title">AI Engine Optimization (AEO)</div>
              <p style={{ fontSize: 13, color: "var(--ink3)", fontWeight: 300, lineHeight: 1.6, marginBottom: 16 }}>
                How this brand appears in AI-generated answers (ChatGPT, Perplexity, Google AI Overviews).
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", background: "var(--bd)", border: "1px solid var(--bd)", marginBottom: 16 }}>
                <div style={{ background: "var(--w)", padding: "10px", textAlign: "center" }}>
                  <span className="dc3-sv">{brand.aeo?.mentionRate || "Low"}</span>
                  <span className="dc3-sl">AI Mention Rate</span>
                </div>
                <div style={{ background: "var(--w)", padding: "10px", textAlign: "center" }}>
                  <span className="dc3-sv">{brand.aeo?.sentimentInAI || "Neutral"}</span>
                  <span className="dc3-sl">AI Sentiment</span>
                </div>
                <div style={{ background: "var(--w)", padding: "10px", textAlign: "center" }}>
                  <span className="dc3-sv">{brand.aeo?.recommendRate || "—"}</span>
                  <span className="dc3-sl">AI Recommend Rate</span>
                </div>
                <div style={{ background: "var(--w)", padding: "10px", textAlign: "center" }}>
                  <span className="dc3-sv">{brand.aeo?.competitorMentions || "—"}</span>
                  <span className="dc3-sl">vs Competitors</span>
                </div>
              </div>
              <div style={{ padding: "10px", background: "var(--off)", border: "1px solid var(--bd)", fontSize: 12, color: "var(--ink3)", fontWeight: 300, lineHeight: 1.5 }}>
                <strong style={{ color: "var(--ink)", fontWeight: 600 }}>AI Overview:</strong> When users ask AI assistants about {brand.category.toLowerCase()}, {brand.name} is {brand.aeo?.summary || "not consistently mentioned. Opportunity to improve AI visibility through structured content, FAQ optimization, and authoritative backlinks."}
              </div>
            </div>
          </>
        )}

        {/* ─── SECTION: Retailers & Marketplaces ─── */}
        {brand.retailers && brand.retailers.length > 0 && (
          <>
            <div className="bp-section-divider">
              <span className="bp-section-label">Retailers & Marketplaces</span>
            </div>
            <div className="bp-card" style={{ marginBottom: 16 }}>
              <div className="bp-card-title">Distribution Channels</div>
              <div className="bp-retail-grid">
                {brand.retailers.map((r, i) => (
                  <div className={`bp-retail-card ${r.status}`} key={i}>
                    <div className="bp-retail-top">
                      <div className="bp-retail-icon">
                        {r.type === "DTC" ? "🌐" : r.type === "Marketplace" ? "🛒" : r.type === "Luxury Marketplace" ? "💎" : r.type === "Own Retail" ? "🏪" : "🏬"}
                      </div>
                      <div className="bp-retail-info">
                        <div className="bp-retail-name">{r.name}</div>
                        <div className="bp-retail-type">{r.type}</div>
                      </div>
                      <span className={`bp-retail-status ${r.status}`}>{r.status}</span>
                    </div>
                    <div className="bp-retail-note">{r.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ─── SECTION: Amazon & Marketplace Intelligence ─── */}
        {brand.amazon && brand.amazon.products?.length > 0 && (
          <>
            <div className="bp-section-divider">
              <span className="bp-section-label">Amazon & Marketplace Intelligence</span>
            </div>

            <div className="bp-card" style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div className="bp-card-title" style={{ marginBottom: 0 }}>Amazon Product Tracking</div>
                <span className={`tag ${brand.amazon.isOfficial ? "tg" : "ta"}`}>{brand.amazon.isOfficial ? "Official Seller" : "Unauthorized Resellers"}</span>
              </div>
              {brand.amazon.note && <p style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 16, fontWeight: 400 }}>{brand.amazon.note}</p>}

              <div className="bp-amazon-grid">
                {brand.amazon.products.map((p, i) => (
                  <div className="bp-amazon-card" key={i}>
                    <div className="bp-amz-header">
                      <div className="bp-amz-rank">#{p.bsr}</div>
                      <div className="bp-amz-category">{p.bsrCategory}</div>
                    </div>
                    <div className="bp-amz-name">{p.name}</div>
                    <div className="bp-amz-chart">
                      <AnalyticalChart
                        series={[{ name: "BSR", data: p.bsrTrend, color: p.bsrTrend[0] < p.bsrTrend[11] ? "var(--r)" : "var(--g)" }]}
                        yLabel="BSR Rank" height={120} showDots={false} showArea={true}
                        formatValue={v => `#${v.toLocaleString()}`}
                      />
                      <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink4)", textAlign: "center", marginTop: 4 }}>
                        {p.bsrTrend[0] < p.bsrTrend[11] ? "↑ BSR rising = declining sales" : "↓ BSR falling = increasing sales"}
                      </div>
                    </div>
                    <div className="bp-amz-stats">
                      <div><span className="dc3-sv">{p.price}</span><span className="dc3-sl">Price</span></div>
                      <div><span className="dc3-sv">{p.rating}/5</span><span className="dc3-sl">Rating</span></div>
                      <div><span className="dc3-sv">{p.reviews.toLocaleString()}</span><span className="dc3-sl">Reviews</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div id="bp-sec-competition" />
        {/* ─── SECTION: Competitive Analysis ─── */}
        {brand.competitors?.length > 0 && brand.competitors[0].traffic && (
          <>
            <div className="bp-section-divider">
              <span className="bp-section-label">Competitive Analysis</span>
            </div>

            {/* Traffic Comparison + Head-to-Head — side by side */}
            <div className="bp-row bp-row-2" style={{ marginBottom: 16 }}>
            <div className="bp-card">
              <div className="bp-card-title">Web Traffic Comparison</div>
              <AnalyticalChart
                series={[
                  { name: brand.name, data: brand.trafficTrend || [], color: brand.brandColor },
                  ...brand.competitors.filter(c => c.trafficTrend).map((c, i) => ({
                    name: c.name.length > 20 ? c.name.slice(0, 18) + "…" : c.name,
                    data: c.trafficTrend,
                    color: ["#2563eb", "#059669", "#d97706"][i] || "var(--ink3)",
                  })),
                ]}
                yLabel="Monthly Visits (K)" height={160}
                formatValue={v => `${v}K`}
              />
            </div>
            <div className="bp-card">
              <div className="bp-card-title">Head-to-Head Comparison</div>
              <div className="bp-comp-table">
                <div className="bp-comp-header">
                  <div className="bp-comp-metric-col">Metric</div>
                  <div className="bp-comp-brand-col" style={{ color: brand.brandColor, fontWeight: 700 }}>{brand.name}</div>
                  {brand.competitors.map((c, i) => (
                    <div className="bp-comp-brand-col" key={i}>{c.name.length > 16 ? c.name.slice(0, 14) + "…" : c.name}</div>
                  ))}
                </div>

                {[
                  { label: "Monthly Traffic", brandVal: `${brand.trafficTrend?.[brand.trafficTrend.length - 1]}K`, compVals: brand.competitors.map(c => `${c.traffic}K`) },
                  { label: "Instagram", brandVal: brand.socialFollowing?.instagram || "—", compVals: brand.competitors.map(c => c.instagram || "—") },
                  { label: "TikTok", brandVal: brand.socialFollowing?.tiktok || "—", compVals: brand.competitors.map(c => c.tiktok || "—") },
                  { label: "Trustpilot", brandVal: `${brand.customerVoice?.trustpilotRating || "—"}/5`, compVals: brand.competitors.map(c => c.trustpilot ? `${c.trustpilot}/5` : "—") },
                  { label: "Reviews", brandVal: brand.customerVoice?.reviewCount?.toLocaleString() || "—", compVals: brand.competitors.map(c => c.reviews?.toLocaleString() || "—") },
                  { label: "Team Size", brandVal: String(brand.employees), compVals: brand.competitors.map(c => c.employees ? String(c.employees) : "—") },
                  { label: "Active Meta Ads", brandVal: String(brand.metaAds?.length || 0), compVals: brand.competitors.map(c => c.metaAds ? String(c.metaAds) : "—") },
                  { label: "Domain Authority", brandVal: String(brand.seoHealth?.domainAuthority || "—"), compVals: brand.competitors.map(c => c.domainAuthority ? String(c.domainAuthority) : "—") },
                ].map((row, ri) => (
                  <div className="bp-comp-row" key={ri}>
                    <div className="bp-comp-metric-col">{row.label}</div>
                    <div className="bp-comp-brand-col bp-comp-highlight">{row.brandVal}</div>
                    {row.compVals.map((v, ci) => (
                      <div className="bp-comp-brand-col" key={ci}>{v}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            </div>

            <div className="bp-row bp-row-2" style={{ marginBottom: 16 }}>
              <div className="bp-card">
                <div className="bp-card-title">Why People Buy {brand.name}</div>
                <p style={{ fontSize: 13, color: "var(--ink3)", fontWeight: 300, lineHeight: 1.6, marginBottom: 12 }}>
                  {brand.differentiator || `${brand.name} differentiates through ${brand.whatTheyBuilt?.[0]?.toLowerCase() || "unique brand positioning"}.`}
                </p>
                <div className="bp-card-title" style={{ fontSize: 11, marginTop: 12 }}>Key Differentiators</div>
                {(brand.whatTheyBuilt || []).map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, padding: "8px 0", borderBottom: "1px solid var(--bd)", fontSize: 12, alignItems: "flex-start" }}>
                    <span style={{ color: "var(--g)", fontFamily: "var(--mono)", flexShrink: 0 }}>✓</span>
                    <span style={{ color: "var(--ink2)", fontWeight: 300 }}>{item}</span>
                  </div>
                ))}
              </div>
              <div className="bp-card">
                <div className="bp-card-title">Product Pricing Comparison</div>
                {brand.competitors?.filter(c => c.price || c.heroPrice).length > 0 ? (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--bd)", fontSize: 11, fontFamily: "var(--mono)", color: "var(--ink4)", textTransform: "uppercase", letterSpacing: ".06em" }}>
                      <span>Brand</span><span>Hero Price</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--bd)" }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: brand.brandColor }}>{brand.name}</span>
                      <span style={{ fontFamily: "var(--mono)", fontWeight: 700, fontSize: 14 }}>{brand.bestSellers?.[0]?.price || "—"}</span>
                    </div>
                    {brand.competitors?.map((c, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--bd)" }}>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{c.name}</span>
                        <span style={{ fontFamily: "var(--mono)", fontSize: 14, color: "var(--ink3)" }}>{c.heroPrice || c.price || "—"}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: 12, color: "var(--ink4)", fontWeight: 300 }}>Competitor pricing data not available.</p>
                )}
              </div>
            </div>

            {/* Competitor Summaries */}
            <div className="bp-row bp-row-3" style={{ marginBottom: 16 }}>
              {brand.competitors.map((c, i) => (
                <div className="bp-card" key={i}>
                  <div className="bp-card-title">{c.name}</div>
                  <div style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 12 }}>{c.strength}</div>
                  {c.trafficTrend && (
                    <div style={{ marginBottom: 10 }}>
                      <Sparkline data={c.trafficTrend} color={["#2563eb", "#059669", "#d97706"][i]} w={180} h={30} />
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div><span className="dc3-sv" style={{ fontSize: 14 }}>{c.traffic}K</span><span className="dc3-sl">Traffic</span></div>
                    <div><span className="dc3-sv" style={{ fontSize: 14 }}>{c.instagram}</span><span className="dc3-sl">Instagram</span></div>
                    <div><span className="dc3-sv" style={{ fontSize: 14 }}>{c.trustpilot}/5</span><span className="dc3-sl">Trustpilot</span></div>
                    <div><span className="dc3-sv" style={{ fontSize: 14 }}>{c.metaAds}</span><span className="dc3-sl">Meta Ads</span></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div id="bp-sec-hiring" />
        {/* ─── SECTION: Hiring & Team Intelligence ─── */}
        {brand.hiring?.departments && (
          <>
            <div className="bp-section-divider">
              <span className="bp-section-label">Hiring & Team Intelligence</span>
            </div>

            <div className="bp-row bp-row-3" style={{ marginBottom: 16 }}>
              {/* Department Breakdown */}
              <div className="bp-card">
                <div className="bp-card-title">Open Roles by Department</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span className="dc3-sv" style={{ fontSize: 28, color: brand.hiring.openRoles > 0 ? "var(--g)" : "var(--r)" }}>{brand.hiring.openRoles}</span>
                  <span className="dc3-sl">Total Open Roles</span>
                </div>
                <ComparisonBars items={brand.hiring.departments.map(d => ({
                  label: d.name,
                  value: d.roles,
                  displayValue: `${d.roles} ${d.change !== 0 ? `(${d.change > 0 ? "+" : ""}${d.change})` : ""}`,
                  color: d.change > 0 ? "var(--g)" : d.change < 0 ? "var(--r)" : "var(--ink3)",
                }))} />
                <div style={{ marginTop: 14 }}>
                  <BarChart bars={brand.hiring.trend.map((v, i) => ({
                    label: ["J","F","M","A","M","J","J","A","S","O","N","D"][i], value: v,
                    color: v > 0 ? "var(--b)" : "var(--bd)",
                  }))} h={70} barWidth={16} gap={3} />
                </div>
              </div>

              {/* Key Departures */}
              <div className="bp-card">
                <div className="bp-card-title">Key Departures</div>
                {brand.hiring.recentDepartures?.map((d, i) => (
                  <div className="bp-departure" key={i}>
                    <div className="bp-dep-dot" style={{ background: d.signal === "red" ? "var(--r)" : "var(--a)" }} />
                    <div className="bp-dep-info">
                      <div className="bp-dep-role">{d.role}</div>
                      <div className="bp-dep-meta">{d.seniority} · {d.date}</div>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 16, padding: "12px 0", borderTop: "1px solid var(--bd)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div><span className="dc3-sv">{brand.hiring.avgTenure}</span><span className="dc3-sl">Avg Tenure</span></div>
                    <div><span className="dc3-sv" style={{ color: brand.hiring.tenureChange?.startsWith("-") ? "var(--r)" : "var(--g)" }}>{brand.hiring.tenureChange}</span><span className="dc3-sl">Tenure Change</span></div>
                  </div>
                </div>
              </div>

              {/* Glassdoor / Team Health */}
              {brand.hiring.glassdoor && (
                <div className="bp-card">
                  <div className="bp-card-title">Team Health (Glassdoor)</div>
                  <div className="bp-glassdoor">
                    <div className="bp-gd-item">
                      <div className="bp-gd-score" style={{ color: brand.hiring.glassdoor.rating >= 3.5 ? "var(--g)" : brand.hiring.glassdoor.rating >= 3.0 ? "var(--a)" : "var(--r)" }}>
                        {brand.hiring.glassdoor.rating}
                      </div>
                      <div className="bp-gd-label">Company Rating</div>
                      <div className="bp-gd-scale">/5.0</div>
                    </div>
                    <div className="bp-gd-item">
                      <div className="bp-gd-score" style={{ color: brand.hiring.glassdoor.ceoApproval >= 60 ? "var(--g)" : brand.hiring.glassdoor.ceoApproval >= 40 ? "var(--a)" : "var(--r)" }}>
                        {brand.hiring.glassdoor.ceoApproval}%
                      </div>
                      <div className="bp-gd-label">CEO Approval</div>
                    </div>
                    <div className="bp-gd-item">
                      <div className="bp-gd-score" style={{ color: brand.hiring.glassdoor.recommend >= 60 ? "var(--g)" : brand.hiring.glassdoor.recommend >= 40 ? "var(--a)" : "var(--r)" }}>
                        {brand.hiring.glassdoor.recommend}%
                      </div>
                      <div className="bp-gd-label">Would Recommend</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div id="bp-sec-ma" />
        {/* ─── SECTION: M&A Comparables ─── */}
        {brand.maComps && (
          <>
            <div className="bp-section-divider">
              <span className="bp-section-label">M&A Comparables</span>
            </div>
            <div className="bp-card" style={{ marginBottom: 16 }}>
              <div className="bp-card-title">Recent Comparable Transactions</div>
              <div className="bp-comp-table">
                <div className="bp-comp-header">
                  <div className="bp-comp-metric-col" style={{ width: 260 }}>Transaction</div>
                  <div className="bp-comp-brand-col">Year</div>
                  <div className="bp-comp-brand-col">Multiple</div>
                  <div className="bp-comp-brand-col">Deal Size</div>
                </div>
                {brand.maComps.map((m, i) => (
                  <div className="bp-comp-row" key={i}>
                    <div className="bp-comp-metric-col" style={{ width: 260 }}>
                      <div style={{ fontWeight: 600 }}>{m.name}</div>
                      <div style={{ fontSize: 11, color: "var(--ink4)", marginTop: 2 }}>{m.note}</div>
                    </div>
                    <div className="bp-comp-brand-col">{m.date}</div>
                    <div className="bp-comp-brand-col" style={{ fontWeight: 700, color: "var(--ink)" }}>{m.multiple}</div>
                    <div className="bp-comp-brand-col">{m.dealSize}</div>
                  </div>
                ))}
              </div>
              {brand.categoryMaActivity && (
                <p style={{ fontSize: 12, color: "var(--ink3)", fontWeight: 400, lineHeight: 1.6, marginTop: 14, padding: "12px 0 0", borderTop: "1px solid var(--bd)" }}>{brand.categoryMaActivity}</p>
              )}
            </div>
          </>
        )}

        <div id="bp-sec-pricing" />
        {/* ─── SECTION: Pricing Power ─── */}
        {brand.pricingAnalysis && (
          <>
            <div className="bp-section-divider">
              <span className="bp-section-label">Pricing Power</span>
            </div>
            <div className="bp-row bp-row-3" style={{ marginBottom: 16 }}>
              <div className="bp-card">
                <div className="bp-card-title">Price History</div>
                <div style={{ marginBottom: 16 }}>
                  <span className="dc3-sv" style={{ fontSize: 24 }}>{brand.pricingAnalysis.currentAOV}</span>
                  <span className="dc3-sl">Current AOV</span>
                </div>
                {brand.pricingAnalysis.priceHistory?.map((p, i) => (
                  <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid var(--bd)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 14, fontWeight: 700 }}>{p.heroPrice}</div>
                      <div style={{ fontSize: 10, color: "var(--ink4)" }}>{p.note}</div>
                    </div>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink4)" }}>{p.date}</span>
                  </div>
                ))}
              </div>
              <div className="bp-card">
                <div className="bp-card-title">Price vs Competitors</div>
                {brand.pricingAnalysis.priceVsCompetitors?.map((c, i) => (
                  <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid var(--bd)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{c.competitor}</span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 14, fontWeight: 700 }}>{c.price}</span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--ink4)" }}>{c.positioning}</div>
                  </div>
                ))}
              </div>
              <div className="bp-card">
                <div className="bp-card-title">Discount & Promo Analysis</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ padding: "10px", background: "var(--off)", borderRadius: 6, border: "1px solid var(--bd)" }}>
                    <div className="dc3-sl" style={{ marginBottom: 4 }}>Discount Frequency</div>
                    <p style={{ fontSize: 12, color: "var(--ink2)", fontWeight: 400, lineHeight: 1.5 }}>{brand.pricingAnalysis.discountFrequency}</p>
                  </div>
                  <div style={{ padding: "10px", background: "var(--off)", borderRadius: 6, border: "1px solid var(--bd)" }}>
                    <div className="dc3-sl" style={{ marginBottom: 4 }}>Promo Code Proliferation</div>
                    <p style={{ fontSize: 12, color: "var(--ink2)", fontWeight: 400, lineHeight: 1.5 }}>{brand.pricingAnalysis.promoCodeProliferation}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ─── SECTION: Financial Data ─── */}
        <div id="bp-sec-financial" />
        {(brand.verifiedRevenue || brand.financials) && (
          <>
            <div className="bp-section-divider">
              <span className="bp-section-label">Financial Data</span>
            </div>
            <div className="bp-row bp-row-2" style={{ marginBottom: 16 }}>
              <div className="bp-card">
                <div className="bp-card-title">Revenue & Growth</div>
                <div className="bp-pricing-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <div><span className="dc3-sv" style={{ fontSize: 24, color: brand.verifiedRevenue ? "var(--g)" : "var(--ink)" }}>{brand.verifiedRevenue || brand.financials?.estimatedRevenue || "Not disclosed"}</span><span className="dc3-sl">{brand.verifiedRevenue ? "Verified Revenue ✓" : "Est. Revenue"}</span></div>
                  <div><span className="dc3-sv" style={{ fontSize: 24 }}>{brand.financials?.revenueGrowth || "—"}</span><span className="dc3-sl">YoY Growth</span></div>
                  <div><span className="dc3-sv">{brand.financials?.grossMargin || "—"}</span><span className="dc3-sl">Est. Gross Margin</span></div>
                  <div><span className="dc3-sv">{brand.financials?.burnRate || "—"}</span><span className="dc3-sl">Burn Indicator</span></div>
                </div>
              </div>
              <div className="bp-card">
                <div className="bp-card-title">Funding & Valuation</div>
                <div className="bp-pricing-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <div><span className="dc3-sv">{brand.financials?.totalFunding || "—"}</span><span className="dc3-sl">Total Funding</span></div>
                  <div><span className="dc3-sv">{brand.financials?.lastRound || "—"}</span><span className="dc3-sl">Last Round</span></div>
                  <div><span className="dc3-sv">{brand.financials?.valuation || "—"}</span><span className="dc3-sl">Last Valuation</span></div>
                  <div><span className="dc3-sv">{brand.financials?.investors || "—"}</span><span className="dc3-sl">Key Investors</span></div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ─── SECTION: Channel Dependency ─── */}
        {brand.channelDependency && (
          <>
            <div className="bp-section-divider">
              <span className="bp-section-label">Channel Dependency & Risk</span>
            </div>
            <div className="bp-row bp-row-2" style={{ marginBottom: 16 }}>
              <div className="bp-card">
                <div className="bp-card-title">Revenue Channel Breakdown</div>
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
                  <DonutChart segments={brand.channelDependency.breakdown.map(c => ({
                    value: c.pct, color: c.risk === "low" ? "var(--g)" : c.risk === "medium" ? "var(--a)" : "var(--r)",
                  }))} size={90} strokeWidth={12} />
                  <div style={{ flex: 1 }}>
                    {brand.channelDependency.breakdown.map((c, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--bd)" }}>
                        <div>
                          <span style={{ fontWeight: 500, fontSize: 13 }}>{c.channel}</span>
                          <span className={`tag ${c.risk === "low" ? "tg" : c.risk === "medium" ? "ta" : "tr"}`} style={{ marginLeft: 8 }}>{c.risk} risk</span>
                        </div>
                        <span style={{ fontFamily: "var(--mono)", fontWeight: 700, fontSize: 14 }}>{c.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bp-card">
                <div className="bp-card-title">Platform Risk Assessment</div>
                <div style={{ marginBottom: 12 }}>
                  <span className="dc3-sv" style={{ fontSize: 14 }}>{brand.channelDependency.primaryChannel}</span>
                  <span className="dc3-sl">Primary Channel</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--ink2)", fontWeight: 400, lineHeight: 1.6, padding: "12px", background: "var(--off)", borderRadius: 6, border: "1px solid var(--bd)" }}>
                  {brand.channelDependency.platformRisk}
                </p>
                {brand.channelDependency.breakdown.map((c, i) => c.note && (
                  <div key={i} style={{ fontSize: 11, color: "var(--ink4)", padding: "6px 0", borderBottom: "1px solid var(--bd)" }}>
                    <span style={{ fontWeight: 600, color: "var(--ink3)" }}>{c.channel}:</span> {c.note}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ─── SECTION: Press & Media Coverage ─── */}
        {brand.pressCoverage && (
          <>
            <div className="bp-section-divider">
              <span className="bp-section-label">Press & Media Coverage</span>
            </div>
            <div className="bp-row bp-row-2" style={{ marginBottom: 16 }}>
              <div className="bp-card">
                <div className="bp-card-title">Recent Press Mentions</div>
                {brand.pressCoverage.map((p, i) => (
                  <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid var(--bd)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: ".04em", color: "var(--ink3)" }}>{p.outlet}</span>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span className={`tag ${p.sentiment === "positive" ? "tg" : p.sentiment === "negative" ? "tr" : "ta"}`}>{p.sentiment}</span>
                        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink4)" }}>{p.date}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{p.headline}</div>
                  </div>
                ))}
              </div>
              <div className="bp-card">
                <div className="bp-card-title">Media Mention Trend (12 months)</div>
                {brand.mediaMentionsTrend && (
                  <AnalyticalChart
                    series={[{ name: "Mentions", data: brand.mediaMentionsTrend, color: brand.mediaMentionsTrend[0] > brand.mediaMentionsTrend[11] ? "var(--r)" : "var(--g)" }]}
                    yLabel="Monthly mentions" height={180}
                  />
                )}
              </div>
            </div>
          </>
        )}

        <div id="bp-sec-sources" />
        {/* ─── SECTION: Data Sources ─── */}
        {brand.dataSources && (
          <>
            <div className="bp-section-divider">
              <span className="bp-section-label">Data Sources</span>
            </div>
            <div className="bp-card" style={{ marginBottom: 16 }}>
              <div className="bp-card-title">Where This Intelligence Comes From</div>
              <p style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 16 }}>All data on this page is sourced from publicly available information. No private or proprietary data is used.</p>
              <div className="bp-sources-grid">
                {brand.dataSources.map((ds, i) => (
                  <div className="bp-source-card" key={i}>
                    <div className="bp-source-header">
                      <span className="bp-source-icon">{ds.icon}</span>
                      <div>
                        <div className="bp-source-name">{ds.platform}</div>
                        <div className="bp-source-count">{ds.count}</div>
                      </div>
                    </div>
                    <div className="bp-source-points">
                      {ds.dataPoints.map((dp, j) => (
                        <span className="bp-source-point" key={j}>{dp}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div id="bp-sec-intel" />
        {/* ─── SECTION: Market Intelligence ─── */}
        <div className="bp-section-divider">
          <span className="bp-section-label">Market Intelligence</span>
        </div>

        {/* Brand vs Category Search Interest */}
        <div className="bp-card" style={{ marginBottom: 16 }}>
          <div className="bp-card-title">Search Interest — {brand.name} vs Category (Google Trends)</div>
          {brand.searchInterest && (
            <AnalyticalChart
              series={[
                { name: brand.name, data: brand.searchInterest, color: brand.brandColor },
                ...((() => {
                  const cats = (brand.relatedCategories || []).map(cn => IDEA_CATEGORIES.find(c => c.name === cn)).filter(Boolean);
                  return cats.slice(0, 2).map(c => ({ name: c.name, data: c.sparkData, color: c.growthRate >= 40 ? "var(--g)" : "var(--a)" }));
                })()),
              ]}
              yLabel="Relative Interest" height={160} showMinMax={false}
            />
          )}
        </div>

        {/* Related Categories */}
        {(() => {
          const cats = (brand.relatedCategories || []).map(cn => IDEA_CATEGORIES.find(c => c.name === cn)).filter(Boolean);
          if (!cats.length) return null;
          return (
            <div style={{ marginBottom: 16 }}>
              <div className="bp-card-title" style={{ padding: "0 0 12px" }}>Related Trending Categories</div>
              <div className="bp-mi-cats">
                {cats.map((cat, i) => (
                  <div className="bp-mi-cat" key={i}>
                    <div className="bp-mi-cat-top">
                      <span className="bp-mi-cat-icon">{cat.icon}</span>
                      <div className="bp-mi-cat-info">
                        <div className="bp-mi-cat-name">{cat.name}</div>
                        <div className="bp-mi-cat-meta">{cat.brandCount} brands</div>
                      </div>
                      <span className="bp-mi-cat-growth" style={{ color: cat.growthRate >= 40 ? "var(--g)" : "var(--a)" }}>+{cat.growthRate}%</span>
                    </div>
                    <AreaChart data={cat.sparkData} color={cat.growthRate >= 40 ? "var(--g)" : "var(--a)"} w={240} h={48} filled={true} />
                    <div className="bp-mi-cat-subs">
                      {cat.subcategories.slice(0, 3).map((s, j) => (
                        <span key={j} className="bp-mi-cat-sub">{s.name} <span style={{ color: s.growth >= 50 ? "var(--g)" : "var(--a)" }}>+{s.growth}%</span></span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Related Emerging Trends */}
        {(() => {
          const trends = (brand.relatedTrendKeywords || []).map(kw => MARKET_TRENDS.find(t => t.keyword === kw)).filter(Boolean);
          if (!trends.length) return null;
          return (
            <div style={{ marginBottom: 16 }}>
              <div className="bp-card-title" style={{ padding: "0 0 12px" }}>Emerging Trends in This Space</div>
              <div className="bp-mi-trends">
                {trends.map((trend, i) => (
                  <div className="bp-mi-trend" key={i}>
                    <div className="bp-mi-trend-visual" style={{ background: trend.growth >= 200 ? "var(--gl)" : "var(--al)" }}>
                      <AreaChart data={trend.sparkData} color={trend.growth >= 200 ? "var(--g)" : "var(--a)"} w={200} h={50} filled={true} />
                    </div>
                    <div className="bp-mi-trend-body">
                      <div className="bp-mi-trend-top">
                        <div>
                          {trend.isBreaking && <span className="intel-breaking" style={{ marginRight: 6 }}>Breaking</span>}
                          <span className="bp-mi-trend-kw">{trend.keyword}</span>
                        </div>
                        <span className="bp-mi-trend-growth" style={{ color: trend.growth >= 200 ? "var(--g)" : "var(--a)" }}>+{trend.growth}%</span>
                      </div>
                      <p className="bp-mi-trend-summary">{trend.summary.length > 100 ? trend.summary.slice(0, 100) + "…" : trend.summary}</p>
                      <div className="bp-mi-trend-meta">
                        <span>{trend.category}</span>
                        <span>{trend.volume >= 1000000 ? (trend.volume / 1000000).toFixed(1) + "M" : (trend.volume / 1000).toFixed(0) + "K"} searches/mo</span>
                        <span>Source: {trend.source}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Related Problems from Find Ideas */}
        {(() => {
          const catIds = (brand.relatedCategories || []).map(cn => IDEA_CATEGORIES.find(c => c.name === cn)?.id).filter(Boolean);
          const problems = COMMUNITY_SIGNALS.filter(p => catIds.includes(p.categoryId)).slice(0, 3);
          if (!problems.length) return null;
          return (
            <div className="bp-card" style={{ marginBottom: 16 }}>
              <div className="bp-card-title">Consumer Problems in This Category</div>
              {problems.map((p, i) => (
                <div key={i} style={{ padding: "12px 0", borderBottom: i < problems.length - 1 ? "1px solid var(--bd)" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{p.title}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600, color: p.growthRate >= 50 ? "var(--g)" : "var(--a)" }}>+{p.growthRate}%</span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--ink3)", fontWeight: 300, lineHeight: 1.5 }}>{p.description.length > 120 ? p.description.slice(0, 120) + "…" : p.description}</p>
                  <div style={{ marginTop: 6, fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink4)" }}>{(p.mentionCount / 1000).toFixed(1)}K mentions · {(p.searchVolume / 1000).toFixed(0)}K searches/mo</div>
                </div>
              ))}
            </div>
          );
        })()}

        <div id="bp-sec-reviews" />
        {/* ─── SECTION: Customer Intelligence ─── */}
        <div className="bp-section-divider">
          <span className="bp-section-label">Customer Intelligence</span>
        </div>

        {/* Part 1: Review Analytics */}
        <div className="bp-row bp-row-2" style={{ marginBottom: 16 }}>
          <div className="bp-card">
            <div className="bp-card-title">Review Overview</div>
            {brand.starDistribution && (
              <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 20 }}>
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 40, fontWeight: 800, color: "var(--ink)" }}>{brand.customerVoice?.trustpilotRating || "—"}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink4)" }}>/ 5.0 · {brand.customerVoice?.reviewCount?.toLocaleString()} reviews</div>
                </div>
                <div style={{ flex: 1 }}><StarDistribution distribution={brand.starDistribution} /></div>
              </div>
            )}
          </div>
          <div className="bp-card">
            <div className="bp-card-title">Review Frequency & Health</div>
            {brand.reviewTrend && (
              <div style={{ marginBottom: 16 }}>
                <div className="bp-card-subtitle">Monthly Review Volume (12mo)</div>
                <BarChart bars={brand.reviewTrend.map((v, i) => ({
                  label: ["J","F","M","A","M","J","J","A","S","O","N","D"][i], value: v,
                  color: i >= 10 ? "var(--ink)" : "var(--ink4)",
                }))} h={80} barWidth={22} gap={4} />
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, paddingTop: 12, borderTop: "1px solid var(--bd)" }}>
              <div>
                <div className="dc3-sv">{brand.customerVoice?.reviewCount?.toLocaleString() || "—"}</div>
                <div className="dc3-sl">Total Reviews</div>
              </div>
              <div>
                <div className="dc3-sv" style={{ color: brand.customerVoice?.reviewGrowth?.startsWith("-") ? "var(--r)" : "var(--g)" }}>{brand.customerVoice?.reviewGrowth || "—"}</div>
                <div className="dc3-sl">YoY Growth</div>
              </div>
              <div>
                <div className="dc3-sv">{brand.customerVoice?.mostRecentReview || "—"}</div>
                <div className="dc3-sl">Last Review</div>
              </div>
            </div>
          </div>
        </div>

        {/* Part 2: Actual Reviews */}
        <div className="bp-row bp-row-2">
          <div className="bp-card">
            <div className="bp-card-title" style={{ color: "var(--g)" }}>Top 5 Best Reviews</div>
            {brand.customerVoice?.positive?.slice(0, 5).map((r, i) => (
              <div key={i} className="bp-review-item">
                <div className="bp-review-header">
                  <div className="bp-review-stars">{"★".repeat(r.stars || 5)}{"☆".repeat(5 - (r.stars || 5))}</div>
                  <span className="bp-review-source">{r.source}</span>
                  <span className="bp-review-date">{r.date}</span>
                </div>
                <p className="bp-review-text">"{r.text}"</p>
              </div>
            ))}
          </div>
          <div className="bp-card">
            <div className="bp-card-title" style={{ color: "var(--r)" }}>Top 5 Worst Reviews</div>
            {brand.customerVoice?.negative?.slice(0, 5).map((r, i) => (
              <div key={i} className="bp-review-item">
                <div className="bp-review-header">
                  <div className="bp-review-stars" style={{ color: "var(--r)" }}>{"★".repeat(r.stars || 1)}{"☆".repeat(5 - (r.stars || 1))}</div>
                  <span className="bp-review-source">{r.source}</span>
                  <span className="bp-review-date">{r.date}</span>
                </div>
                <p className="bp-review-text">"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
