export default function MatrixQuadrant({ items, xLabel = "X", yLabel = "Y", xKey = "x", yKey = "y", size = 220 }) {
  // items: [{name, x (0-10), y (0-10), color?}]
  if (!items || !items.length) return null;
  const pad = 32;
  const plotSize = size - pad * 2;
  const cx = size / 2, cy = size / 2;

  // Quadrant labels
  const quads = [
    { label: "Monitor", x: pad + plotSize * 0.25, y: pad + plotSize * 0.25, opacity: 0.15 },
    { label: "Invest", x: pad + plotSize * 0.75, y: pad + plotSize * 0.25, opacity: 0.15 },
    { label: "Ignore", x: pad + plotSize * 0.25, y: pad + plotSize * 0.75, opacity: 0.1 },
    { label: "Quick Win", x: pad + plotSize * 0.75, y: pad + plotSize * 0.75, opacity: 0.15 },
  ];

  return (
    <div style={{ position: "relative" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Quadrant backgrounds */}
        <rect x={pad} y={pad} width={plotSize / 2} height={plotSize / 2} fill="var(--al)" opacity="0.15" />
        <rect x={cx} y={pad} width={plotSize / 2} height={plotSize / 2} fill="var(--gl)" opacity="0.2" />
        <rect x={pad} y={cy} width={plotSize / 2} height={plotSize / 2} fill="var(--off2)" opacity="0.3" />
        <rect x={cx} y={cy} width={plotSize / 2} height={plotSize / 2} fill="var(--bl)" opacity="0.15" />

        {/* Grid lines */}
        <line x1={cx} y1={pad} x2={cx} y2={pad + plotSize} stroke="var(--bd)" strokeWidth="1" strokeDasharray="3,3" />
        <line x1={pad} y1={cy} x2={pad + plotSize} y2={cy} stroke="var(--bd)" strokeWidth="1" strokeDasharray="3,3" />

        {/* Border */}
        <rect x={pad} y={pad} width={plotSize} height={plotSize} fill="none" stroke="var(--bd)" strokeWidth="1" rx="4" />

        {/* Quadrant labels */}
        {quads.map((q, i) => (
          <text key={i} x={q.x} y={q.y} textAnchor="middle" dominantBaseline="middle"
            fontSize="9" fontFamily="var(--mono)" fill="var(--ink4)" fontWeight="500" opacity={0.7}>
            {q.label}
          </text>
        ))}

        {/* Data points */}
        {items.map((item, i) => {
          const px = pad + (item[xKey] / 10) * plotSize;
          const py = pad + (1 - item[yKey] / 10) * plotSize;
          return (
            <g key={i}>
              <circle cx={px} cy={py} r="6" fill={item.color || "var(--ink)"} opacity="0.85" />
              <text x={px} y={py - 10} textAnchor="middle" fontSize="8" fontFamily="var(--mono)"
                fill="var(--ink)" fontWeight="600">
                {item.name.length > 10 ? item.name.slice(0, 10) : item.name}
              </text>
            </g>
          );
        })}

        {/* Axis labels */}
        <text x={cx} y={size - 6} textAnchor="middle" fontSize="9" fontFamily="var(--mono)" fill="var(--ink4)">{xLabel}</text>
        <text x={8} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="9" fontFamily="var(--mono)" fill="var(--ink4)"
          transform={`rotate(-90, 8, ${cy})`}>{yLabel}</text>
      </svg>
    </div>
  );
}
