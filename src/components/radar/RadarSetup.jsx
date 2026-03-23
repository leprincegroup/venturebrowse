import { useState } from "react";
import { RADAR_EXAMPLES } from "../../lib/constants";

export default function RadarSetup({ onCreateRadar, onCancel }) {
  const [prompt, setPrompt] = useState("");
  const [thinking, setThinking] = useState(false);

  function handleSubmit() {
    if (!prompt.trim() || thinking) return;
    setThinking(true);
    setTimeout(() => {
      onCreateRadar(prompt.trim());
      setThinking(false);
    }, 800);
  }

  return (
    <div className="radar-setup">
      <div className="radar-setup-icon">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="4 3" />
          <circle cx="16" cy="16" r="8" stroke="var(--ink)" strokeWidth="1.5" strokeDasharray="3 2" />
          <circle cx="16" cy="16" r="3" fill="var(--ink)" />
        </svg>
      </div>
      <h1 className="radar-setup-title">What are you looking for?</h1>
      <p className="radar-setup-sub">
        Describe your investment thesis, interests, or goals. We'll build a personalized intelligence feed updated daily.
      </p>

      <div className="radar-input-wrap">
        <textarea
          className="radar-input"
          placeholder="e.g. I want to acquire beauty brands under $5M ARR with declining traffic but strong community..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
          rows={3}
        />
        <button className="radar-submit" onClick={handleSubmit} disabled={!prompt.trim() || thinking}>
          {thinking ? (
            <span className="radar-dots"><span /><span /><span /></span>
          ) : "Build my radar"}
        </button>
      </div>

      <div className="radar-examples">
        <span className="radar-ex-label">Try these:</span>
        {RADAR_EXAMPLES.map((ex, i) => (
          <button key={i} className="radar-chip" onClick={() => setPrompt(ex)}>{ex}</button>
        ))}
      </div>

      {onCancel && (
        <button className="radar-cancel" onClick={onCancel}>Back to my radars</button>
      )}
    </div>
  );
}
