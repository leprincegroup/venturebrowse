export default function MiniMetricBar({ bars }) {
  if (!bars || !bars.length) return null;
  const mx = Math.max(...bars.map(b => b.value));
  return (
    <div className="mmb">
      {bars.map((b, i) => (
        <div className="mmb-item" key={i}>
          <div className="mmb-label">{b.label}</div>
          <div className="mmb-track">
            <div className="mmb-fill" style={{
              width: `${mx > 0 ? (b.value / mx) * 100 : 0}%`,
              background: b.color || "var(--ink)",
              transition: "width 0.6s cubic-bezier(.22,1,.36,1)",
            }} />
          </div>
          <div className="mmb-val" style={{ color: b.color || "var(--ink)" }}>{b.displayValue || b.value}</div>
        </div>
      ))}
    </div>
  );
}
