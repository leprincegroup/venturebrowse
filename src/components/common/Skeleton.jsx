export function SkeletonLine({ width = "100%", height = 14 }) {
  return <div className="skel-line" style={{ width, height }} />;
}

export function SkeletonCard() {
  return (
    <div className="skel-card">
      <div className="skel-card-top">
        <div className="skel-avatar" />
        <div style={{ flex: 1 }}>
          <SkeletonLine width="60%" height={14} />
          <SkeletonLine width="40%" height={11} />
        </div>
      </div>
      <SkeletonLine width="90%" />
      <SkeletonLine width="75%" />
      <div className="skel-card-metrics">
        <SkeletonLine width="30%" height={18} />
        <SkeletonLine width="30%" height={18} />
        <SkeletonLine width="30%" height={18} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="skel-grid">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
