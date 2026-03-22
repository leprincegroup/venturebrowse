import AreaChart from "../common/charts/AreaChart";

const SRC_LABELS = { reddit: "Reddit", tiktok: "TikTok", amazon: "Amazon", google: "Google", instagram: "Instagram" };
const SRC_COLORS = { reddit: "#FF4500", tiktok: "#0d0d0b", amazon: "#FF9900", google: "#4285F4", instagram: "#E1306C" };

export default function TrendCard({ trend, onSelect }) {
  const gc = trend.growth >= 200 ? "var(--g)" : trend.growth >= 100 ? "var(--a)" : "var(--ink3)";
  return (
    <div className="intel-card" onClick={() => onSelect?.(trend)}>
      <div className="intel-top">
        <div style={{ flex: 1 }}>
          {trend.isBreaking && <span className="intel-breaking">Breaking</span>}
          <div className="intel-keyword">{trend.keyword}</div>
          <div className="intel-cat">{trend.category}</div>
        </div>
        <div className="intel-growth" style={{ color: gc }}>+{trend.growth}%</div>
      </div>

      <div className="intel-chart">
        <AreaChart data={trend.sparkData} color={gc} w={320} h={56} filled={true} />
      </div>

      <p className="intel-summary">{trend.summary}</p>

      <div className="intel-signals">
        {trend.signals.map((s, i) => (
          <div className="intel-sig" key={i}>
            <span className="intel-sig-src" style={{ color: SRC_COLORS[s.platform] }}>{SRC_LABELS[s.platform]}</span>
            <span className="intel-sig-text">{s.text.length > 80 ? s.text.slice(0, 80) + "…" : s.text}</span>
          </div>
        ))}
      </div>

      <div className="cmetrics">
        <div className="cmet">
          <div className="cml">Search Vol</div>
          <div className="cmv">{trend.volume >= 1000000 ? (trend.volume / 1000000).toFixed(1) + "M" : (trend.volume / 1000).toFixed(0) + "K"}</div>
        </div>
        <div className="cmet">
          <div className="cml">Growth</div>
          <div className="cmv" style={{ color: gc }}>+{trend.growth}%</div>
        </div>
        <div className="cmet">
          <div className="cml">Source</div>
          <div className="cmv" style={{ textTransform: "capitalize" }}>{SRC_LABELS[trend.source]}</div>
        </div>
      </div>
    </div>
  );
}
