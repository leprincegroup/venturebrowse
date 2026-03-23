import AreaChart from "../common/charts/AreaChart";
import { computeBrandScore, scoreColor, scoreLabel } from "../../lib/brandScore";

const STATUS_LABEL = {
  "looking-to-sell": "Looking to sell", "growth-stalled": "Growth stalled",
  "open-to-consulting": "Open to consulting", "growing": "Growing",
};

export default function DealCard({ brand, onSelect }) {
  const trafficDown = brand.trafficTrend && brand.trafficTrend[0] > brand.trafficTrend[brand.trafficTrend.length - 1];
  const trafficColor = trafficDown ? "var(--r)" : "var(--g)";
  const isClaimed = brand.verification === "claimed" || brand.verification === "verified";
  const activeAds = brand.advertising?.activeAds || 0;
  const lastTraffic = brand.trafficTrend?.[brand.trafficTrend.length - 1];
  const trustpilot = brand.customerVoice?.trustpilotRating;
  const topOpp = brand.whiteSpace?.[0];
  const score = computeBrandScore(brand);

  return (
    <div className="z-card" onClick={() => onSelect(brand)} style={{ gap: 16 }}>
      {/* Top row — identity + score */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center", flex: 1, minWidth: 0 }}>
          <div className="z-brand-avatar" style={{ overflow: "hidden", width: 48, height: 48, flexShrink: 0 }}>
            {brand.logoUrl
              ? <img src={brand.logoUrl} alt={brand.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={e => { e.target.style.display = "none"; e.target.parentNode.textContent = brand.logo; }} />
              : brand.logo
            }
          </div>
          <div>
            <div className="z-brand-name" style={{ fontSize: 20 }}>{brand.name}</div>
            <div className="z-brand-meta">{brand.category} &middot; {brand.hq.split(",")[0]} &middot; Est. {brand.founded}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
            <span style={{ fontSize: 28, fontWeight: 500, color: scoreColor(score.overall), letterSpacing: "-.03em", lineHeight: 1 }}>{score.overall}</span>
            <span style={{ fontSize: 10, color: "var(--ink4)" }}>/100</span>
          </div>
          <span style={{ fontSize: 10, color: scoreColor(score.overall), fontWeight: 500 }}>{scoreLabel(score.overall)}</span>
        </div>
      </div>

      {/* Thesis — the TLDR */}
      {brand.summary && (
        <p style={{ fontSize: 14, color: "var(--ink2)", lineHeight: 1.7, fontWeight: 400 }}>
          {brand.summary}
        </p>
      )}

      {/* Traffic chart */}
      {brand.trafficTrend && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "var(--ink4)" }}>Web traffic (12mo)</span>
            <span style={{ fontSize: 11, color: "var(--ink4)" }}>{STATUS_LABEL[brand.status]}</span>
          </div>
          <div style={{ margin: "0 -12px" }}>
            <AreaChart data={brand.trafficTrend} color={trafficColor} w={500} h={80} filled={true} />
          </div>
        </div>
      )}

      {/* Key metrics */}
      <div className="z-metrics">
        <div className="z-metric">
          <span className="z-metric-v">{lastTraffic ? `${lastTraffic}K` : "\u2014"}</span>
          <span className="z-metric-l">traffic/mo</span>
        </div>
        <div className="z-metric">
          <span className="z-metric-v">{brand.employees}</span>
          <span className="z-metric-l">team</span>
        </div>
        <div className="z-metric">
          <span className="z-metric-v">{activeAds}</span>
          <span className="z-metric-l">ads live</span>
        </div>
        <div className="z-metric">
          <span className="z-metric-v">{brand.verifiedRevenue ? brand.verifiedRevenue.replace(" ARR", "") : "\u2014"}</span>
          <span className="z-metric-l">revenue</span>
        </div>
        {trustpilot && (
          <div className="z-metric">
            <span className="z-metric-v">{trustpilot}/5</span>
            <span className="z-metric-l">trustpilot</span>
          </div>
        )}
      </div>

      {/* Top opportunity */}
      {topOpp && (
        <div style={{ padding: "12px 16px", background: "var(--off)", border: "1px solid var(--bd)" }}>
          <div style={{ fontSize: 11, color: "var(--ink4)", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".04em" }}>Top opportunity</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)", marginBottom: 2 }}>{topOpp.opportunity}</div>
          <div style={{ fontSize: 13, color: "var(--ink3)", lineHeight: 1.5 }}>{topOpp.description?.length > 100 ? topOpp.description.slice(0, 100) + "..." : topOpp.description}</div>
          <div className="z-mini-stats" style={{ marginTop: 6 }}>
            <span className="z-ms">{topOpp.timeframe}</span>
            <span className="z-ms">{topOpp.impact} impact</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="z-card-footer"><span>Deep dive</span><span className="z-arrow">&rarr;</span></div>
    </div>
  );
}
