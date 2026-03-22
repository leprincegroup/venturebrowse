export default function RadarChart({ axes, size = 140, color = "var(--ink)" }) {
  // axes: [{label, value (0-10)}]
  if (!axes || axes.length < 3) return null;
  const pad = 32; // padding for labels
  const vbSize = size + pad * 2;
  const cx = vbSize / 2, cy = vbSize / 2;
  const r = (size - 24) / 2;
  const n = axes.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  function point(i, val) {
    const a = startAngle + i * angleStep;
    const d = (val / 10) * r;
    return [cx + d * Math.cos(a), cy + d * Math.sin(a)];
  }

  // Grid rings
  const rings = [2, 4, 6, 8, 10];
  const gridLines = rings.map(rv => {
    const pts = axes.map((_, i) => point(i, rv));
    return pts.map(p => p.join(",")).join(" ");
  });

  // Data polygon
  const dataPts = axes.map((a, i) => point(i, a.value));
  const dataPath = dataPts.map(p => p.join(",")).join(" ");

  // Axis lines
  const axisLines = axes.map((_, i) => point(i, 10));

  // Label positions — pushed further out with text anchoring
  const labels = axes.map((a, i) => {
    const ang = startAngle + i * angleStep;
    const d = r + 18;
    const lx = cx + d * Math.cos(ang);
    const ly = cy + d * Math.sin(ang);
    const anchor = Math.abs(Math.cos(ang)) < 0.1 ? "middle" : Math.cos(ang) > 0 ? "start" : "end";
    return { ...a, x: lx, y: ly, anchor };
  });

  return (
    <div style={{ width: "100%", maxWidth: size + pad, margin: "0 auto", flexShrink: 0 }}>
      <svg width="100%" viewBox={`0 0 ${vbSize} ${vbSize}`} style={{ overflow: "visible" }}>
        {/* Grid */}
        {gridLines.map((pts, i) => (
          <polygon key={i} points={pts} fill="none" stroke="var(--bd)" strokeWidth={i === 4 ? "1" : "0.5"} opacity={0.6} />
        ))}
        {/* Axes */}
        {axisLines.map(([ax, ay], i) => (
          <line key={i} x1={cx} y1={cy} x2={ax} y2={ay} stroke="var(--bd)" strokeWidth="0.5" />
        ))}
        {/* Data fill */}
        <polygon points={dataPath} fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        {/* Data dots */}
        {dataPts.map(([dx, dy], i) => (
          <circle key={i} cx={dx} cy={dy} r="3" fill={color} />
        ))}
        {/* Labels */}
        {labels.map((l, i) => (
          <text key={i} x={l.x} y={l.y} textAnchor={l.anchor} dominantBaseline="middle"
            fontSize="10" fontFamily="var(--mono)" fill="var(--ink2)" fontWeight="600">
            {l.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
