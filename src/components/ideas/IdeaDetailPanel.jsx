import { useState } from "react";
import { IDEA_CATEGORIES, IDEA_PROBLEMS, IDEA_OPPORTUNITIES } from "../../data";
import ScoreRow from "../common/ScoreRow";
import Sparkline from "../common/Sparkline";

const SRC_LABELS = { reddit: "Reddit", tiktok: "TikTok", amazon: "Amazon", google: "Google", instagram: "Instagram" };

export default function IdeaDetailPanel({ item, type, onClose }) {
  const [ptab, setPtab] = useState("overview");

  // type: "category" | "problem" | "opportunity"
  const cat = type === "category" ? item : IDEA_CATEGORIES.find(c => c.id === item.categoryId);
  const relatedProblems = type === "category"
    ? IDEA_PROBLEMS.filter(p => p.categoryId === item.id)
    : type === "opportunity"
      ? IDEA_PROBLEMS.filter(p => item.problemIds?.includes(p.id))
      : [];
  const relatedOpps = type === "category"
    ? IDEA_OPPORTUNITIES.filter(o => o.categoryId === item.id)
    : type === "problem"
      ? IDEA_OPPORTUNITIES.filter(o => o.problemIds?.includes(item.id))
      : [];

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="panel">
        <div className="phdr">
          <div>
            <div className="pco">{type === "category" ? item.icon + " " : ""}{type === "category" ? item.name : item.title}</div>
            <div className="psub">
              {type === "category" && `${item.brandCount} brands · +${item.growthRate}% growth · ${item.trendScore}/100 trend score`}
              {type === "problem" && `${item.severity} severity · +${item.growthRate}% growth · ${(item.mentionCount / 1000).toFixed(1)}K mentions`}
              {type === "opportunity" && `${item.marketSize} market · +${item.growthRate}% growth · ${item.entryDifficulty} difficulty`}
            </div>
          </div>
          <button className="xcl" onClick={onClose}>×</button>
        </div>

        <div className="ptabs">
          {[{ k: "overview", l: "Overview" }, { k: "signals", l: "Signals" }, { k: "related", l: "Related" }].map(t => (
            <button key={t.k} className={`ptab${ptab === t.k ? " on" : ""}`} onClick={() => setPtab(t.k)}>{t.l}</button>
          ))}
        </div>

        <div className="pbody">
          {ptab === "overview" && <>
            <div className="pstl">Description</div>
            <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.7, fontWeight: 300, marginBottom: 26 }}>
              {type === "category" ? item.description : item.description}
            </p>

            {type === "category" && <>
              <div className="pstl">Growth Trend</div>
              <div className="spark-lg">
                <Sparkline data={item.sparkData} color="var(--g)" w={420} h={80} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink4)" }}>12 months ago</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink4)" }}>Today</span>
                </div>
              </div>

              <div className="pstl">Subcategories</div>
              <div className="comp-list" style={{ marginBottom: 26 }}>
                {item.subcategories.map((s, i) => (
                  <div className="comp-item" key={i}>
                    <span className="comp-name">{s.name}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 13, fontWeight: 600, color: "var(--g)" }}>+{s.growth}%</span>
                  </div>
                ))}
              </div>

              <div className="pstl">Key Metrics</div>
              <div className="pmets" style={{ marginBottom: 26 }}>
                <div className="pmet"><div className="pml">Brands</div><div className="pmv">{item.brandCount}</div></div>
                <div className="pmet"><div className="pml">Sentiment</div><div className="pmv">{item.sentiment}/10</div></div>
                <div className="pmet"><div className="pml">Trend Score</div><div className="pmv" style={{ color: "var(--g)" }}>{item.trendScore}</div></div>
                <div className="pmet"><div className="pml">Growth</div><div className="pmv" style={{ color: "var(--g)" }}>+{item.growthRate}%</div></div>
              </div>
            </>}

            {type === "problem" && <>
              <div className="pstl">Severity Assessment</div>
              <div className="pmets" style={{ marginBottom: 26 }}>
                <div className="pmet"><div className="pml">Severity</div><div className="pmv" style={{ textTransform: "capitalize", color: item.severity === "high" ? "var(--r)" : "var(--a)" }}>{item.severity}</div></div>
                <div className="pmet"><div className="pml">Mentions</div><div className="pmv">{(item.mentionCount / 1000).toFixed(1)}K</div></div>
                <div className="pmet"><div className="pml">Sentiment</div><div className="pmv" style={{ color: item.sentiment < 5 ? "var(--r)" : "var(--a)" }}>{item.sentiment}/10</div></div>
                <div className="pmet"><div className="pml">Search Vol</div><div className="pmv">{(item.searchVolume / 1000).toFixed(0)}K</div></div>
              </div>

              <div className="pstl">Related Keywords</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 26 }}>
                {item.relatedKeywords.map((k, i) => <span key={i} className="tag tm">{k}</span>)}
              </div>
            </>}

            {type === "opportunity" && <>
              <div className="pstl" style={{ marginBottom: 12 }}>Validation Score</div>
              <div style={{ marginBottom: 26 }}>
                <ScoreRow n="Overall" s={item.validationScore} c={item.validationScore >= 8 ? "sf-g" : "sf-a"} anim={true} />
              </div>

              <div className="pstl">Market Data</div>
              <div className="pmets" style={{ marginBottom: 26 }}>
                <div className="pmet"><div className="pml">Market Size</div><div className="pmv">{item.marketSize}</div></div>
                <div className="pmet"><div className="pml">Growth</div><div className="pmv g">+{item.growthRate}%</div></div>
                <div className="pmet"><div className="pml">Competitors</div><div className="pmv">{item.competitorCount}</div></div>
                <div className="pmet"><div className="pml">Est. TAM</div><div className="pmv">{item.estimatedTAM}</div></div>
              </div>
            </>}
          </>}

          {ptab === "signals" && <>
            {(type === "problem" || type === "opportunity") && <>
              <div className="pstl">Community Signals</div>
              {(type === "problem" ? item.sources : item.communitySignals).map((s, i) => (
                <div className="sig-item" key={i}>
                  <span className="sig-time" style={{ width: 64 }}>{SRC_LABELS[s.platform] || s.platform}</span>
                  <div style={{ flex: 1 }}>
                    {type === "problem" && s.sampleQuote && (
                      <div style={{ fontSize: 13, color: "var(--ink2)", fontWeight: 300, lineHeight: 1.55, fontStyle: "italic", marginBottom: 4 }}>
                        "{s.sampleQuote}"
                      </div>
                    )}
                    {type === "problem" && (
                      <div style={{ fontSize: 12, color: "var(--ink4)", fontFamily: "var(--mono)" }}>
                        {s.postCount.toLocaleString()} posts · avg {s.avgEngagement.toLocaleString()} engagement
                      </div>
                    )}
                    {type === "opportunity" && (
                      <>
                        <div style={{ fontSize: 13, color: "var(--ink2)", fontWeight: 300, lineHeight: 1.55 }}>{s.signal}</div>
                        <div style={{ fontSize: 12, color: "var(--ink4)", fontFamily: "var(--mono)", marginTop: 4 }}>
                          {s.engagement.toLocaleString()} engagement · {s.date}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </>}

            {type === "category" && <>
              <div className="pstl">Top Sources</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 26 }}>
                {item.topSources.map(s => <span key={s} className="tag tb">{SRC_LABELS[s] || s}</span>)}
              </div>
              <div style={{ padding: 32, textAlign: "center", color: "var(--ink3)", fontSize: 14, fontWeight: 300 }}>
                Connect data sources to view real-time signals for this category.
              </div>
            </>}
          </>}

          {ptab === "related" && <>
            {relatedProblems.length > 0 && <>
              <div className="pstl">Related Problems ({relatedProblems.length})</div>
              <div className="comp-list" style={{ marginBottom: 26 }}>
                {relatedProblems.map(p => (
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
            {relatedOpps.length > 0 && <>
              <div className="pstl">Related Opportunities ({relatedOpps.length})</div>
              <div className="comp-list" style={{ marginBottom: 26 }}>
                {relatedOpps.map(o => (
                  <div className="comp-item" key={o.id}>
                    <div>
                      <span className="comp-name">{o.title}</span>
                      <div style={{ fontSize: 11, color: "var(--ink4)", marginTop: 2 }}>{o.marketSize} · {o.entryDifficulty} difficulty</div>
                    </div>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600, color: "var(--g)" }}>{o.validationScore}/10</span>
                  </div>
                ))}
              </div>
            </>}
            {relatedProblems.length === 0 && relatedOpps.length === 0 && (
              <div style={{ padding: 32, textAlign: "center", color: "var(--ink3)", fontSize: 14, fontWeight: 300 }}>
                No directly related items found.
              </div>
            )}
          </>}
        </div>
      </div>
    </div>
  );
}
