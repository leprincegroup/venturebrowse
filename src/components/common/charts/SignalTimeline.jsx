const DOT_COLOR = { red: "var(--r)", green: "var(--g)", amber: "var(--a)" };

export default function SignalTimeline({ events }) {
  if (!events || !events.length) return null;
  return (
    <div className="stl">
      {events.map((e, i) => (
        <div className="stl-item" key={i}>
          <div className="stl-dot" style={{ background: DOT_COLOR[e.type] || "var(--ink4)" }} />
          <div className="stl-content">
            <div className="stl-text">{e.text}</div>
            <div className="stl-date">{e.date}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
