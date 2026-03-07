import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { submitCompany } from "../../hooks/useSubmissions";
import { FILTERS } from "../../lib/constants";

const STRIPE_CLIENT_ID = import.meta.env.VITE_STRIPE_CLIENT_ID;

export default function SubmitModal({ onClose, onNeedAuth }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState(null);

  const [form, setForm] = useState({
    company_name: "",
    website: "",
    description: "",
    category: "",
    hq: "",
    founded: "",
    employees: "",
    raised: "",
    linkedin: "",
    twitter: "",
    github: "",
    mrr: "",
    mrr_verified: false,
    stripe_account: "",
  });

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function canSubmit() {
    return form.company_name.trim().length > 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) { onNeedAuth(); return; }
    if (!canSubmit()) return;

    setSubmitting(true);
    setErr(null);
    try {
      await submitCompany({
        ...form,
        founded: form.founded ? parseInt(form.founded) : null,
        mrr: form.mrr ? parseFloat(form.mrr) : null,
      }, user.id);
      setDone(true);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setSubmitting(false);
    }
  }

  function startStripeOAuth() {
    if (!STRIPE_CLIENT_ID) {
      setErr("Stripe Connect is not configured yet.");
      return;
    }
    const redirectUri = `${window.location.origin}?stripe_callback=1`;
    const url = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${STRIPE_CLIENT_ID}&scope=read_only&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = url;
  }

  if (done) {
    return (
      <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="auth-modal submit-modal">
          <button className="xcl" onClick={onClose}>×</button>
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
            <div style={{ fontFamily: "var(--serif)", fontSize: 22, marginBottom: 8 }}>Submission received</div>
            <div style={{ fontSize: 14, color: "var(--ink3)", fontWeight: 300, lineHeight: 1.6 }}>
              Your startup is under review. We'll notify you when it's approved and added to the feed.
            </div>
            <button className="pill" style={{ marginTop: 24 }} onClick={onClose}>Done</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal submit-modal">
        <button className="xcl" onClick={onClose}>×</button>

        <div className="auth-hdr">
          <div style={{ fontFamily: "var(--serif)", fontSize: 24, marginBottom: 6 }}>Submit your startup</div>
          <div style={{ fontSize: 14, color: "var(--ink3)", fontWeight: 300 }}>
            Get tracked alongside the best private companies.
          </div>
        </div>

        {/* Step indicator */}
        <div className="submit-steps">
          <button className={`sstep${step === 1 ? " on" : ""}`} onClick={() => setStep(1)}>1. Company</button>
          <button className={`sstep${step === 2 ? " on" : ""}`} onClick={() => setStep(2)}>2. Links</button>
          <button className={`sstep${step === 3 ? " on" : ""}`} onClick={() => setStep(3)}>3. Revenue</button>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="submit-section">
              <label className="submit-label">
                Company name <span className="req">*</span>
                <input className="auth-input" value={form.company_name} onChange={e => set("company_name", e.target.value)} placeholder="Acme Inc." required />
              </label>
              <label className="submit-label">
                Website
                <input className="auth-input" value={form.website} onChange={e => set("website", e.target.value)} placeholder="https://acme.com" type="url" />
              </label>
              <label className="submit-label">
                Description
                <textarea className="auth-input submit-textarea" value={form.description} onChange={e => set("description", e.target.value.slice(0, 300))} placeholder="What does your company do?" maxLength={300} />
                <span className="char-count">{form.description.length}/300</span>
              </label>
              <label className="submit-label">
                Category
                <select className="auth-input" value={form.category} onChange={e => set("category", e.target.value)}>
                  <option value="">Select category</option>
                  {FILTERS.filter(f => f !== "All").map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </label>
              <div className="submit-row">
                <label className="submit-label">
                  HQ Location
                  <input className="auth-input" value={form.hq} onChange={e => set("hq", e.target.value)} placeholder="San Francisco, CA" />
                </label>
                <label className="submit-label">
                  Founded
                  <input className="auth-input" value={form.founded} onChange={e => set("founded", e.target.value)} placeholder="2023" type="number" min="1900" max="2030" />
                </label>
              </div>
              <div className="submit-row">
                <label className="submit-label">
                  Team size
                  <input className="auth-input" value={form.employees} onChange={e => set("employees", e.target.value)} placeholder="~40" />
                </label>
                <label className="submit-label">
                  Total raised
                  <input className="auth-input" value={form.raised} onChange={e => set("raised", e.target.value)} placeholder="$20M" />
                </label>
              </div>
              <button type="button" className="pill" style={{ width: "100%", marginTop: 8 }} onClick={() => setStep(2)}>Next: Social Links →</button>
            </div>
          )}

          {step === 2 && (
            <div className="submit-section">
              <label className="submit-label">
                LinkedIn URL
                <input className="auth-input" value={form.linkedin} onChange={e => set("linkedin", e.target.value)} placeholder="https://linkedin.com/company/acme" type="url" />
              </label>
              <label className="submit-label">
                Twitter / X URL
                <input className="auth-input" value={form.twitter} onChange={e => set("twitter", e.target.value)} placeholder="https://x.com/acme" type="url" />
              </label>
              <label className="submit-label">
                GitHub org
                <input className="auth-input" value={form.github} onChange={e => set("github", e.target.value)} placeholder="acme" />
              </label>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button type="button" className="pill-o" style={{ flex: 1 }} onClick={() => setStep(1)}>← Back</button>
                <button type="button" className="pill" style={{ flex: 1 }} onClick={() => setStep(3)}>Next: Revenue →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="submit-section">
              <label className="submit-label">
                Self-reported MRR
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: 11, color: "var(--ink3)", fontSize: 14 }}>$</span>
                  <input className="auth-input" style={{ paddingLeft: 28 }} value={form.mrr} onChange={e => set("mrr", e.target.value)} placeholder="50,000" type="number" min="0" />
                </div>
              </label>

              {form.mrr_verified ? (
                <div className="verified-badge">
                  <span style={{ color: "var(--g)" }}>✓</span> MRR verified via Stripe — ${Number(form.mrr).toLocaleString()}
                </div>
              ) : (
                <button type="button" className="stripe-btn" onClick={startStripeOAuth}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.92 3.757 7.17c0 4.04 2.484 5.624 5.186 6.686 2.19.858 2.96 1.553 2.96 2.525 0 1.105-.863 1.593-2.168 1.593-1.905 0-4.932-.91-6.896-2.12L2 21.475C3.907 22.494 6.955 23.5 10.027 23.5c2.6 0 4.794-.655 6.332-1.863 1.645-1.282 2.483-3.168 2.483-5.602 0-4.128-2.594-5.714-4.866-6.885z" fill="#6772E5"/></svg>
                  Verify with Stripe Connect
                </button>
              )}

              <div style={{ fontSize: 12, color: "var(--ink4)", marginTop: 4, lineHeight: 1.5 }}>
                Optional. Connect your Stripe account (read-only) to verify revenue and get a verified badge on your listing.
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button type="button" className="pill-o" style={{ flex: 1 }} onClick={() => setStep(2)}>← Back</button>
                <button type="submit" className="pill" style={{ flex: 1 }} disabled={submitting || !canSubmit()}>
                  {submitting ? "Submitting..." : "Submit for review →"}
                </button>
              </div>
            </div>
          )}

          {err && <div style={{ color: "var(--r)", fontSize: 12, marginTop: 10, textAlign: "center" }}>{err}</div>}
        </form>
      </div>
    </div>
  );
}
