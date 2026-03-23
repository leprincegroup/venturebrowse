import { IDEA_CATEGORIES } from "../../data";

const SEV_COLOR = { high: "var(--r)", medium: "var(--a)", low: "var(--ink4)" };

export default function SignalCard({ signal, onSelect }) {
  const cat = IDEA_CATEGORIES.find(c => c.id === signal.categoryId);
  const topQuote = signal.sources.find(s => s.sampleQuote)?.sampleQuote;

  return (
    <div className="z-card" onClick={() => onSelect?.(signal)}>
      <div className="z-card-header">
        <span className="z-badge" style={{ color: SEV_COLOR[signal.severity] }}>{signal.severity} severity</span>
        <span className="z-trend-pct" style={{ color: signal.growthRate >= 50 ? "var(--g)" : "var(--a)", fontSize: 20 }}>+{signal.growthRate}%</span>
      </div>
      <h3 className="z-card-title">{signal.title}</h3>
      <p className="z-card-desc">{cat?.icon} {cat?.name} &middot; {(signal.mentionCount / 1000).toFixed(1)}K mentions across platforms</p>
      <div className="z-mini-stats">
        {signal.sources.filter(s => s.postCount > 0).map((s, i) => (
          <span className="z-ms" key={i}>{(s.postCount / 1000).toFixed(1)}K {s.platform}</span>
        ))}
      </div>
      <p className="z-card-desc" style={{ marginTop: 4 }}>
        {signal.description.length > 130 ? signal.description.slice(0, 130) + "..." : signal.description}
      </p>
      {topQuote && <div className="z-quote">&ldquo;{topQuote.length > 100 ? topQuote.slice(0, 100) + "..." : topQuote}&rdquo;</div>}
      <div className="z-card-footer"><span>Explore</span><span className="z-arrow">&rarr;</span></div>
    </div>
  );
}
