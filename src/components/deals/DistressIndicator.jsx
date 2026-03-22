export default function DistressIndicator({ score, size = "md" }) {
  const color = score >= 70 ? "var(--r)" : score >= 40 ? "var(--a)" : "var(--g)";
  const label = score >= 70 ? "High" : score >= 40 ? "Medium" : "Low";
  const fontSize = size === "lg" ? 32 : size === "md" ? 22 : 16;
  return (
    <div className="distress-ind">
      <span style={{ fontFamily: "var(--mono)", fontSize, fontWeight: 600, color, lineHeight: 1 }}>{score}</span>
      <span style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink4)" }}>
        {label} Distress
      </span>
    </div>
  );
}
