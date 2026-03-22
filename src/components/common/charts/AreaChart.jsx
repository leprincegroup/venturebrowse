export default function AreaChart({ data, color = "var(--g)", w = 120, h = 40, filled = true }) {
  if (!data || data.length < 2) return null;
  const mn = Math.min(...data), mx = Math.max(...data), r = mx - mn || 1;
  const pad = 2;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - pad - ((v - mn) / r) * (h - pad * 2),
  ]);
  const line = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0] + "," + p[1]).join(" ");
  const area = line + ` L${w},${h} L0,${h} Z`;
  const [lx, ly] = pts[pts.length - 1];

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible", display: "block" }}>
      {filled && (
        <defs>
          <linearGradient id={`ag-${w}-${h}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
      )}
      {filled && <path d={area} fill={`url(#ag-${w}-${h})`} />}
      <path d={line} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="3" fill={color} />
    </svg>
  );
}
