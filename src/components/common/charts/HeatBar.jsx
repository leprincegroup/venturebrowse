export default function HeatBar({ value, max = 100, colorLow = "var(--g)", colorHigh = "var(--r)", label, w = "100%" }) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  // Interpolate color based on percentage
  const color = pct >= 70 ? colorHigh : pct >= 40 ? "var(--a)" : colorLow;

  return (
    <div className="heat-bar" style={{ width: w }}>
      {label && <span className="heat-bar-label">{label}</span>}
      <div className="heat-bar-track">
        <div
          className="heat-bar-fill"
          style={{
            width: `${pct}%`,
            background: color,
            transition: "width 0.8s cubic-bezier(.22,1,.36,1)",
          }}
        />
        <div
          className="heat-bar-dot"
          style={{ left: `${pct}%`, background: color }}
        />
      </div>
      <span className="heat-bar-value" style={{ color }}>{value}</span>
    </div>
  );
}
