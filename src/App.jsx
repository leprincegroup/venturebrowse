import { useState, useCallback } from "react";
import "./styles/global.css";
import { useAuth } from "./contexts/AuthContext";
import Toast from "./components/common/Toast";
import ErrorBoundary from "./components/common/ErrorBoundary";
import CommandPalette from "./components/common/CommandPalette";
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
  const [cmdOpen, setCmdOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  function handlePillarChange(p) {
    setPillar(p);
    setMobileMenuOpen(false);
  }

  const handleCmdClose = useCallback((action) => {
    if (action === "toggle") setCmdOpen(prev => !prev);
    else setCmdOpen(false);
  }, []);

  const handleCmdNavigate = useCallback((target, data) => {
    if (target === "deals" && data) {
      setPendingDeal(data);
    }
    setPillar(target);
  }, []);

  return (
    <ErrorBoundary>
      {/* Nav */}
      <nav>
        <div className="logo" onClick={() => handlePillarChange(null)} style={{ cursor: "pointer" }}>
          <img src="/logo.svg" alt="VentureBrowse" style={{ height: 18 }} />
        </div>
        <div className="pillar-toggle">
          <button className={`pillar-btn${pillar === "ideas" ? " on" : ""}`} onClick={() => handlePillarChange("ideas")}>
            Find Ideas
          </button>
          <button className={`pillar-btn${pillar === "deals" ? " on" : ""}`} onClick={() => handlePillarChange("deals")}>
            Browse Brands
          </button>
          <button className={`pillar-btn${pillar === "intel" ? " on" : ""}`} onClick={() => handlePillarChange("intel")}>
            Market Intel
          </button>
        </div>
        <div className="nav-r">
          <button className="cmd-trigger" onClick={() => setCmdOpen(true)} title="Search (⌘K)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span className="cmd-trigger-label">Search</span>
            <kbd className="cmd-trigger-kbd">⌘K</kbd>
          </button>
          {user ? (
            <UserMenu />
          ) : (
            <>
              <button className="ghost" onClick={() => setShowAuth(true)}>Sign in</button>
              <button className="pill" onClick={() => setShowAuth(true)}>Get access →</button>
            </>
          )}
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
            <span className={`hamburger${mobileMenuOpen ? " open" : ""}`}>
              <span /><span /><span />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={e => e.stopPropagation()}>
            <button className={`mobile-nav-item${pillar === null ? " on" : ""}`} onClick={() => handlePillarChange(null)}>
              Home
            </button>
            <button className={`mobile-nav-item${pillar === "ideas" ? " on" : ""}`} onClick={() => handlePillarChange("ideas")}>
              Find Ideas
            </button>
            <button className={`mobile-nav-item${pillar === "deals" ? " on" : ""}`} onClick={() => handlePillarChange("deals")}>
              Browse Brands
            </button>
            <button className={`mobile-nav-item${pillar === "intel" ? " on" : ""}`} onClick={() => handlePillarChange("intel")}>
              Market Intel
            </button>
            <div className="mobile-drawer-divider" />
            <button className="mobile-nav-item" onClick={() => { setCmdOpen(true); setMobileMenuOpen(false); }}>
              Search...
            </button>
            {!user && (
              <button className="mobile-nav-item accent" onClick={() => { setShowAuth(true); setMobileMenuOpen(false); }}>
                Sign in
              </button>
            )}
          </div>
        </div>
      )}

      <div className="wrap">
        <ErrorBoundary>
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
        </ErrorBoundary>

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

      <CommandPalette open={cmdOpen} onClose={handleCmdClose} onNavigate={handleCmdNavigate} />
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {toast && <Toast msg={toast} />}
    </ErrorBoundary>
  );
}
