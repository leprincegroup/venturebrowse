export default function GaugeChart({ value, max = 100, size = 80, strokeWidth = 8, label, color }) {
  const r = (size - strokeWidth) / 2;
  const cx = size / 2, cy = size / 2;
  const circumference = Math.PI * r; // half circle
  const pct = Math.min(Math.max(value / max, 0), 1);
  const dashLen = pct * circumference;
  const autoColor = value / max >= 0.7 ? "var(--r)" : value / max >= 0.4 ? "var(--a)" : "var(--g)";
  const fillColor = color || autoColor;

  return (
    <div style={{ position: "relative", width: size, height: size * 0.6, flexShrink: 0 }}>
      <svg width={size} height={size * 0.6} viewBox={`0 0 ${size} ${size * 0.6}`}>
        {/* background arc */}
        <path
          d={`M ${strokeWidth / 2} ${cy} A ${r} ${r} 0 0 1 ${size - strokeWidth / 2} ${cy}`}
          fill="none" stroke="var(--bd)" strokeWidth={strokeWidth} strokeLinecap="round"
        />
        {/* filled arc */}
        <path
          d={`M ${strokeWidth / 2} ${cy} A ${r} ${r} 0 0 1 ${size - strokeWidth / 2} ${cy}`}
          fill="none" stroke={fillColor} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={`${dashLen} ${circumference}`}
          style={{ transition: "stroke-dasharray 0.8s cubic-bezier(.22,1,.36,1)" }}
        />
      </svg>
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, textAlign: "center",
      }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: size > 60 ? 18 : 14, fontWeight: 700, color: fillColor, lineHeight: 1 }}>{value}</div>
        {label && <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--ink4)", letterSpacing: ".08em", textTransform: "uppercase", marginTop: 2 }}>{label}</div>}
      </div>
    </div>
  );
}
