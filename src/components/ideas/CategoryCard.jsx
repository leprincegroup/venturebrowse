import AreaChart from "../common/charts/AreaChart";
import DonutChart from "../common/charts/DonutChart";
import ComparisonBars from "../common/charts/ComparisonBars";

const SRC_LABELS = { reddit: "Reddit", tiktok: "TikTok", amazon: "Amazon", google: "Google", instagram: "Instagram" };
const SRC_COLORS = { reddit: "#FF4500", tiktok: "#0d0d0b", amazon: "#FF9900", google: "#4285F4", instagram: "#E1306C" };

export default function CategoryCard({ cat, onSelect }) {
  const gc = cat.growthRate >= 40 ? "var(--g)" : cat.growthRate >= 20 ? "var(--a)" : "var(--ink3)";

  const srcSegments = cat.topSources.map(s => ({
    value: 1, color: SRC_COLORS[s] || "var(--ink4)", label: s,
  }));

  const subBars = cat.subcategories.slice(0, 4).map(s => ({
    label: s.name, value: s.growth, displayValue: `+${s.growth}%`,
    color: s.growth >= 50 ? "var(--g)" : s.growth >= 30 ? "var(--a)" : "var(--ink3)",
  }));

  return (
    <div className="ic3" onClick={() => onSelect(cat)}>
      {/* Header */}
      <div className="ic3-header">
        <span className="ic3-icon">{cat.icon}</span>
        <div className="ic3-hdr-info">
          <div className="ic3-name">{cat.name}</div>
          <div className="ic3-meta">{cat.brandCount} brands</div>
        </div>
        <div className="ic3-growth" style={{ color: gc }}>+{cat.growthRate}%</div>
      </div>

      {/* Hero: Area Chart */}
      <div className="ic3-chart">
        <AreaChart data={cat.sparkData} color={gc} w={320} h={64} filled={true} />
      </div>

      {/* Subcategory Growth Bars */}
      <div className="ic3-section">
        <ComparisonBars items={subBars} unit="%" />
      </div>

      {/* Sources + Description */}
      <div className="ic3-bottom">
        <div className="ic3-sources-row">
          <DonutChart segments={srcSegments} size={32} strokeWidth={4} />
          <div className="ic3-src-labels">
            {cat.topSources.map(s => (
              <span key={s} className="ic3-src" style={{ color: SRC_COLORS[s] }}>{SRC_LABELS[s]}</span>
            ))}
          </div>
        </div>
        <p className="ic3-desc">{cat.description.length > 80 ? cat.description.slice(0, 80) + "…" : cat.description}</p>
      </div>
    </div>
  );
}
