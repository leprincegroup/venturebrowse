import { useState, useEffect } from "react";
import "./styles/global.css";
import { useAuth } from "./contexts/AuthContext";
import Toast from "./components/common/Toast";
import AuthModal from "./components/auth/AuthModal";
import UserMenu from "./components/auth/UserMenu";
import DailyBrief from "./components/home/DailyBrief";
import DailyBriefAlt from "./components/home/DailyBriefAlt";
import RadarView from "./components/radar/RadarView";
import IdeasView from "./components/ideas/IdeasView";
import DealsView from "./components/deals/DealsView";
import IntelView from "./components/intel/IntelView";
import TerminalView from "./components/terminal/TerminalView";
import AdminView from "./components/admin/AdminView";
import DashboardView from "./components/user/DashboardView";
import { useProfile } from "./hooks/useAdmin";

// Access tiers: public (no account), free (signed in), pro (paid)
const FREE_GATED = new Set(["ideas", "deals", "intel", "terminal"]); // requires free account to browse lists
const PRO_GATED = new Set(["terminal"]); // requires pro to access

export default function App() {
  const { user } = useAuth();
  const { profile, isAdmin, isPro: isProFromDB } = useProfile();
  // Use DB subscription if available, fallback to localStorage for demo
  const isPro = isProFromDB || (user && localStorage.getItem("vb_pro") === "true");
  const isFullTerminal = new URLSearchParams(window.location.search).get("terminal") === "full";
  const [pillar, setPillarRaw] = useState(isFullTerminal ? "terminal" : "daily-alt");
  function setPillar(p) { setPillarRaw(p); window.scrollTo(0, 0); }
  useEffect(() => { window.scrollTo(0, 0); }, [pillar]);
  const [toast, setToast] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [pendingDeal, setPendingDeal] = useState(null);
  const [pendingIdea, setPendingIdea] = useState(null);

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

  // 3-tier gated navigation (disabled during development)
  function gatedNav(p) {
    // TODO: Re-enable auth gates before launch
    // if (PRO_GATED.has(p)) {
    //   if (!user) { setShowAuth(true); return; }
    //   if (!isPro) { setShowUpgrade(true); return; }
    // }
    // if (FREE_GATED.has(p) && !user) { setShowAuth(true); return; }
    // if (FREE_GATED.has(p) && !isPro) { setShowUpgrade(true); return; }
    setPillar(p);
  }

  // Deep links from homepage
  function handleSelectDeal(brand) {
    // TODO: Re-enable auth gate before launch
    // if (!user) { setShowAuth(true); return; }
    setPendingDeal(brand);
    setPillar("deals");
  }

  function handleSelectIdea(idea) {
    // TODO: Re-enable auth gate before launch
    // if (!user) { setShowAuth(true); return; }
    setPendingIdea(idea);
    setPillar("ideas");
  }

  const isDark = pillar === "terminal";

  if (isFullTerminal) {
    return (
      <div className="app-dark">
        <TerminalView fullscreen={true} />
        {toast && <Toast msg={toast} />}
      </div>
    );
  }

  return (
    <div className={isDark ? "app-dark" : ""}>
      {/* Nav */}
      <nav>
        <div className="nav-inner">
        <div className="logo" onClick={() => setPillar("daily-alt")} style={{ cursor: "pointer" }}>
          <img src="/logo.svg" alt="VentureBrowse" style={{ height: 18 }} />
        </div>
        <div className="pillar-toggle">
          <button className={`pillar-btn${pillar === "ideas" ? " on" : ""}`} onClick={() => gatedNav("ideas")}>
            Find Ideas
          </button>
          <button className={`pillar-btn${pillar === "deals" ? " on" : ""}`} onClick={() => gatedNav("deals")}>
            Browse Brands
          </button>
          <button className={`pillar-btn${pillar === "intel" ? " on" : ""}`} onClick={() => gatedNav("intel")}>
            Market Intel
          </button>
          <button className={`pillar-btn${pillar === "terminal" ? " on" : ""}`} onClick={() => gatedNav("terminal")}>
            Terminal
          </button>
        </div>
        <div className="nav-r">
          {user ? (
            <UserMenu onNavigate={setPillar} />
          ) : (
            <>
              <button className="ghost" onClick={() => setShowAuth(true)}>Sign in</button>
              <button className="pill" onClick={() => setShowAuth(true)}>Get access →</button>
            </>
          )}
        </div>
        </div>
      </nav>

      <div className="wrap">
        {pillar === "daily" && (
          <DailyBrief
            onSelectPillar={gatedNav}
            onSelectDeal={handleSelectDeal}
          />
        )}
        {pillar === "daily-alt" && (
          <DailyBriefAlt
            onSelectPillar={gatedNav}
            onSelectDeal={handleSelectDeal}
            onSelectIdea={handleSelectIdea}
            user={user}
            onShowAuth={() => setShowAuth(true)}
          />
        )}
        {pillar === null && (
          <RadarView
            onSelectPillar={gatedNav}
            onSelectDeal={handleSelectDeal}
          />
        )}
        {pillar === "ideas" && (
          <IdeasView
            initialIdea={pendingIdea}
            onClearInitialIdea={() => setPendingIdea(null)}
          />
        )}
        {pillar === "deals" && (
          <DealsView
            watchlist={watchlist}
            onToggleWatch={toggleWatch}
            initialDeal={pendingDeal}
            onClearInitialDeal={() => setPendingDeal(null)}
          />
        )}
        {pillar === "intel" && <IntelView onSelectDeal={handleSelectDeal} />}
        {pillar === "terminal" && <TerminalView />}
        {pillar === "dashboard" && user && (
          <DashboardView
            watchlist={watchlist}
            onToggleWatch={toggleWatch}
            onSelectPillar={gatedNav}
          />
        )}
        {pillar === "admin" && isAdmin && <AdminView />}

        {pillar !== "terminal" && <div className="hr" />}

        {/* Upgrade CTA */}
        {pillar !== "terminal" && <div className="upgr">
          <div>
            <h3>Consumer brand intelligence,<br /><em style={{ fontStyle: "italic" }}>for serious investors.</em></h3>
            <p>PE deal signals, emerging brand trends, and AI-generated investment briefs — for $149/mo instead of $30,000/year.</p>
          </div>
          <div className="upgr-acts">
            <button className="bwo">See pricing</button>
            <button className="bw" onClick={() => setShowAuth(true)}>Start free →</button>
          </div>
        </div>}
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showUpgrade && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowUpgrade(false)}>
          <div className="panel" style={{ maxWidth: 420 }}>
            <div className="phdr">
              <div>
                <div className="pco">Upgrade to Pro</div>
                <div className="psub">Unlock full access to all brands, ideas, market intel, and the Terminal.</div>
              </div>
              <button className="xcl" onClick={() => setShowUpgrade(false)}>×</button>
            </div>
            <div className="pbody" style={{ padding: 28 }}>
              <div style={{ fontSize: 36, fontWeight: 500, color: "var(--ink)", marginBottom: 4 }}>$149<span style={{ fontSize: 16, fontWeight: 400, color: "var(--ink4)" }}>/mo</span></div>
              <p style={{ fontSize: 14, color: "var(--ink3)", lineHeight: 1.7, marginBottom: 20 }}>
                Full access to Browse Brands, Find Ideas, Market Intelligence, Terminal, and AI-powered analysis. Cancel anytime.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                {["Browse all brands with deep dive analysis", "Full idea pipeline with execution plans", "Market intelligence with community signals", "Bloomberg-style Terminal dashboard", "AI-generated acquisition briefs"].map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--ink2)" }}>
                    <span style={{ color: "var(--g)", flexShrink: 0 }}>✓</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <button className="dive" style={{ width: "100%" }} onClick={() => { setShowUpgrade(false); showToastMsg("Pro upgrade coming soon!"); }}>
                Start Pro trial →
              </button>
              <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "var(--ink4)" }}>7-day free trial · No credit card required</div>
            </div>
          </div>
        </div>
      )}
      {toast && <Toast msg={toast} />}
    </div>
  );
}
