import { useState } from "react";
import useSubmissions from "../../hooks/useSubmissions";
import { supabase } from "../../lib/supabase";
import { invalidateCache } from "../../hooks/useSupabaseQuery";

export default function AdminQueue() {
  const { data: submissions, loading } = useSubmissions();
  const [acting, setActing] = useState(null);
  const [err, setErr] = useState(null);

  const pending = submissions?.filter(s => s.status === "pending") || [];
  const reviewed = submissions?.filter(s => s.status !== "pending") || [];

  async function handleAction(subId, action) {
    setActing(subId);
    setErr(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const res = await supabase.functions.invoke("approve-submission", {
        body: { submission_id: subId, action },
      });

      if (res.error) throw new Error(res.error.message || "Action failed");

      invalidateCache("submissions");
      invalidateCache("companies");
      // Force re-render by reloading submissions
      window.location.reload();
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setActing(null);
    }
  }

  if (loading) {
    return (
      <div className="feed">
        <div className="feed-hdr">
          <h2 className="sec-title">Admin Review Queue</h2>
        </div>
        <div style={{ padding: "60px 0", textAlign: "center", fontSize: 14, color: "var(--ink3)" }}>
          Loading submissions...
        </div>
      </div>
    );
  }

  return (
    <div className="feed">
      <div className="feed-hdr">
        <div>
          <h2 className="sec-title">Admin Review Queue</h2>
          <p style={{ color: "var(--ink3)", fontSize: 14, marginTop: 6, fontWeight: 300 }}>
            Review and approve startup submissions.
          </p>
        </div>
        {pending.length > 0 && (
          <span className="admin-badge">{pending.length} pending</span>
        )}
      </div>

      {err && <div style={{ color: "var(--r)", fontSize: 13, marginBottom: 16, padding: "10px 14px", background: "var(--rl)", borderRadius: 8 }}>{err}</div>}

      {pending.length === 0 && reviewed.length === 0 && (
        <div style={{ padding: "80px 0", textAlign: "center", border: "1px solid var(--bd)", borderRadius: 14 }}>
          <div style={{ fontSize: 28, marginBottom: 14, color: "var(--ink4)" }}>○</div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 22, color: "var(--ink2)", marginBottom: 8 }}>No submissions yet</div>
          <div style={{ fontSize: 14, color: "var(--ink3)", fontWeight: 300 }}>Submissions from founders will appear here.</div>
        </div>
      )}

      {pending.length > 0 && (
        <>
          <div className="pstl" style={{ marginTop: 8 }}>Pending Review</div>
          <div className="sub-list">
            {pending.map(sub => (
              <div className="sub-card" key={sub.id}>
                <div className="sub-top">
                  <div>
                    <div className="sub-name">{sub.company_name}</div>
                    <div className="sub-meta">
                      {sub.category && <span>{sub.category}</span>}
                      {sub.hq && <span> · {sub.hq}</span>}
                      {sub.founded && <span> · Founded {sub.founded}</span>}
                    </div>
                  </div>
                  <div className="sub-actions">
                    <button
                      className="pill"
                      style={{ padding: "6px 16px", fontSize: 13 }}
                      onClick={() => handleAction(sub.id, "approve")}
                      disabled={acting === sub.id}
                    >
                      {acting === sub.id ? "..." : "Approve"}
                    </button>
                    <button
                      className="pill-o"
                      style={{ padding: "5px 14px", fontSize: 13 }}
                      onClick={() => handleAction(sub.id, "reject")}
                      disabled={acting === sub.id}
                    >
                      Reject
                    </button>
                  </div>
                </div>
                {sub.description && (
                  <div className="sub-desc">{sub.description}</div>
                )}
                <div className="sub-details">
                  {sub.website && <a href={sub.website} target="_blank" rel="noopener noreferrer" className="sub-link">{sub.website.replace(/^https?:\/\//, "")}</a>}
                  {sub.employees && <span>Team: {sub.employees}</span>}
                  {sub.raised && <span>Raised: {sub.raised}</span>}
                  {sub.mrr != null && (
                    <span>
                      MRR: ${Number(sub.mrr).toLocaleString()}
                      {sub.mrr_verified && <span className="verified-badge" style={{ marginLeft: 6 }}>✓ Verified</span>}
                    </span>
                  )}
                </div>
                <div className="sub-time">
                  Submitted {new Date(sub.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {reviewed.length > 0 && (
        <>
          <div className="pstl" style={{ marginTop: 28 }}>Reviewed</div>
          <div className="sub-list">
            {reviewed.map(sub => (
              <div className="sub-card reviewed" key={sub.id}>
                <div className="sub-top">
                  <div>
                    <div className="sub-name">{sub.company_name}</div>
                    <div className="sub-meta">
                      {sub.category && <span>{sub.category}</span>}
                      {sub.hq && <span> · {sub.hq}</span>}
                    </div>
                  </div>
                  <span className={`sub-status ${sub.status}`}>
                    {sub.status === "approved" ? "Approved" : "Rejected"}
                  </span>
                </div>
                <div className="sub-time">
                  Reviewed {sub.reviewed_at ? new Date(sub.reviewed_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
