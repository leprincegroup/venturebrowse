import { useId, useState, useRef, useCallback } from "react";

const RH_GREEN = "#34c759";
const RH_RED = "#ff3b30";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AreaChart({ data, color, w = 120, h = 40, filled = true, interactive = false, labels }) {
  if (!data || data.length < 2) return null;
  const uid = useId().replace(/:/g, "");
  const svgRef = useRef(null);
  const [hover, setHover] = useState(null);

  const mn = Math.min(...data), mx = Math.max(...data), r = mx - mn || 1;
  const pad = 2;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * w,
    h - pad - ((v - mn) / r) * (h - pad * 2),
  ]);
  const line = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0] + "," + p[1]).join(" ");
  const area = line + ` L${w},${h} L0,${h} Z`;
  const [lx, ly] = pts[pts.length - 1];

  const autoColor = data[data.length - 1] >= data[0] ? RH_GREEN : RH_RED;
  const c = color === "var(--g)" ? RH_GREEN : color === "var(--r)" ? RH_RED : color || autoColor;

  const handleMove = useCallback((e) => {
    if (!interactive || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    const idx = Math.round(ratio * (data.length - 1));
    setHover(idx);
  }, [interactive, data.length]);

  const handleLeave = useCallback(() => setHover(null), []);

  const hoverPt = hover !== null ? pts[hover] : null;
  const hoverVal = hover !== null ? data[hover] : null;
  const hoverLabel = hover !== null ? (labels ? labels[hover] : MONTHS[hover % 12]) : null;

  return (
    <svg
      ref={svgRef}
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ overflow: "visible", display: "block", cursor: interactive ? "crosshair" : undefined }}
      onMouseMove={interactive ? handleMove : undefined}
      onMouseLeave={interactive ? handleLeave : undefined}
    >
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

      {/* Hover state */}
      {hoverPt && (
        <>
          <line x1={hoverPt[0]} y1={0} x2={hoverPt[0]} y2={h} stroke={c} strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
          <circle cx={hoverPt[0]} cy={hoverPt[1]} r="4" fill={c} stroke="#fff" strokeWidth="2" />
          <rect x={hoverPt[0] - 32} y={Math.max(0, hoverPt[1] - 32)} width="64" height="22" rx="3" fill="var(--ink, #1d1d1f)" opacity="0.9" />
          <text x={hoverPt[0]} y={Math.max(14, hoverPt[1] - 17)} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="500" fontFamily="system-ui">
            {hoverLabel} {hoverVal >= 1000 ? (hoverVal / 1000).toFixed(0) + "K" : hoverVal}
          </text>
        </>
      )}

      {/* End dot (hidden during hover) */}
      {!hoverPt && <circle cx={lx} cy={ly} r="3" fill={c} stroke="#fff" strokeWidth="1.5" />}
    </svg>
  );
}
