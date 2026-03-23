import { useState } from "react";
import { useAdminUsers } from "../../hooks/useAdmin";
import { useNewsArticles, useCompanies } from "../../hooks/useSupabaseData";
import { supabase } from "../../lib/supabase";

const TIERS = ["free", "pro", "enterprise"];

export default function AdminView() {
  const { users, loading, setUserTier, toggleAdmin, refresh } = useAdminUsers();
  const { articles } = useNewsArticles(5);
  const { companies } = useCompanies();
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="feed" style={{ animation: "fi .3s ease" }}>
      <div className="feed-hdr">
        <div>
          <h2 className="sec-title">Admin Dashboard</h2>
          <p style={{ color: "var(--ink3)", fontSize: 14, marginTop: 6, fontWeight: 400 }}>
            Manage users, subscriptions, and platform data.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="z-metrics" style={{ marginBottom: 24 }}>
        <div className="z-metric"><span className="z-metric-v">{users.length}</span><span className="z-metric-l">total users</span></div>
        <div className="z-metric"><span className="z-metric-v">{users.filter(u => u.subscription_tier === "pro").length}</span><span className="z-metric-l">pro users</span></div>
        <div className="z-metric"><span className="z-metric-v">{users.filter(u => u.is_admin).length}</span><span className="z-metric-l">admins</span></div>
        <div className="z-metric"><span className="z-metric-v">{companies.length}</span><span className="z-metric-l">companies</span></div>
        <div className="z-metric"><span className="z-metric-v">{articles.length > 0 ? "Live" : "—"}</span><span className="z-metric-l">news feed</span></div>
      </div>

      {/* Tabs */}
      <div className="filters" style={{ marginBottom: 20 }}>
        {["users", "data", "functions"].map(t => (
          <button key={t} className={`fchip${activeTab === t ? " on" : ""}`} onClick={() => setActiveTab(t)} style={{ textTransform: "capitalize" }}>{t}</button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === "users" && (
        <div>
          {loading && <div style={{ padding: 40, textAlign: "center", color: "var(--ink4)" }}>Loading users...</div>}
          {!loading && users.length === 0 && (
            <div className="z-card" style={{ textAlign: "center", padding: 40 }}>
              <p style={{ fontSize: 15, color: "var(--ink3)", marginBottom: 8 }}>No users yet.</p>
              <p style={{ fontSize: 13, color: "var(--ink4)" }}>Users will appear here after they sign up. hugo@creedmedia.com will be auto-admin.</p>
            </div>
          )}
          {users.map(u => (
            <div className="z-card" key={u.id} style={{ marginBottom: 12, gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 500, color: "var(--ink)" }}>{u.name || u.email}</div>
                  <div style={{ fontSize: 13, color: "var(--ink3)", marginTop: 2 }}>{u.email}</div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {u.is_admin && <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", background: "var(--gl)", color: "var(--g)", border: "1px solid rgba(52,199,89,.2)", textTransform: "uppercase", letterSpacing: ".04em" }}>Admin</span>}
                  <span style={{ fontSize: 10, fontWeight: 500, padding: "2px 8px", background: "var(--off)", border: "1px solid var(--bd)", textTransform: "uppercase", letterSpacing: ".04em" }}>{u.subscription_tier}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "var(--ink4)", marginRight: 8 }}>Tier:</span>
                {TIERS.map(t => (
                  <button
                    key={t}
                    className={`fchip${u.subscription_tier === t ? " on" : ""}`}
                    style={{ fontSize: 10, padding: "2px 8px" }}
                    onClick={() => setUserTier(u.id, t)}
                  >{t}</button>
                ))}
                <span style={{ fontSize: 12, color: "var(--ink4)", marginLeft: 16, marginRight: 8 }}>Admin:</span>
                <button
                  className={`fchip${u.is_admin ? " on" : ""}`}
                  style={{ fontSize: 10, padding: "2px 8px" }}
                  onClick={() => toggleAdmin(u.id, !u.is_admin)}
                >{u.is_admin ? "Remove admin" : "Make admin"}</button>
              </div>
              <div style={{ fontSize: 11, color: "var(--ink4)" }}>
                Joined {new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Data Tab */}
      {activeTab === "data" && (
        <div>
          <div className="z-card" style={{ marginBottom: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 12 }}>Recent News Articles</h3>
            {articles.length === 0 && <p style={{ color: "var(--ink4)", fontSize: 13 }}>No articles yet. Run ingest-news to populate.</p>}
            {articles.map(a => (
              <div key={a.id} style={{ padding: "8px 0", borderBottom: "1px solid var(--bd)", fontSize: 13 }}>
                <div style={{ fontWeight: 500, color: "var(--ink)" }}>{a.title}</div>
                <div style={{ color: "var(--ink4)", fontSize: 11, marginTop: 2 }}>{a.source_name} · {new Date(a.published_at).toLocaleString()}</div>
              </div>
            ))}
          </div>

          <div className="z-card" style={{ marginBottom: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 12 }}>Companies in DB</h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {companies.map(c => (
                <span key={c.id} className="z-tag" style={{ fontSize: 11 }}>{c.name} · {c.domain}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Functions Tab */}
      {activeTab === "functions" && (
        <div>
          <div className="z-card" style={{ marginBottom: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 12 }}>Edge Functions</h3>
            <p style={{ fontSize: 13, color: "var(--ink3)", marginBottom: 16 }}>Trigger data collection functions manually.</p>
            {["ingest-news", "ingest-reddit", "ingest-ads", "ingest-reviews", "ingest-trends", "ingest-social", "ingest-traffic", "ingest-company", "compute-summaries"].map(fn => (
              <FunctionRow key={fn} name={fn} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FunctionRow({ name }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setStatus(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) { setStatus("Not authenticated"); setLoading(false); return; }

      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${name}`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      });
      const data = await res.json();
      setStatus(data.ok ? `OK — ${data.items || 0} items in ${((data.duration_ms || 0) / 1000).toFixed(1)}s` : `Error: ${data.error}`);
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
    setLoading(false);
  }

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--bd)" }}>
      <div>
        <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>{name}</span>
        {status && <span style={{ fontSize: 11, color: status.startsWith("OK") ? "var(--g)" : "var(--r)", marginLeft: 12 }}>{status}</span>}
      </div>
      <button className="fchip" onClick={run} disabled={loading} style={{ fontSize: 10, padding: "3px 10px" }}>
        {loading ? "Running..." : "Run"}
      </button>
    </div>
  );
}
