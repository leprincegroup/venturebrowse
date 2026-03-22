import { useState } from "react";

/**
 * AnalyticalChart — Full analytical line/area chart with:
 * - X/Y axis labels with grid lines
 * - Multiple data series with legend
 * - Data point markers with hover tooltips
 * - Min/max/avg annotations
 * - Responsive width
 *
 * Props:
 *   series: [{ name, data: [numbers], color }]  — one or more data series
 *   xLabels: [strings]  — labels for X axis
 *   yLabel: string — Y axis label
 *   height: number — chart height (default 200)
 *   showArea: boolean — fill area under lines
 *   showGrid: boolean — show grid lines
 *   showDots: boolean — show data point markers
 *   showLegend: boolean — show legend
 *   showMinMax: boolean — show min/max annotations
 *   formatValue: (v) => string — format tooltip values
 */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AnalyticalChart({
  series = [], xLabels, yLabel = "", height = 200,
  showArea = true, showGrid = true, showDots = true,
  showLegend = true, showMinMax = false, formatValue,
}) {
  const [hover, setHover] = useState(null); // { seriesIdx, pointIdx, x, y, value }

  if (!series.length || !series[0].data?.length) return null;

  const padL = 48, padR = 16, padT = 16, padB = 36;
  const w = 520;
  const plotW = w - padL - padR;
  const plotH = height - padT - padB;
  const n = series[0].data.length;

  // Compute global min/max across all series
  const allVals = series.flatMap(s => s.data);
  const globalMin = Math.min(...allVals);
  const globalMax = Math.max(...allVals);
  const range = globalMax - globalMin || 1;
  const niceMin = Math.floor(globalMin / 10) * 10;
  const niceMax = Math.ceil(globalMax / 10) * 10;
  const niceRange = niceMax - niceMin || 1;

  // Y axis ticks (5 ticks)
  const yTicks = Array.from({ length: 5 }, (_, i) => niceMin + (niceRange / 4) * i);

  function px(i) { return padL + (i / (n - 1)) * plotW; }
  function py(v) { return padT + plotH - ((v - niceMin) / niceRange) * plotH; }

  const labels = xLabels || MONTHS.slice(0, n);
  const fmt = formatValue || (v => typeof v === "number" ? v.toLocaleString() : v);

  return (
    <div className="ac-wrap">
      <svg
        viewBox={`0 0 ${w} ${height}`}
        className="ac-svg"
        onMouseLeave={() => setHover(null)}
      >
        {/* Grid lines */}
        {showGrid && yTicks.map((t, i) => (
          <g key={i}>
            <line x1={padL} y1={py(t)} x2={w - padR} y2={py(t)} stroke="var(--bd)" strokeWidth="0.5" strokeDasharray={i === 0 ? "0" : "3,3"} />
            <text x={padL - 8} y={py(t) + 3} textAnchor="end" fontSize="9" fontFamily="var(--mono)" fill="var(--ink4)">{fmt(t)}</text>
          </g>
        ))}

        {/* X axis labels */}
        {labels.map((l, i) => {
          if (n > 12 && i % 2 !== 0) return null;
          return (
            <text key={i} x={px(i)} y={height - 8} textAnchor="middle" fontSize="9" fontFamily="var(--mono)" fill="var(--ink4)">{l}</text>
          );
        })}

        {/* Y axis label */}
        {yLabel && (
          <text x={12} y={padT + plotH / 2} textAnchor="middle" fontSize="9" fontFamily="var(--mono)" fill="var(--ink4)" transform={`rotate(-90, 12, ${padT + plotH / 2})`}>{yLabel}</text>
        )}

        {/* Series */}
        {series.map((s, si) => {
          const pts = s.data.map((v, i) => [px(i), py(v)]);
          const line = pts.map((p, i) => (i === 0 ? "M" : "L") + p[0] + "," + p[1]).join(" ");
          const area = line + ` L${pts[pts.length - 1][0]},${padT + plotH} L${pts[0][0]},${padT + plotH} Z`;

          return (
            <g key={si}>
              {showArea && <path d={area} fill={s.color || "var(--ink)"} fillOpacity="0.08" />}
              <path d={line} fill="none" stroke={s.color || "var(--ink)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {showDots && pts.map(([dx, dy], di) => (
                <circle
                  key={di} cx={dx} cy={dy} r={hover?.seriesIdx === si && hover?.pointIdx === di ? 5 : 2.5}
                  fill={s.color || "var(--ink)"} stroke="var(--w)" strokeWidth="1.5"
                  style={{ cursor: "pointer", transition: "r 0.15s" }}
                  onMouseEnter={() => setHover({ seriesIdx: si, pointIdx: di, x: dx, y: dy, value: s.data[di] })}
                />
              ))}
              {/* Min/Max markers */}
              {showMinMax && (() => {
                const minI = s.data.indexOf(Math.min(...s.data));
                const maxI = s.data.indexOf(Math.max(...s.data));
                return (
                  <>
                    <text x={px(minI)} y={py(s.data[minI]) + 14} textAnchor="middle" fontSize="8" fontFamily="var(--mono)" fill="var(--r)" fontWeight="600">min {fmt(s.data[minI])}</text>
                    <text x={px(maxI)} y={py(s.data[maxI]) - 8} textAnchor="middle" fontSize="8" fontFamily="var(--mono)" fill="var(--g)" fontWeight="600">max {fmt(s.data[maxI])}</text>
                  </>
                );
              })()}
            </g>
          );
        })}

        {/* Hover tooltip */}
        {hover && (
          <g>
            <line x1={hover.x} y1={padT} x2={hover.x} y2={padT + plotH} stroke="var(--ink4)" strokeWidth="0.5" strokeDasharray="3,3" />
            <rect x={hover.x - 40} y={hover.y - 28} width="80" height="22" rx="4" fill="var(--ink)" opacity="0.9" />
            <text x={hover.x} y={hover.y - 14} textAnchor="middle" fontSize="10" fontFamily="var(--mono)" fill="#fff" fontWeight="600">
              {series[hover.seriesIdx]?.name ? `${series[hover.seriesIdx].name}: ` : ""}{fmt(hover.value)}
            </text>
          </g>
        )}
      </svg>

      {/* Legend */}
      {showLegend && series.length > 1 && (
        <div className="ac-legend">
          {series.map((s, i) => (
            <div className="ac-leg-item" key={i}>
              <span className="ac-leg-dot" style={{ background: s.color || "var(--ink)" }} />
              <span className="ac-leg-name">{s.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
