import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "??";

  return (
    <div className="user-menu" ref={ref}>
      <div className="user-av" onClick={() => setOpen(!open)}>{initials}</div>
      {open && (
        <div className="user-drop">
          <div style={{ padding: "8px 12px", fontSize: 12, color: "var(--ink4)", borderBottom: "1px solid var(--bd)", marginBottom: 4 }}>
            {user?.email}
          </div>
          <button className="user-drop-item" onClick={signOut}>Sign out</button>
        </div>
      )}
    </div>
  );
}
