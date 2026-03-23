import { IDEA_CATEGORIES } from "../../data";
import Sparkline from "../common/Sparkline";

const STAGE_STYLE = {
  validated: { label: "VALIDATED", color: "var(--g)", bg: "var(--gl)" },
  emerging: { label: "EMERGING", color: "var(--a)", bg: "rgba(212,175,55,.08)" },
};
const DIFF_COLOR = { low: "var(--g)", medium: "var(--a)", high: "var(--r)" };

export default function IdeaCard({ idea, onSelect }) {
  const cat = IDEA_CATEGORIES.find(c => c.id === idea.categoryId);
  const ss = STAGE_STYLE[idea.stage] || STAGE_STYLE.validated;
  // Generate a growth sparkline from the category's sparkData or a synthetic curve
  const sparkData = cat?.sparkData || Array.from({ length: 12 }, (_, i) => Math.round(10 + (idea.growthRate * (i / 11))));
  const gc = idea.growthRate >= 30 ? "var(--g)" : "var(--a)";

  return (
    <div className="idea-card" onClick={() => onSelect(idea)}>
      <div className="idea-card-top">
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span className="idea-type-badge" style={{ color: ss.color, background: ss.bg, borderColor: ss.color }}>{ss.label}</span>
        </div>
        <span className="idea-date">{new Date(idea.releasedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
      </div>

      <div className="idea-card-title">{idea.title}</div>
      <div className="idea-card-subtitle">{idea.subtitle}</div>

      {cat && (
        <div style={{ marginTop: 8 }}>
          <span className="tag tm" style={{ fontSize: 10, padding: "2px 7px" }}>{cat.icon} {cat.name}</span>
        </div>
      )}

      {/* Growth chart */}
      <div className="idea-card-chart">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span className="idea-ml">Category Growth (12mo)</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: 14, fontWeight: 700, color: gc }}>+{idea.growthRate}%</span>
        </div>
        <Sparkline data={sparkData} color={gc} w={280} h={40} />
      </div>

      <div className="idea-card-metrics">
        <div><span className="idea-mv">{idea.marketSize}</span><span className="idea-ml">Market</span></div>
        <div><span className="idea-mv">{idea.estimatedTAM}</span><span className="idea-ml">TAM</span></div>
        <div><span className="idea-mv">{idea.competitorCount}</span><span className="idea-ml">Competitors</span></div>
        <div><span className="idea-mv" style={{ color: DIFF_COLOR[idea.entryDifficulty], textTransform: "capitalize" }}>{idea.entryDifficulty}</span><span className="idea-ml">Barrier</span></div>
      </div>

      {idea.communitySignals[0] && (
        <div className="idea-card-signal">
          <span className="idea-sig-src">{idea.communitySignals[0].platform}</span>
          <span className="idea-sig-text">{idea.communitySignals[0].signal.length > 70 ? idea.communitySignals[0].signal.slice(0, 70) + "…" : idea.communitySignals[0].signal}</span>
        </div>
      )}
    </div>
  );
}
