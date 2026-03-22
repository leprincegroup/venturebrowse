import { IDEA_CATEGORIES } from "../../data";
import AreaChart from "../common/charts/AreaChart";
import DonutChart from "../common/charts/DonutChart";

const DIFF_COLOR = { low: "var(--g)", medium: "var(--a)", high: "var(--r)" };

export default function OpportunityCard({ opp, onSelect }) {
  const cat = IDEA_CATEGORIES.find(c => c.id === opp.categoryId);
  const growthCurve = Array.from({ length: 12 }, (_, i) => Math.round(10 + (opp.growthRate * (i / 11))));

  // Market size segments for visual
  const tamNum = parseFloat(opp.estimatedTAM.replace(/[^0-9.]/g, ""));
  const marketNum = parseFloat(opp.marketSize.replace(/[^0-9.]/g, ""));
  const tamPct = marketNum > 0 ? Math.min((tamNum / marketNum) * 100, 100) : 30;

  return (
    <div className="ic3" onClick={() => onSelect(opp)}>
      {/* Header */}
      <div className="ic3-header">
        <div className="ic3-hdr-info" style={{ flex: 1 }}>
          <div className="ic3-name">{opp.title}</div>
          <div style={{ display: "flex", gap: 5, marginTop: 5 }}>
            {cat && <span className="tag tm" style={{ fontSize: 10, padding: "2px 7px" }}>{cat.name}</span>}
          </div>
        </div>
      </div>

      {/* Hero: Growth Chart + Market Donut */}
      <div className="ic3-visual-row">
        <div className="ic3-chart" style={{ flex: 1 }}>
          <AreaChart data={growthCurve} color="var(--g)" w={200} h={56} filled={true} />
          <span className="dc3-chart-val" style={{ color: "var(--g)" }}>+{opp.growthRate}% growth</span>
        </div>
        <div style={{ textAlign: "center" }}>
          <DonutChart
            segments={[
              { value: tamPct, color: "var(--g)" },
              { value: 100 - tamPct, color: "var(--bd)" },
            ]}
            size={64} strokeWidth={7}
            label={opp.estimatedTAM} sublabel="TAM"
          />
        </div>
      </div>

      {/* Market metrics */}
      <div className="ic3-metrics">
        <div><span className="dc3-sv">{opp.marketSize}</span><span className="dc3-sl">Market</span></div>
        <div><span className="dc3-sv">{opp.competitorCount}</span><span className="dc3-sl">Competitors</span></div>
        <div>
          <span className="dc3-sv" style={{ color: DIFF_COLOR[opp.entryDifficulty] }}>{opp.entryDifficulty}</span>
          <span className="dc3-sl">Barrier</span>
        </div>
      </div>

      {/* Community signal */}
      {opp.communitySignals[0] && (
        <div className="ic3-signal">
          <span className="ic3-sig-src">{opp.communitySignals[0].platform}</span>
          <span className="ic3-sig-text">{opp.communitySignals[0].signal.length > 65 ? opp.communitySignals[0].signal.slice(0, 65) + "…" : opp.communitySignals[0].signal}</span>
        </div>
      )}
    </div>
  );
}
