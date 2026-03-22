export default function BarChart({ bars, h = 120, barWidth = 28, gap = 6 }) {
  if (!bars || !bars.length) return null;
  const mx = Math.max(...bars.map(b => b.value));
  const w = bars.length * (barWidth + gap) - gap;
  const labelH = 18;
  const chartH = h - labelH;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
      {bars.map((b, i) => {
        const bh = mx > 0 ? (b.value / mx) * (chartH - 4) : 0;
        const x = i * (barWidth + gap);
        return (
          <g key={i}>
            <rect
              x={x} y={chartH - bh} width={barWidth} height={bh}
              rx={3} fill={b.color || "var(--ink)"}
              opacity={0.85}
            />
            <text
              x={x + barWidth / 2} y={chartH + labelH - 4}
              textAnchor="middle" fontSize="9" fontFamily="var(--mono)"
              fill="var(--ink4)" fontWeight="500"
            >
              {b.label}
            </text>
            <text
              x={x + barWidth / 2} y={chartH - bh - 5}
              textAnchor="middle" fontSize="10" fontFamily="var(--mono)"
              fill={b.color || "var(--ink)"} fontWeight="600"
            >
              {b.displayValue || b.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
