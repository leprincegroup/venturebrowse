import { useState } from "react";
import useRadar from "../../hooks/useRadar";
import RadarSetup from "./RadarSetup";
import RadarFeed from "./RadarFeed";

export default function RadarView({ onSelectPillar, onSelectDeal }) {
  const { radars, activeRadar, feedResults, totalMatches, isNewUser, createRadar, deleteRadar, switchRadar } = useRadar();
  const [showSetup, setShowSetup] = useState(false);

  function handleCreate(prompt) {
    createRadar(prompt);
    setShowSetup(false);
  }

  const showingSetup = isNewUser || showSetup;

  return (
    <div className="radar-wrap">
      {/* Top bar — always visible when radars exist */}
      {radars.length > 0 && (
        <div className="radar-topbar">
          <div className="radar-topbar-left">
            {radars.map(r => (
              <button
                key={r.id}
                className={`radar-tab${!showingSetup && r.id === activeRadar?.id ? " on" : ""}`}
                onClick={() => { switchRadar(r.id); setShowSetup(false); }}
              >
                <span className="radar-tab-dot" />
                {r.name}
                {radars.length > 1 && (
                  <span className="radar-tab-x" onClick={e => { e.stopPropagation(); deleteRadar(r.id); }}>×</span>
                )}
              </button>
            ))}
            <button className={`radar-tab-new${showingSetup ? " on" : ""}`} onClick={() => setShowSetup(true)}>+ New Radar</button>
          </div>
        </div>
      )}

      {/* Content */}
      {showingSetup ? (
        <RadarSetup onCreateRadar={handleCreate} onCancel={radars.length > 0 ? () => setShowSetup(false) : null} />
      ) : activeRadar ? (
        <RadarFeed
          radar={activeRadar}
          feed={feedResults}
          totalMatches={totalMatches}
          onSelectPillar={onSelectPillar}
          onSelectDeal={onSelectDeal}
        />
      ) : (
        <RadarSetup onCreateRadar={handleCreate} />
      )}
    </div>
  );
}
