export default function ProGate({ locked, onUnlock, children }) {
  if (!locked) return children;
  return (
    <div className="pro-gate">
      <div className="pro-blur">{children}</div>
      <div className="pro-overlay">
        <div className="pro-overlay-inner">
          <div style={{ fontSize: 20, marginBottom: 8 }}>🔒</div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 20, color: "var(--ink)", marginBottom: 6 }}>Pro Analysis</div>
          <p style={{ fontSize: 13, color: "var(--ink3)", fontWeight: 300, lineHeight: 1.6, marginBottom: 16 }}>
            Full acquisition analysis with financials, opportunities, and verdict requires a Pro plan.
          </p>
          <button className="pill" onClick={onUnlock}>Unlock for $149/mo →</button>
          <button className="ghost" style={{ marginTop: 4, fontSize: 12 }} onClick={onUnlock}>Preview for demo</button>
        </div>
      </div>
    </div>
  );
}
