export default function ComparisonBars({ items, maxValue, unit = "" }) {
  // items: [{label, value, color?, sublabel?}]
  if (!items || !items.length) return null;
  const mx = maxValue || Math.max(...items.map(i => i.value));

  return (
    <div className="cb-wrap">
      {items.map((item, i) => (
        <div className="cb-row" key={i}>
          <div className="cb-label">
            <span className="cb-name">{item.label}</span>
            {item.sublabel && <span className="cb-sub">{item.sublabel}</span>}
          </div>
          <div className="cb-bar-wrap">
            <div className="cb-bar-track">
              <div
                className="cb-bar-fill"
                style={{
                  width: `${mx > 0 ? (item.value / mx) * 100 : 0}%`,
                  background: item.gradient || item.color || "var(--grad-teal)",
                  transition: "width 0.8s cubic-bezier(.22,1,.36,1)",
                }}
              />
            </div>
            <span className="cb-value" style={{ color: item.color || "var(--ink)" }}>
              {typeof item.displayValue === "string" ? item.displayValue : `${item.value}${unit}`}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
