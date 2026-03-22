export default function FlagList({ flags, type = "red" }) {
  if (!flags || !flags.length) return null;
  const isRed = type === "red";
  return (
    <div className="fl-list">
      {flags.map((f, i) => (
        <div className={`fl-item ${type}`} key={i}>
          <span className="fl-icon">{isRed ? "⚠" : "✓"}</span>
          <span className="fl-text">{f}</span>
        </div>
      ))}
    </div>
  );
}
