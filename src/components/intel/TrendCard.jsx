import AreaChart from "../common/charts/AreaChart";

const SRC_LABELS = { reddit: "Reddit", tiktok: "TikTok", amazon: "Amazon", google: "Google", instagram: "Instagram" };

export default function TrendCard({ trend, onSelect }) {
  const gc = trend.growth >= 200 ? "var(--g)" : trend.growth >= 100 ? "var(--a)" : "var(--ink3)";
  return (
    <div className="z-card" onClick={() => onSelect?.(trend)}>
      <div className="z-card-header">
        <span className="z-badge">{trend.category}</span>
        {trend.isBreaking && <span className="z-tag z-tag-r">Breaking</span>}
      </div>
      <div className="z-trend-top">
        <h3 className="z-card-title" style={{ margin: 0, flex: 1 }}>{trend.keyword}</h3>
        <span className="z-trend-pct" style={{ color: gc }}>+{trend.growth}%</span>
      </div>
      <div className="z-chart-area">
        <AreaChart data={trend.sparkData} color={gc} w={320} h={80} filled={true} />
      </div>
      <div className="z-mini-stats">
        <span className="z-ms">{trend.volume >= 1e6 ? (trend.volume / 1e6).toFixed(1) + "M" : (trend.volume / 1000).toFixed(0) + "K"} searches/mo</span>
        <span className="z-ms">{trend.sentiment}/10 sentiment</span>
      </div>
      <p className="z-card-desc">{trend.summary.length > 120 ? trend.summary.slice(0, 120) + "..." : trend.summary}</p>
      {trend.signals[0] && (
        <div className="z-signal-row">
          <span className="z-signal-src">{trend.signals[0].platform}</span>
          <span className="z-signal-text">{trend.signals[0].text.length > 80 ? trend.signals[0].text.slice(0, 80) + "..." : trend.signals[0].text}</span>
        </div>
      )}
      <div className="z-card-footer"><span>Explore</span><span className="z-arrow">&rarr;</span></div>
    </div>
  );
}
