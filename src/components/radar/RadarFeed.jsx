import { IDEA_CATEGORIES } from "../../data";
import IdeaCard from "../ideas/IdeaCard";
import DealCard from "../deals/DealCard";
import TrendCard from "../intel/TrendCard";
import SignalCard from "../intel/SignalCard";
import Sparkline from "../common/Sparkline";

export default function RadarFeed({ radar, feed, totalMatches, onSelectPillar, onSelectDeal }) {
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const avgGrowth = feed.ideas.length > 0 ? Math.round(feed.ideas.reduce((s, i) => s + i.growthRate, 0) / feed.ideas.length) : 0;

  return (
    <div className="rf-feed">
      {/* Header */}
      <div className="rf-header">
        <div className="rf-header-top">
          <h1 className="rf-name">{radar.name}</h1>
          <span className="rf-date">{today}</span>
        </div>
        <p className="rf-prompt">{radar.prompt}</p>
      </div>

      {/* Stats */}
      <div className="rf-stats">
        <div className="rf-stat"><span className="rf-sv">{totalMatches}</span><span className="rf-sl">Matches</span></div>
        <div className="rf-stat"><span className="rf-sv">{feed.ideas.length}</span><span className="rf-sl">Ideas</span></div>
        <div className="rf-stat"><span className="rf-sv">{feed.brands.length}</span><span className="rf-sl">Brands</span></div>
        <div className="rf-stat"><span className="rf-sv">{feed.trends.length + feed.signals.length}</span><span className="rf-sl">Signals</span></div>
        {avgGrowth > 0 && <div className="rf-stat"><span className="rf-sv" style={{ color: "var(--g)" }}>+{avgGrowth}%</span><span className="rf-sl">Avg Growth</span></div>}
      </div>

      {/* Ideas Section */}
      {feed.ideas.length > 0 && (
        <div className="rf-section">
          <div className="rf-sec-hdr">
            <h3 className="rf-sec-title">Ideas for You</h3>
            <button className="hp-link" onClick={() => onSelectPillar("ideas")}>View all in Find Ideas →</button>
          </div>
          <div className="cgrid radar-ideas-grid">
            {feed.ideas.slice(0, 3).map(idea => (
              <IdeaCard key={idea.id} idea={idea} onSelect={() => onSelectPillar("ideas")} />
            ))}
          </div>
        </div>
      )}

      {/* Brands Section */}
      {feed.brands.length > 0 && (
        <div className="rf-section">
          <div className="rf-sec-hdr">
            <h3 className="rf-sec-title">Brands to Watch</h3>
            <button className="hp-link" onClick={() => onSelectPillar("deals")}>Browse all brands →</button>
          </div>
          <div className="brand-grid-4">
            {feed.brands.slice(0, 4).map(brand => (
              <DealCard
                key={brand.id}
                brand={brand}
                watched={false}
                onSelect={(b) => { onSelectPillar("deals"); onSelectDeal?.(b); }}
                onToggleWatch={() => {}}
              />
            ))}
          </div>
        </div>
      )}

      {/* Market Signals Section */}
      {(feed.trends.length > 0 || feed.signals.length > 0) && (
        <div className="rf-section">
          <div className="rf-sec-hdr">
            <h3 className="rf-sec-title">Market Signals</h3>
            <button className="hp-link" onClick={() => onSelectPillar("intel")}>View all in Market Intel →</button>
          </div>

          {feed.trends.length > 0 && (
            <>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Keyword Trends</div>
              <div className="cgrid intel-grid" style={{ marginBottom: 20 }}>
                {feed.trends.slice(0, 4).map(trend => (
                  <TrendCard key={trend.id} trend={trend} />
                ))}
              </div>
            </>
          )}

          {feed.signals.length > 0 && (
            <>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Community Signals</div>
              <div className="cgrid intel-grid">
                {feed.signals.slice(0, 4).map(signal => (
                  <SignalCard key={signal.id} signal={signal} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {totalMatches === 0 && (
        <div className="rf-empty">
          <p>No matches found for your radar. Try broadening your search terms.</p>
        </div>
      )}
    </div>
  );
}
