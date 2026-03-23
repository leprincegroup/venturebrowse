import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useProfile } from "../../hooks/useAdmin";
import { BRANDS, VALIDATED_IDEAS } from "../../data";

const TABS = ["Overview", "Saved", "Settings", "Billing"];

export default function DashboardView({ watchlist = [], onToggleWatch, onSelectPillar }) {
  const { user } = useAuth();
  const { profile, isAdmin, isPro } = useProfile();
  const [tab, setTab] = useState("Overview");
  const [editName, setEditName] = useState(false);
  const [name, setName] = useState(profile?.name || "");

  const savedBrands = BRANDS.filter(b => watchlist.includes(b.id));
  const tier = profile?.subscription_tier || "free";

  return (
    <div className="feed" style={{ animation: "fi .3s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h2 className="sec-title">Dashboard</h2>
          <p style={{ color: "var(--ink3)", fontSize: 14, marginTop: 6, fontWeight: 400 }}>
            Welcome back, {profile?.name || user?.email?.split("@")[0]}
          </p>
        </div>
        <span className={`ud-tier ud-tier-${tier}`} style={{ fontSize: 12, padding: "4px 12px" }}>
          {tier === "pro" ? "Pro" : tier === "enterprise" ? "Enterprise" : "Free plan"}
        </span>
      </div>

      {/* Tabs */}
      <div className="filters" style={{ marginBottom: 24 }}>
        {TABS.map(t => (
          <button key={t} className={`fchip${tab === t ? " on" : ""}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {/* Overview */}
      {tab === "Overview" && (
        <div>
          {/* Stats */}
          <div className="z-metrics" style={{ marginBottom: 24 }}>
            <div className="z-metric"><span className="z-metric-v">{savedBrands.length}</span><span className="z-metric-l">saved brands</span></div>
            <div className="z-metric"><span className="z-metric-v">{tier}</span><span className="z-metric-l">plan</span></div>
            <div className="z-metric"><span className="z-metric-v">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—"}</span><span className="z-metric-l">member since</span></div>
            <div className="z-metric"><span className="z-metric-v">{isAdmin ? "Yes" : "No"}</span><span className="z-metric-l">admin</span></div>
          </div>

          {/* Profile card */}
          <div className="z-card" style={{ marginBottom: 16, gap: 16 }}>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div className="user-av" style={{ width: 56, height: 56, fontSize: 18 }}>
                {profile?.avatar_url
                  ? <img src={profile.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : (profile?.name || user?.email || "?").slice(0, 2).toUpperCase()
                }
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 500 }}>{profile?.name || "Set your name"}</div>
                <div style={{ fontSize: 13, color: "var(--ink3)", marginTop: 2 }}>{user?.email}</div>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="z-row" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            <div className="z-card" style={{ cursor: "pointer" }} onClick={() => onSelectPillar?.("ideas")}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>💡</div>
              <div style={{ fontSize: 15, fontWeight: 500 }}>Find Ideas</div>
              <div style={{ fontSize: 13, color: "var(--ink3)", marginTop: 4 }}>Browse validated business opportunities</div>
            </div>
            <div className="z-card" style={{ cursor: "pointer" }} onClick={() => onSelectPillar?.("deals")}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🏢</div>
              <div style={{ fontSize: 15, fontWeight: 500 }}>Browse Brands</div>
              <div style={{ fontSize: 13, color: "var(--ink3)", marginTop: 4 }}>Deep dive into consumer brands</div>
            </div>
            <div className="z-card" style={{ cursor: "pointer" }} onClick={() => onSelectPillar?.("intel")}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>📊</div>
              <div style={{ fontSize: 15, fontWeight: 500 }}>Market Intel</div>
              <div style={{ fontSize: 13, color: "var(--ink3)", marginTop: 4 }}>Trends, signals, and news</div>
            </div>
          </div>
        </div>
      )}

      {/* Saved */}
      {tab === "Saved" && (
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>Saved Brands ({savedBrands.length})</h3>
          {savedBrands.length === 0 && (
            <div className="z-card" style={{ textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🔖</div>
              <p style={{ fontSize: 15, color: "var(--ink3)", marginBottom: 12 }}>No saved brands yet</p>
              <button className="fchip" onClick={() => onSelectPillar?.("deals")}>Browse brands →</button>
            </div>
          )}
          <div className="z-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {savedBrands.map(b => (
              <div className="z-card" key={b.id} style={{ gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div className="z-brand-avatar" style={{ width: 36, height: 36, overflow: "hidden" }}>
                      {b.logoUrl
                        ? <img src={b.logoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} onError={e => { e.target.style.display = "none"; e.target.parentNode.textContent = b.logo; }} />
                        : b.logo
                      }
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 500 }}>{b.name}</div>
                      <div style={{ fontSize: 12, color: "var(--ink3)" }}>{b.category}</div>
                    </div>
                  </div>
                  <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "var(--r)" }} onClick={() => onToggleWatch?.(b.id)}>♥</button>
                </div>
                <p style={{ fontSize: 13, color: "var(--ink3)", lineHeight: 1.5 }}>
                  {b.summary?.length > 100 ? b.summary.slice(0, 100) + "..." : b.summary}
                </p>
                <div className="z-card-footer" onClick={() => onSelectPillar?.("deals")}>
                  <span>View brand</span><span className="z-arrow">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings */}
      {tab === "Settings" && (
        <div>
          <div className="z-card" style={{ marginBottom: 16, gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 500 }}>Profile</h3>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--ink4)", width: 80 }}>Name</span>
              <span style={{ fontSize: 14, color: "var(--ink)" }}>{profile?.name || "Not set"}</span>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--ink4)", width: 80 }}>Email</span>
              <span style={{ fontSize: 14, color: "var(--ink)" }}>{user?.email}</span>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--ink4)", width: 80 }}>Role</span>
              <span style={{ fontSize: 14, color: "var(--ink)" }}>{profile?.role || "user"}</span>
            </div>
          </div>

          <div className="z-card" style={{ marginBottom: 16, gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 500 }}>Preferences</h3>
            <p style={{ fontSize: 13, color: "var(--ink3)" }}>Investment focus and personalization settings coming soon.</p>
          </div>

          <div className="z-card" style={{ gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 500 }}>Notifications</h3>
            <p style={{ fontSize: 13, color: "var(--ink3)" }}>Email notification preferences coming soon.</p>
          </div>
        </div>
      )}

      {/* Billing */}
      {tab === "Billing" && (
        <div>
          <div className="z-card" style={{ marginBottom: 16, gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 500 }}>Current Plan</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className={`ud-tier ud-tier-${tier}`} style={{ fontSize: 14, padding: "6px 16px" }}>
                {tier === "pro" ? "Pro" : tier === "enterprise" ? "Enterprise" : "Free"}
              </span>
              {profile?.subscription_expires_at && (
                <span style={{ fontSize: 12, color: "var(--ink4)" }}>
                  Expires {new Date(profile.subscription_expires_at).toLocaleDateString()}
                </span>
              )}
            </div>
            {isPro ? (
              <p style={{ fontSize: 14, color: "var(--ink3)", lineHeight: 1.6, marginTop: 8 }}>
                You have full access to all features including Browse Brands, Find Ideas, Market Intelligence, Terminal, and AI-powered analysis.
              </p>
            ) : (
              <>
                <p style={{ fontSize: 14, color: "var(--ink3)", lineHeight: 1.6, marginTop: 8 }}>
                  Upgrade to Pro for full access to all brands, ideas, market intel, and the Terminal.
                </p>
                <div style={{ fontSize: 28, fontWeight: 500, marginTop: 12 }}>$149<span style={{ fontSize: 14, fontWeight: 400, color: "var(--ink4)" }}>/mo</span></div>
                <button className="dive" style={{ marginTop: 12, width: "auto", padding: "10px 24px" }}>Upgrade to Pro →</button>
              </>
            )}
          </div>

          <div className="z-card" style={{ gap: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 500 }}>Billing History</h3>
            <p style={{ fontSize: 13, color: "var(--ink3)" }}>No billing history yet.</p>
          </div>
        </div>
      )}
    </div>
  );
}
