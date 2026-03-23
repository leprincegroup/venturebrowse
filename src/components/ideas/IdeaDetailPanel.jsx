import { useState } from "react";
import { IDEA_CATEGORIES, COMMUNITY_SIGNALS } from "../../data";
import ScoreRow from "../common/ScoreRow";
import AreaChart from "../common/charts/AreaChart";

const SRC_LABELS = { reddit: "Reddit", tiktok: "TikTok", amazon: "Amazon", google: "Google", instagram: "Instagram" };
const DIFF_COLOR = { low: "var(--g)", medium: "var(--a)", high: "var(--r)" };
const TYPE_LABEL = { build: "Build", acquire: "Acquire", "roll-up": "Roll-up" };

const TABS = [
  { k: "overview", l: "Overview" },
  { k: "execution", l: "Execution" },
  { k: "acquisition", l: "Acquisition" },
  { k: "signals", l: "Signals" },
];

export default function IdeaDetailPanel({ idea, onClose }) {
  const [ptab, setPtab] = useState("overview");
  const cat = IDEA_CATEGORIES.find(c => c.id === idea.categoryId);
  const relatedSignals = COMMUNITY_SIGNALS.filter(s => idea.problemIds?.includes(s.id.replace("sig-", "prob-")));
  const growthCurve = Array.from({ length: 12 }, (_, i) => Math.round(10 + (idea.growthRate * (i / 11))));

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="panel">
        <div className="phdr">
          <div>
            <div className="pco">{idea.title}</div>
            <div className="psub">{idea.subtitle}</div>
          </div>
          <button className="xcl" onClick={onClose}>×</button>
        </div>

        <div className="ptabs">
          {TABS.map(t => (
            <button key={t.k} className={`ptab${ptab === t.k ? " on" : ""}`} onClick={() => setPtab(t.k)}>{t.l}</button>
          ))}
        </div>

        <div className="pbody">
          {ptab === "overview" && <>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <span className="tag tb" style={{ fontSize: 10 }}>{TYPE_LABEL[idea.ideaType] || idea.ideaType}</span>
              <span className="tag tm" style={{ fontSize: 10 }}>{idea.stage}</span>
              {cat && <span className="tag" style={{ fontSize: 10, padding: "2px 7px", border: "1px solid var(--bd)" }}>{cat.icon} {cat.name}</span>}
            </div>

            <div className="pstl">Description</div>
            <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.7, fontWeight: 300, marginBottom: 26 }}>{idea.description}</p>

            <div className="pstl" style={{ marginBottom: 12 }}>Validation Score</div>
            <div style={{ marginBottom: 26 }}>
              <ScoreRow n="Overall" s={idea.validationScore} c={idea.validationScore >= 8 ? "sf-g" : "sf-a"} anim={true} />
            </div>

            <div className="pstl">Growth Trend</div>
            <div className="spark-lg">
              <AreaChart data={growthCurve} color="var(--g)" w={420} h={80} filled={true} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink4)" }}>12 months ago</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink4)" }}>Today</span>
              </div>
            </div>

            <div className="pstl">Market Data</div>
            <div className="pmets" style={{ marginBottom: 26 }}>
              <div className="pmet"><div className="pml">Market Size</div><div className="pmv">{idea.marketSize}</div></div>
              <div className="pmet"><div className="pml">Growth</div><div className="pmv" style={{ color: "var(--g)" }}>+{idea.growthRate}%</div></div>
              <div className="pmet"><div className="pml">Competitors</div><div className="pmv">{idea.competitorCount}</div></div>
              <div className="pmet"><div className="pml">Est. TAM</div><div className="pmv">{idea.estimatedTAM}</div></div>
              <div className="pmet"><div className="pml">Entry Barrier</div><div className="pmv" style={{ color: DIFF_COLOR[idea.entryDifficulty], textTransform: "capitalize" }}>{idea.entryDifficulty}</div></div>
              <div className="pmet"><div className="pml">Search Volume</div><div className="pmv">{(idea.searchVolume / 1000).toFixed(0)}K</div></div>
            </div>
          </>}

          {ptab === "execution" && <>
            <div className="pstl">Execution Plan</div>
            <div className="pmets" style={{ marginBottom: 26 }}>
              <div className="pmet"><div className="pml">Time to MVP</div><div className="pmv">{idea.executionPlan.timeToMVP}</div></div>
              <div className="pmet"><div className="pml">Launch Cost</div><div className="pmv">{idea.executionPlan.estimatedLaunchCost}</div></div>
            </div>

            <div className="pstl">Key Channels</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 26 }}>
              {idea.executionPlan.keyChannels.map((ch, i) => <span key={i} className="tag tb">{ch}</span>)}
            </div>

            <div className="pstl">Competitive Moat</div>
            <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.7, fontWeight: 300, marginBottom: 26 }}>{idea.executionPlan.moat}</p>

            <div className="pstl">Key Risks</div>
            <div className="comp-list" style={{ marginBottom: 26 }}>
              {idea.executionPlan.risks.map((r, i) => (
                <div className="comp-item" key={i}>
                  <span style={{ color: "var(--r)", fontFamily: "var(--mono)", fontSize: 12, marginRight: 8 }}>▲</span>
                  <span className="comp-name">{r}</span>
                </div>
              ))}
            </div>
          </>}

          {ptab === "acquisition" && <>
            <div className="pstl">Target Profile</div>
            <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.7, fontWeight: 300, marginBottom: 26 }}>{idea.acquisitionAngle.targetProfile}</p>

            <div className="pstl">Why Now</div>
            <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.7, fontWeight: 300, marginBottom: 26 }}>{idea.acquisitionAngle.whyNow}</p>

            <div className="pmets" style={{ marginBottom: 26 }}>
              <div className="pmet"><div className="pml">Multiple Range</div><div className="pmv" style={{ color: "var(--g)" }}>{idea.acquisitionAngle.multipleRange}</div></div>
            </div>

            <div className="pstl">Synergies</div>
            <div className="comp-list" style={{ marginBottom: 26 }}>
              {idea.acquisitionAngle.synergies.map((s, i) => (
                <div className="comp-item" key={i}>
                  <span style={{ color: "var(--g)", fontFamily: "var(--mono)", fontSize: 12, marginRight: 8 }}>●</span>
                  <span className="comp-name">{s}</span>
                </div>
              ))}
            </div>
          </>}

          {ptab === "signals" && <>
            <div className="pstl">Community Signals</div>
            {idea.communitySignals.map((s, i) => (
              <div className="sig-item" key={i}>
                <span className="sig-time" style={{ width: 64 }}>{SRC_LABELS[s.platform] || s.platform}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "var(--ink2)", fontWeight: 300, lineHeight: 1.55 }}>{s.signal}</div>
                  <div style={{ fontSize: 12, color: "var(--ink4)", fontFamily: "var(--mono)", marginTop: 4 }}>
                    {s.engagement.toLocaleString()} engagement · {s.date}
                  </div>
                </div>
              </div>
            ))}

            {relatedSignals.length > 0 && <>
              <div className="pstl" style={{ marginTop: 26 }}>Related Pain Points ({relatedSignals.length})</div>
              <div className="comp-list" style={{ marginBottom: 26 }}>
                {relatedSignals.map(p => (
                  <div className="comp-item" key={p.id}>
                    <div>
                      <span className="comp-name">{p.title}</span>
                      <div style={{ fontSize: 11, color: "var(--ink4)", marginTop: 2 }}>{p.severity} · +{p.growthRate}% growth</div>
                    </div>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink4)" }}>{(p.mentionCount / 1000).toFixed(1)}K mentions</span>
                  </div>
                ))}
              </div>
            </>}
          </>}
        </div>
      </div>
    </div>
  );
}
