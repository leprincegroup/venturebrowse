import { useState } from "react";
import "./styles/global.css";
import { useAuth } from "./contexts/AuthContext";
import Toast from "./components/common/Toast";
import AuthModal from "./components/auth/AuthModal";
import UserMenu from "./components/auth/UserMenu";
import HomePage from "./components/home/HomePage";
import IdeasView from "./components/ideas/IdeasView";
import DealsView from "./components/deals/DealsView";
import IntelView from "./components/intel/IntelView";

export default function App() {
  const { user } = useAuth();
  const [pillar, setPillar] = useState(null); // null = home, "ideas", "deals", "intel"
  const [toast, setToast] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [pendingDeal, setPendingDeal] = useState(null);

  const [watchlist, setWatchlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("vb_watchlist") || "[]"); } catch { return []; }
  });

  function toggleWatch(id) {
    setWatchlist(prev => {
      const has = prev.includes(id);
      const next = has ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem("vb_watchlist", JSON.stringify(next));
      showToastMsg(has ? "Removed from watchlist" : "Added to watchlist");
      return next;
    });
  }

  function showToastMsg(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  function handleSelectDeal(brand) {
    setPendingDeal(brand);
    setPillar("deals");
  }

  return (
    <>
      {/* Nav */}
      <nav>
        <div className="logo" onClick={() => setPillar(null)} style={{ cursor: "pointer" }}>
          <img src="/logo.svg" alt="VentureBrowse" style={{ height: 18 }} />
        </div>
        <div className="pillar-toggle">
          <button className={`pillar-btn${pillar === "ideas" ? " on" : ""}`} onClick={() => setPillar("ideas")}>
            Find Ideas
          </button>
          <button className={`pillar-btn${pillar === "deals" ? " on" : ""}`} onClick={() => setPillar("deals")}>
            Browse Brands
          </button>
          <button className={`pillar-btn${pillar === "intel" ? " on" : ""}`} onClick={() => setPillar("intel")}>
            Market Intel
          </button>
        </div>
        <div className="nav-r">
          {user ? (
            <UserMenu />
          ) : (
            <>
              <button className="ghost" onClick={() => setShowAuth(true)}>Sign in</button>
              <button className="pill" onClick={() => setShowAuth(true)}>Get access →</button>
            </>
          )}
        </div>
      </nav>

      <div className="wrap">
        {pillar === null && (
          <HomePage
            onSelectPillar={setPillar}
            onSelectDeal={handleSelectDeal}
          />
        )}
        {pillar === "ideas" && <IdeasView />}
        {pillar === "deals" && (
          <DealsView
            watchlist={watchlist}
            onToggleWatch={toggleWatch}
            initialDeal={pendingDeal}
            onClearInitialDeal={() => setPendingDeal(null)}
          />
        )}
        {pillar === "intel" && <IntelView />}

        <div className="hr" />

        {/* Upgrade CTA */}
        <div className="upgr">
          <div>
            <h3>Consumer brand intelligence,<br /><em style={{ fontStyle: "italic" }}>for serious investors.</em></h3>
            <p>PE deal signals, emerging brand trends, and AI-generated investment briefs — for $149/mo instead of $30,000/year.</p>
          </div>
          <div className="upgr-acts">
            <button className="bwo">See pricing</button>
            <button className="bw">Start free →</button>
          </div>
        </div>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {toast && <Toast msg={toast} />}
    </>
  );
}
