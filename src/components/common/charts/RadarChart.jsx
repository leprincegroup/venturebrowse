export default function RadarChart({ axes, size = 140, color = "var(--ink)" }) {
  // axes: [{label, value (0-10)}]
  if (!axes || axes.length < 3) return null;
  const cx = size / 2, cy = size / 2;
  const r = (size - 36) / 2;
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

  // Label positions
  const labels = axes.map((a, i) => {
    const [lx, ly] = point(i, 12.5);
    return { ...a, x: lx, y: ly };
  });

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
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
          <text key={i} x={l.x} y={l.y} textAnchor="middle" dominantBaseline="middle"
            fontSize="8" fontFamily="var(--mono)" fill="var(--ink3)" fontWeight="500">
            {l.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
