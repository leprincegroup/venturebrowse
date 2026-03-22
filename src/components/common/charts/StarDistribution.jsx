export default function StarDistribution({ distribution }) {
  if (!distribution) return null;
  const total = Object.values(distribution).reduce((s, v) => s + v, 0);
  const bars = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: distribution[star] || 0,
    pct: total > 0 ? ((distribution[star] || 0) / total) * 100 : 0,
  }));
  const mx = Math.max(...bars.map(b => b.count));

  return (
    <div className="sd-wrap">
      {bars.map(b => (
        <div className="sd-row" key={b.star}>
          <span className="sd-star">{b.star}★</span>
          <div className="sd-track">
            <div className="sd-fill" style={{
              width: `${mx > 0 ? (b.count / mx) * 100 : 0}%`,
              background: b.star >= 4 ? "var(--g)" : b.star === 3 ? "var(--a)" : "var(--r)",
              transition: "width 0.6s cubic-bezier(.22,1,.36,1)",
            }} />
          </div>
          <span className="sd-count">{b.count}</span>
          <span className="sd-pct">{b.pct.toFixed(0)}%</span>
        </div>
      ))}
    </div>
  );
}
