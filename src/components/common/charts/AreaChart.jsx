import { useId } from "react";

const RH_GREEN = "#34c759";
const RH_RED = "#ff3b30";

export default function AreaChart({ data, color, w = 120, h = 40, filled = true }) {
  if (!data || data.length < 2) return null;
  const uid = useId().replace(/:/g, "");
  const mn = Math.min(...data), mx = Math.max(...data), r = mx - mn || 1;
  const pad = 2;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - pad - ((v - mn) / r) * (h - pad * 2),
  ]);
  const line = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0] + "," + p[1]).join(" ");
  const area = line + ` L${w},${h} L0,${h} Z`;
  const [lx, ly] = pts[pts.length - 1];

  // Auto color: green if trending up, red if down
  const autoColor = data[data.length - 1] >= data[0] ? RH_GREEN : RH_RED;
  const c = color === "var(--g)" ? RH_GREEN : color === "var(--r)" ? RH_RED : color || autoColor;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible", display: "block" }}>
      {filled && (
        <defs>
          <linearGradient id={`ag-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c} stopOpacity="0.22" />
            <stop offset="60%" stopColor={c} stopOpacity="0.06" />
            <stop offset="100%" stopColor={c} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      {filled && <path d={area} fill={`url(#ag-${uid})`} />}
      <path d={line} fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lx} cy={ly} r="3" fill={c} stroke="#fff" strokeWidth="1.5" />
    </svg>
  );
}
