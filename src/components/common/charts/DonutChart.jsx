export default function DonutChart({ segments, size = 64, strokeWidth = 8, label, sublabel }) {
  if (!segments || !segments.length) return null;
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return null;

  const r = (size - strokeWidth) / 2;
  const cx = size / 2, cy = size / 2;
  const circumference = 2 * Math.PI * r;
  let offset = -circumference / 4; // start at top

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* background ring */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--bd)" strokeWidth={strokeWidth} />
        {segments.map((seg, i) => {
          const pct = seg.value / total;
          const dashLen = pct * circumference;
          const dashGap = circumference - dashLen;
          const el = (
            <circle
              key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={seg.color} strokeWidth={strokeWidth}
              strokeDasharray={`${dashLen} ${dashGap}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.6s ease" }}
            />
          );
          offset += dashLen;
          return el;
        })}
      </svg>
      {label && (
        <div style={{
          position: "absolute", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", pointerEvents: "none",
        }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: size > 56 ? 14 : 11, fontWeight: 600, color: "var(--ink)", lineHeight: 1 }}>{label}</span>
          {sublabel && <span style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--ink4)", marginTop: 2, letterSpacing: ".06em", textTransform: "uppercase" }}>{sublabel}</span>}
        </div>
      )}
    </div>
  );
}
