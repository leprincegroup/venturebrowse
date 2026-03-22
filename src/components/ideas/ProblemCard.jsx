import { IDEA_CATEGORIES } from "../../data";

const SEV_COLOR = { high: "var(--r)", medium: "var(--a)", low: "var(--ink4)" };
const SRC_LABELS = { reddit: "Reddit", tiktok: "TikTok", amazon: "Amazon", google: "Google", instagram: "Instagram" };

export default function ProblemCard({ problem, onSelect }) {
  const cat = IDEA_CATEGORIES.find(c => c.id === problem.categoryId);
  return (
    <div className="idea-card" onClick={() => onSelect(problem)}>
      <div className="ctop">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="prob-sev" style={{ background: SEV_COLOR[problem.severity] }} />
          <span className="prob-sev-label">{problem.severity}</span>
        </div>
        <span className="prob-growth" style={{ color: problem.growthRate >= 40 ? "var(--g)" : "var(--a)" }}>
          +{problem.growthRate}%
        </span>
      </div>
      <div className="cname">{problem.title}</div>
      <div className="ctag">{problem.description.length > 120 ? problem.description.slice(0, 120) + "…" : problem.description}</div>
      {cat && <div className="ic-sources"><span className="ic-src">{cat.icon} {cat.name}</span></div>}
      <div className="ic-sources">
        {problem.sources.map(s => (
          <span key={s.platform} className="ic-src">{SRC_LABELS[s.platform] || s.platform}</span>
        ))}
      </div>
      <div className="cmetrics">
        <div className="cmet">
          <div className="cml">Mentions</div>
          <div className="cmv">{(problem.mentionCount / 1000).toFixed(1)}K</div>
        </div>
        <div className="cmet">
          <div className="cml">Sentiment</div>
          <div className="cmv" style={{ color: problem.sentiment < 5 ? "var(--r)" : "var(--a)" }}>{problem.sentiment}/10</div>
        </div>
        <div className="cmet">
          <div className="cml">Search Vol</div>
          <div className="cmv">{(problem.searchVolume / 1000).toFixed(0)}K</div>
        </div>
      </div>
    </div>
  );
}
