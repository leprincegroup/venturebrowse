import AreaChart from "../common/charts/AreaChart";
import RadarChart from "../common/charts/RadarChart";
import DonutChart from "../common/charts/DonutChart";

function daysSince(dateStr) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}
function formatAgo(dateStr) {
  const d = daysSince(dateStr);
  if (d === 0) return "today";
  if (d === 1) return "yesterday";
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

const STATUS_LABEL = {
  "looking-to-sell": "Looking to Sell", "growth-stalled": "Growth Stalled",
  "open-to-consulting": "Open to Consulting", "growing": "Growing",
};
const STATUS_CLASS = {
  "looking-to-sell": "ta", "growth-stalled": "tr", "open-to-consulting": "tb", "growing": "tg",
};

function buildRadar(brand) {
  // Build radar from publicly available signals
  const trafficDir = brand.trafficTrend ? (brand.trafficTrend[brand.trafficTrend.length - 1] / brand.trafficTrend[0]) * 10 : 5;
  const searchDir = brand.searchInterest ? (brand.searchInterest[brand.searchInterest.length - 1] / brand.searchInterest[0]) * 10 : 5;
  const social = brand.socialFollowing?.instagram ? (parseInt(brand.socialFollowing.instagram) >= 1000 ? 8 : parseInt(brand.socialFollowing.instagram) >= 500 ? 6 : 4) : 3;
  const gaps = Math.max(0, 10 - brand.gaps.length * 2);
  const opps = Math.min(10, brand.whiteSpace.length * 2.5);
  const reviews = brand.customerVoice?.trustpilotRating ? brand.customerVoice.trustpilotRating * 2 : 5;

  return [
    { label: "Traffic", value: Math.min(10, Math.max(1, Math.round(trafficDir * 10) / 10)) },
    { label: "Social", value: social },
    { label: "Reviews", value: Math.round(reviews * 10) / 10 },
    { label: "Operations", value: Math.round(gaps * 10) / 10 },
    { label: "Opportunity", value: Math.round(opps * 10) / 10 },
    { label: "Search", value: Math.min(10, Math.max(1, Math.round(searchDir * 10) / 10)) },
  ];
}

export default function DealCard({ brand, watched, onSelect, onToggleWatch }) {
  const trafficDown = brand.trafficTrend && brand.trafficTrend[0] > brand.trafficTrend[brand.trafficTrend.length - 1];
  const trafficColor = trafficDown ? "var(--r)" : "var(--g)";
  const radar = buildRadar(brand);

  const channelSegments = Object.entries(brand.channels || {}).map(([k, v]) => ({
    value: v,
    color: k === "dtc" ? brand.brandColor : k === "retail" ? "var(--a)" : k === "amazon" ? "#FF9900" : k === "foodservice" ? "var(--b)" : "var(--ink4)",
  }));

  return (
    <div className="dc3" onClick={() => onSelect(brand)}>
      {/* Branded Top Bar */}
      <div className="dc3-bar" style={{ background: brand.bgGradient || brand.brandColor }}>
        <div className="dc3-bar-left">
          <div className="dc2-logo" style={{ borderColor: "rgba(255,255,255,.3)", width: 36, height: 36, fontSize: 12 }}>{brand.logo}</div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span className="dc3-name">{brand.name}</span>
              {brand.verification === "verified" && <span className="vb-badge verified">✓</span>}
              {brand.verification === "claimed" && <span className="vb-badge claimed">C</span>}
            </div>
            <div className="dc3-cat">{brand.category}</div>
          </div>
        </div>
        <button className={`dc2-wl${watched ? " on" : ""}`} onClick={e => { e.stopPropagation(); onToggleWatch(brand.id); }}>
          {watched ? "♥" : "♡"}
        </button>
      </div>

      {/* Visual Hero — Radar + Key Stats */}
      <div className="dc3-visual">
        <RadarChart axes={radar} size={150} color={brand.brandColor} />
        <div className="dc3-stats">
          <div className="dc3-stat"><span className="dc3-sv">{brand.employees}</span><span className="dc3-sl">Team</span></div>
          <div className="dc3-stat"><span className="dc3-sv">{brand.founded}</span><span className="dc3-sl">Founded</span></div>
          <div className="dc3-stat"><span className="dc3-sv">{brand.socialFollowing?.instagram || "—"}</span><span className="dc3-sl">Instagram</span></div>
          {brand.verifiedRevenue && <div className="dc3-stat"><span className="dc3-sv" style={{ color: "var(--g)" }}>{brand.verifiedRevenue}</span><span className="dc3-sl">Revenue ✓</span></div>}
          <div className="dc3-stat"><span className="dc3-sv">{brand.customerVoice?.trustpilotRating || "—"}/5</span><span className="dc3-sl">Trustpilot</span></div>
          <div className="dc3-stat"><span className="dc3-sv">{brand.customerVoice?.reviewCount?.toLocaleString() || "—"}</span><span className="dc3-sl">Reviews</span></div>
        </div>
      </div>

      {/* Traffic + Channels Row */}
      <div className="dc3-charts-row">
        <div className="dc3-chart-box">
          <span className="dc3-chart-label">Web Traffic (12mo)</span>
          {brand.trafficTrend && <AreaChart data={brand.trafficTrend} color={trafficColor} w={160} h={44} filled={true} />}
          <span className="dc3-chart-val" style={{ color: trafficColor }}>{brand.trafficTrend?.[brand.trafficTrend.length - 1]}K/mo</span>
        </div>
        <div className="dc3-chart-box">
          <span className="dc3-chart-label">Channels</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <DonutChart segments={channelSegments} size={40} strokeWidth={5} />
            <div className="dc3-ch-list">
              {Object.entries(brand.channels || {}).map(([k, v]) => (
                <span key={k} className="dc3-ch">{k} {v}%</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status + Signals summary */}
      <div className="dc3-info">
        <span className={`tag ${STATUS_CLASS[brand.status]}`}>{STATUS_LABEL[brand.status]}</span>
        <div className="dc3-flags">
          {brand.redFlags && <span className="dc3-flag red">{brand.redFlags.length} red flags</span>}
          {brand.greenFlags && <span className="dc3-flag green">{brand.greenFlags.length} green flags</span>}
        </div>
      </div>

      {/* One-line summary */}
      <div className="dc3-summary">
        {brand.summary.length > 100 ? brand.summary.slice(0, 100) + "…" : brand.summary}
      </div>

      {/* Footer */}
      <div className="dc3-footer">
        <span>{brand.hq}</span>
        <span>{brand.website}</span>
        {brand.lastActivity && (
          <span className={`dc3-activity ${daysSince(brand.lastActivity) <= 7 ? "recent" : daysSince(brand.lastActivity) <= 30 ? "moderate" : "stale"}`}>
            Active {formatAgo(brand.lastActivity)}
          </span>
        )}
      </div>
    </div>
  );
}
