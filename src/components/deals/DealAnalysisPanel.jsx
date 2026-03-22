import { useState } from "react";
import AreaChart from "../common/charts/AreaChart";
import RadarChart from "../common/charts/RadarChart";
import ComparisonBars from "../common/charts/ComparisonBars";
import MatrixQuadrant from "../common/charts/MatrixQuadrant";
import SignalTimeline from "../common/charts/SignalTimeline";
import FlagList from "../common/charts/FlagList";
import StarDistribution from "../common/charts/StarDistribution";
import BarChart from "../common/charts/BarChart";
import ProGate from "./ProGate";

const STATUS_LABEL = {
  "looking-to-sell": "Looking to Sell", "growth-stalled": "Growth Stalled",
  "open-to-consulting": "Open to Consulting", "growing": "Growing",
};
const STATUS_CLASS = {
  "looking-to-sell": "ta", "growth-stalled": "tr", "open-to-consulting": "tb", "growing": "tg",
};
const SEV_CLASS = { critical: "tr", high: "ta", medium: "tm", low: "tm" };

export default function DealAnalysisPanel({ brand, onClose, watched, onToggleWatch }) {
  const [ptab, setPtab] = useState("story");
  const [locked, setLocked] = useState(true);

  const trafficDown = brand.trafficTrend && brand.trafficTrend[0] > brand.trafficTrend[brand.trafficTrend.length - 1];

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="panel">
        {/* Header */}
        <div className="dc2-header" style={{ background: brand.bgGradient || brand.brandColor, borderRadius: 0 }}>
          <div className="dc2-hdr-top">
            <div className="dc2-logo" style={{ borderColor: "rgba(255,255,255,.3)", width: 46, height: 46, fontSize: 15 }}>{brand.logo}</div>
            <div className="dc2-hdr-info">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="dc2-name" style={{ fontSize: 20 }}>{brand.name}</span>
                {brand.verification === "verified" && <span className="vb-badge verified">✓ Verified</span>}
                {brand.verification === "claimed" && <span className="vb-badge claimed">Claimed</span>}
              </div>
              <div className="dc2-cat">{brand.category} · {brand.hq}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className={`dc2-wl${watched ? " on" : ""}`} onClick={() => onToggleWatch(brand.id)}>{watched ? "♥" : "♡"}</button>
              <button className="dc2-wl" onClick={onClose}>×</button>
            </div>
          </div>
          <div className="dc2-hdr-stats">
            <div><span className="dc2-hs-v">{brand.employees}</span><span className="dc2-hs-l">Team</span></div>
            <div><span className="dc2-hs-v">{brand.founded}</span><span className="dc2-hs-l">Founded</span></div>
            {brand.socialFollowing?.instagram && <div><span className="dc2-hs-v">{brand.socialFollowing.instagram}</span><span className="dc2-hs-l">Instagram</span></div>}
            {brand.verifiedRevenue && <div><span className="dc2-hs-v">{brand.verifiedRevenue}</span><span className="dc2-hs-l">Revenue ✓</span></div>}
          </div>
        </div>

        {/* Status bar */}
        <div style={{ padding: "10px 26px", borderBottom: "1px solid var(--bd)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className={`tag ${STATUS_CLASS[brand.status]}`}>{STATUS_LABEL[brand.status]}</span>
          <span style={{ fontSize: 12, color: "var(--ink4)" }}>{brand.website}</span>
        </div>

        <div className="ptabs">
          {[{ k: "story", l: "Brand Story" }, { k: "signals", l: "Signals" }, { k: "gaps", l: "Gaps" }, { k: "opportunities", l: "White Space" }, { k: "customers", l: "Reviews" }].map(t => (
            <button key={t.k} className={`ptab${ptab === t.k ? " on" : ""}`} onClick={() => setPtab(t.k)}>{t.l}</button>
          ))}
        </div>

        <div className="pbody">
          {ptab === "story" && <>
            {/* VISUAL FIRST: Radar Chart */}
            <div className="pstl">Brand Health Overview</div>
            <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 26, padding: 16, background: "var(--off)", borderRadius: 11, border: "1px solid var(--bd)" }}>
              <RadarChart axes={(() => {
                const td = brand.trafficTrend ? (brand.trafficTrend[brand.trafficTrend.length-1] / brand.trafficTrend[0]) * 10 : 5;
                const sd = brand.searchInterest ? (brand.searchInterest[brand.searchInterest.length-1] / brand.searchInterest[0]) * 10 : 5;
                const soc = brand.socialFollowing?.instagram ? (parseInt(brand.socialFollowing.instagram) >= 1000 ? 8 : 6) : 3;
                const gaps = Math.max(0, 10 - brand.gaps.length * 2);
                const opps = Math.min(10, brand.whiteSpace.length * 2.5);
                const rev = brand.customerVoice?.trustpilotRating ? brand.customerVoice.trustpilotRating * 2 : 5;
                return [
                  { label: "Traffic", value: Math.min(10, Math.max(1, Math.round(td*10)/10)) },
                  { label: "Social", value: soc },
                  { label: "Reviews", value: Math.round(rev*10)/10 },
                  { label: "Ops", value: Math.round(gaps*10)/10 },
                  { label: "Oppty", value: Math.round(opps*10)/10 },
                  { label: "Search", value: Math.min(10, Math.max(1, Math.round(sd*10)/10)) },
                ];
              })()} size={180} color={brand.brandColor} />
              <div style={{ flex: 1 }}>
                <ComparisonBars items={[
                  { label: "Gaps identified", value: brand.gaps.length, color: "var(--r)", displayValue: String(brand.gaps.length) },
                  { label: "Opportunities", value: brand.whiteSpace.length, color: "var(--g)", displayValue: String(brand.whiteSpace.length) },
                  { label: "Competitors", value: brand.competitors.length, color: "var(--a)", displayValue: String(brand.competitors.length) },
                  { label: "Strengths", value: brand.whatTheyBuilt.length, color: "var(--b)", displayValue: String(brand.whatTheyBuilt.length) },
                ]} maxValue={8} />
              </div>
            </div>

            <div className="pstl">About {brand.name}</div>
            <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.7, fontWeight: 300, marginBottom: 26 }}>
              {brand.brandStory}
            </p>

            <div className="pstl">What They Built</div>
            <div className="comp-list" style={{ marginBottom: 26 }}>
              {brand.whatTheyBuilt.map((w, i) => (
                <div className="comp-item" key={i} style={{ padding: "10px 14px" }}>
                  <span className="comp-name" style={{ fontWeight: 400, fontSize: 13 }}>{w}</span>
                </div>
              ))}
            </div>

            {brand.trafficTrend && <>
              <div className="pstl">Web Traffic (12 months)</div>
              <div className="spark-lg" style={{ marginBottom: 26 }}>
                <AreaChart data={brand.trafficTrend} color={trafficDown ? "var(--r)" : "var(--g)"} w={420} h={70} filled={true} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink4)" }}>12 months ago · {brand.trafficTrend[0]}K/mo</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: trafficDown ? "var(--r)" : "var(--g)" }}>Today · {brand.trafficTrend[brand.trafficTrend.length - 1]}K/mo</span>
                </div>
              </div>
            </>}

            {brand.searchInterest && <>
              <div className="pstl">Search Interest (Google Trends)</div>
              <div className="spark-lg">
                <AreaChart data={brand.searchInterest} color={brand.searchInterest[0] > brand.searchInterest[brand.searchInterest.length - 1] ? "var(--r)" : "var(--g)"} w={420} h={50} filled={true} />
              </div>
            </>}

            <div className="pstl" style={{ marginTop: 26 }}>Competitive Landscape</div>
            <div className="comp-list">
              {brand.competitors.map((c, i) => (
                <div className="comp-item" key={i}>
                  <div>
                    <span className="comp-name">{c.name}</span>
                    <div style={{ fontSize: 11, color: "var(--ink4)", marginTop: 2 }}>{c.strength}</div>
                  </div>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink3)" }}>{c.metric}</span>
                </div>
              ))}
            </div>
          </>}

          {ptab === "signals" && <>
            {/* Red Flags */}
            <div className="pstl">Red Flags ({brand.redFlags?.length || 0})</div>
            <div style={{ marginBottom: 24 }}>
              <FlagList flags={brand.redFlags || []} type="red" />
            </div>

            {/* Green Flags */}
            <div className="pstl">Green Flags ({brand.greenFlags?.length || 0})</div>
            <div style={{ marginBottom: 24 }}>
              <FlagList flags={brand.greenFlags || []} type="green" />
            </div>

            {/* Signal Timeline */}
            <div className="pstl">Signal Timeline</div>
            <div style={{ marginBottom: 24 }}>
              <SignalTimeline events={brand.signalTimeline || []} />
            </div>

            {/* Review Trend */}
            {brand.reviewTrend && <>
              <div className="pstl">Review Volume (12 months)</div>
              <div style={{ padding: 16, background: "var(--off)", borderRadius: 11, border: "1px solid var(--bd)" }}>
                <BarChart bars={brand.reviewTrend.map((v, i) => ({
                  label: ["J","F","M","A","M","J","J","A","S","O","N","D"][i],
                  value: v,
                  color: i >= 9 ? "var(--ink)" : "var(--ink3)",
                }))} h={100} barWidth={24} gap={4} />
              </div>
            </>}
          </>}

          {ptab === "gaps" && <>
            {/* VISUAL FIRST: Gap severity matrix */}
            <div className="pstl">Gap Severity Matrix</div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24, padding: 12, background: "var(--off)", borderRadius: 11, border: "1px solid var(--bd)" }}>
              <MatrixQuadrant
                items={brand.gaps.map((g, i) => ({
                  name: g.area,
                  x: g.severity === "critical" ? 9 : g.severity === "high" ? 7 : g.severity === "medium" ? 4 : 2,
                  y: 3 + i * 1.5,
                  color: g.severity === "critical" ? "var(--r)" : g.severity === "high" ? "var(--a)" : "var(--ink3)",
                }))}
                xLabel="Severity →" yLabel="Impact →" xKey="x" yKey="y" size={260}
              />
            </div>

            <div className="pstl">Gap Analysis — Where {brand.name} Is Falling Behind</div>
            <div className="dp-opps">
              {brand.gaps.map((g, i) => (
                <div className="dp-opp-card" key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span className="cname" style={{ fontSize: 15 }}>{g.area}</span>
                    <span className={`tag ${SEV_CLASS[g.severity]}`} style={{ textTransform: "capitalize" }}>{g.severity}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "var(--ink2)", fontWeight: 300, lineHeight: 1.6, marginBottom: 10 }}>{g.description}</p>
                  {g.competitor && (
                    <div style={{ padding: "8px 10px", background: "var(--off)", borderRadius: 6, fontSize: 12, color: "var(--ink3)" }}>
                      <span style={{ fontWeight: 600, color: "var(--ink2)" }}>Benchmark: </span>{g.competitor}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>}

          {ptab === "opportunities" && (
            <ProGate locked={locked} onUnlock={() => setLocked(false)}>
              <div className="pstl">White Space — Untapped Opportunities</div>
              <div className="dp-opps">
                {brand.whiteSpace.map((o, i) => (
                  <div className="dp-opp-card" key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span className="cname" style={{ fontSize: 14 }}>{o.opportunity}</span>
                      <span className={`tag ${o.impact === "High" ? "tg" : "ta"}`}>{o.impact} impact</span>
                    </div>
                    <p style={{ fontSize: 13, color: "var(--ink3)", fontWeight: 300, lineHeight: 1.6, marginBottom: 8 }}>{o.description}</p>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--ink4)" }}>Timeframe: {o.timeframe}</div>
                  </div>
                ))}
              </div>

              <div className="pstl" style={{ marginTop: 26 }}>Summary</div>
              <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.7, fontWeight: 300 }}>
                {brand.summary}
              </p>
            </ProGate>
          )}

          {ptab === "customers" && <>
            {/* VISUAL FIRST: Star distribution + rating */}
            {brand.starDistribution && (
              <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 26, padding: 16, background: "var(--off)", borderRadius: 11, border: "1px solid var(--bd)" }}>
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 36, fontWeight: 700, color: "var(--ink)", lineHeight: 1 }}>{brand.customerVoice?.trustpilotRating || "—"}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink4)", marginTop: 4 }}>/ 5.0</div>
                  <div style={{ fontSize: 11, color: "var(--ink3)", marginTop: 6 }}>{brand.customerVoice?.reviewCount?.toLocaleString()} reviews</div>
                </div>
                <div style={{ flex: 1 }}>
                  <StarDistribution distribution={brand.starDistribution} />
                </div>
              </div>
            )}

            <div className="pstl">What Customers Love</div>
            <div style={{ marginBottom: 26 }}>
              {brand.customerVoice.positive.map((r, i) => (
                <div className="sig-item" key={i}>
                  <span className="sig-time" style={{ width: 70, color: "var(--g)" }}>{r.source}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "var(--ink2)", fontWeight: 300, lineHeight: 1.55, fontStyle: "italic" }}>"{r.text}"</div>
                    <div style={{ fontSize: 11, color: "var(--ink4)", fontFamily: "var(--mono)", marginTop: 4 }}>{r.date}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pstl">What Customers Complain About</div>
            <div style={{ marginBottom: 26 }}>
              {brand.customerVoice.negative.map((r, i) => (
                <div className="sig-item" key={i}>
                  <span className="sig-time" style={{ width: 70, color: "var(--r)" }}>{r.source}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "var(--ink2)", fontWeight: 300, lineHeight: 1.55, fontStyle: "italic" }}>"{r.text}"</div>
                    <div style={{ fontSize: 11, color: "var(--ink4)", fontFamily: "var(--mono)", marginTop: 4 }}>{r.date}</div>
                  </div>
                </div>
              ))}
            </div>

            {brand.customerVoice.trustpilotRating && (
              <div className="info-grid">
                <div className="info-row"><span className="info-l">Trustpilot</span><span className="info-v">{brand.customerVoice.trustpilotRating}/5.0</span></div>
                <div className="info-row"><span className="info-l">Total Reviews</span><span className="info-v">{brand.customerVoice.reviewCount?.toLocaleString()}</span></div>
              </div>
            )}
          </>}
        </div>
      </div>
    </div>
  );
}
