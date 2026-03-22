import { useState, useId } from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Robinhood-style colors
const RH_GREEN = "#00C805";
const RH_RED = "#FF5000";

export default function AnalyticalChart({
  series = [], xLabels, yLabel = "", height = 200,
  showArea = true, showGrid = true, showDots = false,
  showLegend = true, showMinMax = false, formatValue,
}) {
  const [hover, setHover] = useState(null);
  const uid = useId().replace(/:/g, "");

  if (!series.length || !series[0].data?.length) return null;

  const padL = 52, padR = 16, padT = 20, padB = 28;
  const w = 520;
  const plotW = w - padL - padR;
  const plotH = height - padT - padB;
  const n = series[0].data.length;

  const allVals = series.flatMap(s => s.data);
  const globalMin = Math.min(...allVals);
  const globalMax = Math.max(...allVals);
  const niceMin = Math.floor(globalMin * 0.95);
  const niceMax = Math.ceil(globalMax * 1.05);
  const niceRange = niceMax - niceMin || 1;

  const yTicks = Array.from({ length: 5 }, (_, i) => Math.round(niceMin + (niceRange / 4) * i));

  function px(i) { return padL + (i / (n - 1)) * plotW; }
  function py(v) { return padT + plotH - ((v - niceMin) / niceRange) * plotH; }

  const labels = xLabels || MONTHS.slice(0, n);
  const fmt = formatValue || (v => typeof v === "number" ? v.toLocaleString() : v);

  // Determine if each series is trending up or down for color
  function seriesColor(s, i) {
    if (s.color === "var(--r)" || s.color === "var(--g)") {
      return s.color === "var(--r)" ? RH_RED : RH_GREEN;
    }
    if (s.color) return s.color;
    const first = s.data[0], last = s.data[s.data.length - 1];
    return last >= first ? RH_GREEN : RH_RED;
  }

  return (
    <div className="ac-wrap">
      <svg viewBox={`0 0 ${w} ${height}`} className="ac-svg" onMouseLeave={() => setHover(null)}>
        {/* Grid — subtle horizontal lines only */}
        {showGrid && yTicks.map((t, i) => (
          <g key={i}>
            <line x1={padL} y1={py(t)} x2={w - padR} y2={py(t)} stroke="#e4e4e7" strokeWidth="0.5" />
            <text x={padL - 8} y={py(t) + 3} textAnchor="end" fontSize="9" fontFamily="var(--mono)" fill="#a1a1aa" fontWeight="500">{fmt(t)}</text>
          </g>
        ))}

        {/* X axis labels — sparse */}
        {labels.map((l, i) => {
          if (n > 8 && i % 2 !== 0 && i !== n - 1) return null;
          return (
            <text key={i} x={px(i)} y={height - 4} textAnchor="middle" fontSize="9" fontFamily="var(--mono)" fill="#a1a1aa" fontWeight="500">{l}</text>
          );
        })}

        {/* Y axis label */}
        {yLabel && (
          <text x={10} y={padT + plotH / 2} textAnchor="middle" fontSize="8" fontFamily="var(--mono)" fill="#a1a1aa" fontWeight="500" transform={`rotate(-90, 10, ${padT + plotH / 2})`}>{yLabel}</text>
        )}

        {/* Series */}
        {series.map((s, si) => {
          const color = seriesColor(s, si);
          const pts = s.data.map((v, i) => [px(i), py(v)]);
          const line = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0] + "," + p[1]).join(" ");
          const area = line + ` L${pts[pts.length - 1][0]},${padT + plotH} L${pts[0][0]},${padT + plotH} Z`;

          return (
            <g key={si}>
              {/* Gradient fill — Robinhood style */}
              {showArea && (
                <>
                  <defs>
                    <linearGradient id={`rh-${uid}-${si}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                      <stop offset="60%" stopColor={color} stopOpacity="0.08" />
                      <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={area} fill={`url(#rh-${uid}-${si})`} />
                </>
              )}
              {/* Line — thick, smooth */}
              <path d={line} fill="none" stroke={color} strokeWidth={series.length > 1 ? "2" : "2.5"} strokeLinecap="round" strokeLinejoin="round" />
              {/* End dot only */}
              {showDots ? (
                pts.map(([dx, dy], di) => (
                  <circle key={di} cx={dx} cy={dy} r={hover?.seriesIdx === si && hover?.pointIdx === di ? 5 : 2}
                    fill={color} stroke="#fff" strokeWidth="1.5"
                    style={{ cursor: "pointer", transition: "r 0.1s" }}
                    onMouseEnter={() => setHover({ seriesIdx: si, pointIdx: di, x: dx, y: dy, value: s.data[di] })}
                  />
                ))
              ) : (
                <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3.5" fill={color} stroke="#fff" strokeWidth="2" />
              )}
              {/* Min/Max labels */}
              {showMinMax && (() => {
                const minI = s.data.indexOf(Math.min(...s.data));
                const maxI = s.data.indexOf(Math.max(...s.data));
                return (
                  <>
                    <text x={px(minI)} y={py(s.data[minI]) + 14} textAnchor="middle" fontSize="8" fontFamily="var(--mono)" fill={RH_RED} fontWeight="700">min {fmt(s.data[minI])}</text>
                    <text x={px(maxI)} y={py(s.data[maxI]) - 8} textAnchor="middle" fontSize="8" fontFamily="var(--mono)" fill={RH_GREEN} fontWeight="700">max {fmt(s.data[maxI])}</text>
                  </>
                );
              })()}
            </g>
          );
        })}

        {/* Hover crosshair + tooltip */}
        {hover && (
          <g>
            <line x1={hover.x} y1={padT} x2={hover.x} y2={padT + plotH} stroke="#52525b" strokeWidth="1" />
            <circle cx={hover.x} cy={hover.y} r="5" fill={seriesColor(series[hover.seriesIdx], hover.seriesIdx)} stroke="#fff" strokeWidth="2" />
            <rect x={hover.x - 44} y={hover.y - 30} width="88" height="22" rx="0" fill="#09090b" />
            <text x={hover.x} y={hover.y - 16} textAnchor="middle" fontSize="10" fontFamily="var(--mono)" fill="#fff" fontWeight="600">
              {fmt(hover.value)}
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      {showLegend && series.length > 1 && (
        <div className="ac-legend">
          {series.map((s, i) => (
            <div className="ac-leg-item" key={i}>
              <span className="ac-leg-dot" style={{ background: seriesColor(s, i) }} />
              <span className="ac-leg-name">{s.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
