import { useId } from "react";

const RH_GREEN = "#34c759";
const RH_RED = "#ff3b30";

export default function Sparkline({ data, color, w = 80, h = 24, filled = false }) {
  if (!data || data.length < 2) return null;
  const uid = useId().replace(/:/g, "");
  const mn = Math.min(...data), mx = Math.max(...data), r = mx - mn || 1;
  const pad = 2;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - pad - ((v - mn) / r) * (h - pad * 2)]);
  const d = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0] + "," + p[1]).join(" ");
  const area = d + ` L${w},${h} L0,${h} Z`;
  const [lx, ly] = pts[pts.length - 1];
  const c = color === "var(--g)" ? RH_GREEN : color === "var(--r)" ? RH_RED : color || (data[data.length - 1] >= data[0] ? RH_GREEN : RH_RED);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="spark" style={{ overflow: "visible" }}>
      {filled && (
        <defs>
          <linearGradient id={`sg-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c} stopOpacity="0.2" />
            <stop offset="100%" stopColor={c} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      {filled && <path d={area} fill={`url(#sg-${uid})`} />}
      <path d={d} fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="2.5" fill={c} />
    </svg>
  );
}
