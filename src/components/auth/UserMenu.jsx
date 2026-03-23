import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useProfile } from "../../hooks/useAdmin";

export default function UserMenu({ onNavigate }) {
  const { user, signOut } = useAuth();
  const { profile, isAdmin, isPro } = useProfile();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const name = profile?.name || user?.email?.split("@")[0] || "User";
  const initials = name.slice(0, 2).toUpperCase();
  const avatarUrl = profile?.avatar_url;
  const tier = profile?.subscription_tier || "free";

  function nav(pillar) {
    setOpen(false);
    onNavigate?.(pillar);
  }

  return (
    <div className="user-menu" ref={ref}>
      <div className="user-av" onClick={() => setOpen(!open)}>
        {avatarUrl
          ? <img src={avatarUrl} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
          : initials
        }
      </div>
      {open && (
        <div className="user-drop">
          {/* Header */}
          <div className="ud-header">
            <div className="ud-name">{name}</div>
            <div className="ud-email">{user?.email}</div>
            <span className={`ud-tier ud-tier-${tier}`}>{tier === "pro" ? "Pro" : tier === "enterprise" ? "Enterprise" : "Free"}</span>
          </div>

          {/* Links */}
          <button className="user-drop-item" onClick={() => nav("dashboard")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </button>
          <button className="user-drop-item" onClick={() => nav("dashboard")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            Saved items
          </button>
          {!isPro && (
            <button className="user-drop-item ud-upgrade" onClick={() => nav("upgrade")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Upgrade to Pro
            </button>
          )}
          {isAdmin && (
            <button className="user-drop-item" onClick={() => nav("admin")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              Admin
            </button>
          )}

          <div className="ud-divider" />

          <button className="user-drop-item" onClick={() => { setOpen(false); signOut(); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign out
          </button>
        </div>
      )}
    </div>
  );
}
