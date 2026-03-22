import { useState } from "react";

const STEPS = ["Brand Details", "Revenue Verification", "Review"];

export default function ListBrandModal({ onClose }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", website: "", category: "", hq: "", founded: "",
    employees: "", description: "", askingPrice: "",
    linkedin: "", email: "",
  });
  const [verifyMethod, setVerifyMethod] = useState(null); // "stripe" | "shopify" | "skip"

  function set(k, v) { setForm(prev => ({ ...prev, [k]: v })); }

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="panel" style={{ width: 560 }}>
        <div className="phdr">
          <div>
            <div className="pco">List Your Brand</div>
            <div className="psub">Get in front of qualified buyers and investors</div>
          </div>
          <button className="xcl" onClick={onClose}>×</button>
        </div>

        {/* Steps */}
        <div className="lb-steps">
          {STEPS.map((s, i) => (
            <div key={i} className={`lb-step${i === step ? " on" : ""}${i < step ? " done" : ""}`}>
              <div className="lb-step-num">{i < step ? "✓" : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div className="pbody">
          {step === 0 && (
            <div className="lb-form">
              <div className="lb-section-title">Brand Information</div>
              <div className="lb-row">
                <label className="lb-field">
                  <span className="lb-label">Brand Name *</span>
                  <input className="lb-input" value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. WelleCo" />
                </label>
                <label className="lb-field">
                  <span className="lb-label">Website</span>
                  <input className="lb-input" value={form.website} onChange={e => set("website", e.target.value)} placeholder="https://" />
                </label>
              </div>
              <div className="lb-row">
                <label className="lb-field">
                  <span className="lb-label">Category *</span>
                  <select className="lb-input" value={form.category} onChange={e => set("category", e.target.value)}>
                    <option value="">Select category</option>
                    <option>Wellness Supplements</option>
                    <option>Beauty & Skincare</option>
                    <option>Food & Beverage</option>
                    <option>Personal Care</option>
                    <option>Pet Products</option>
                    <option>Home & Lifestyle</option>
                    <option>Apparel & Fashion</option>
                    <option>Health & Fitness</option>
                    <option>Other</option>
                  </select>
                </label>
                <label className="lb-field">
                  <span className="lb-label">HQ Location</span>
                  <input className="lb-input" value={form.hq} onChange={e => set("hq", e.target.value)} placeholder="City, Country" />
                </label>
              </div>
              <div className="lb-row">
                <label className="lb-field">
                  <span className="lb-label">Founded</span>
                  <input className="lb-input" type="number" value={form.founded} onChange={e => set("founded", e.target.value)} placeholder="2020" />
                </label>
                <label className="lb-field">
                  <span className="lb-label">Team Size</span>
                  <input className="lb-input" type="number" value={form.employees} onChange={e => set("employees", e.target.value)} placeholder="25" />
                </label>
              </div>
              <label className="lb-field">
                <span className="lb-label">Brief Description</span>
                <textarea className="lb-input lb-textarea" value={form.description} onChange={e => set("description", e.target.value)} placeholder="What does your brand do? What makes it unique?" />
              </label>
              <div className="lb-row">
                <label className="lb-field">
                  <span className="lb-label">Asking Price (optional)</span>
                  <input className="lb-input" value={form.askingPrice} onChange={e => set("askingPrice", e.target.value)} placeholder="$500K - $2M" />
                </label>
                <label className="lb-field">
                  <span className="lb-label">Contact Email *</span>
                  <input className="lb-input" type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@brand.com" />
                </label>
              </div>
              <button className="pill" style={{ width: "100%", marginTop: 16 }} onClick={() => setStep(1)}>
                Continue to verification →
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="lb-form">
              <div className="lb-section-title">Verify Your Revenue</div>
              <p style={{ fontSize: 14, color: "var(--ink3)", fontWeight: 300, lineHeight: 1.7, marginBottom: 24 }}>
                Verified brands get priority placement and a trust badge. Buyers are 3x more likely to engage with verified listings. Revenue data is only shared with qualified buyers.
              </p>

              <div className="lb-verify-options">
                <div
                  className={`lb-verify-card${verifyMethod === "stripe" ? " on" : ""}`}
                  onClick={() => setVerifyMethod("stripe")}
                >
                  <div className="lb-vc-icon">💳</div>
                  <div className="lb-vc-name">Connect Stripe</div>
                  <div className="lb-vc-desc">Automatically verify MRR, ARR, and growth metrics from your Stripe account</div>
                  <div className="lb-vc-badge">Recommended</div>
                </div>

                <div
                  className={`lb-verify-card${verifyMethod === "shopify" ? " on" : ""}`}
                  onClick={() => setVerifyMethod("shopify")}
                >
                  <div className="lb-vc-icon">🛍️</div>
                  <div className="lb-vc-name">Connect Shopify</div>
                  <div className="lb-vc-desc">Pull revenue, order volume, and growth data directly from your Shopify store</div>
                </div>

                <div
                  className={`lb-verify-card${verifyMethod === "skip" ? " on" : ""}`}
                  onClick={() => setVerifyMethod("skip")}
                >
                  <div className="lb-vc-icon">📋</div>
                  <div className="lb-vc-name">Skip for Now</div>
                  <div className="lb-vc-desc">List without verification — your brand will appear as "claimed" until revenue is verified</div>
                </div>
              </div>

              {verifyMethod && verifyMethod !== "skip" && (
                <div className="lb-connect-box">
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)", marginBottom: 8 }}>
                    {verifyMethod === "stripe" ? "Stripe" : "Shopify"} Connect
                  </div>
                  <p style={{ fontSize: 13, color: "var(--ink3)", fontWeight: 300, marginBottom: 16 }}>
                    You'll be redirected to {verifyMethod === "stripe" ? "Stripe" : "Shopify"} to authorize read-only access to your revenue data. We never store credentials or make transactions.
                  </p>
                  <button className="pill-o" style={{ width: "100%" }}>
                    Connect {verifyMethod === "stripe" ? "Stripe" : "Shopify"} Account →
                  </button>
                </div>
              )}

              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button className="pill-o" onClick={() => setStep(0)}>← Back</button>
                <button className="pill" style={{ flex: 1 }} onClick={() => setStep(2)}>
                  {verifyMethod === "skip" ? "Continue without verification →" : "Continue →"}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="lb-form">
              <div className="lb-section-title">Review Your Listing</div>

              <div className="lb-review-card">
                <div className="lb-review-header">
                  <div className="clogo" style={{ width: 48, height: 48, fontSize: 16 }}>
                    {form.name ? form.name.slice(0, 2).toUpperCase() : "BR"}
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 600 }}>{form.name || "Your Brand"}</div>
                    <div style={{ fontSize: 13, color: "var(--ink3)", fontWeight: 300 }}>{form.category || "Category"} · {form.hq || "Location"}</div>
                  </div>
                  <span className={`lb-review-badge ${verifyMethod === "skip" ? "claimed" : "verified"}`}>
                    {verifyMethod === "skip" ? "Claimed" : "✓ Verified"}
                  </span>
                </div>

                {form.description && (
                  <p style={{ fontSize: 13, color: "var(--ink3)", fontWeight: 300, lineHeight: 1.6, margin: "14px 0" }}>{form.description}</p>
                )}

                <div className="info-grid" style={{ marginBottom: 0 }}>
                  {form.founded && <div className="info-row"><span className="info-l">Founded</span><span className="info-v">{form.founded}</span></div>}
                  {form.employees && <div className="info-row"><span className="info-l">Team</span><span className="info-v">{form.employees}</span></div>}
                  {form.askingPrice && <div className="info-row"><span className="info-l">Asking Price</span><span className="info-v">{form.askingPrice}</span></div>}
                  {verifyMethod !== "skip" && <div className="info-row"><span className="info-l">Revenue</span><span className="info-v" style={{ color: "var(--g)" }}>Verified via {verifyMethod === "stripe" ? "Stripe" : "Shopify"}</span></div>}
                </div>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button className="pill-o" onClick={() => setStep(1)}>← Back</button>
                <button className="pill" style={{ flex: 1 }} onClick={onClose}>
                  Submit Listing →
                </button>
              </div>

              <p style={{ fontSize: 12, color: "var(--ink4)", textAlign: "center", marginTop: 16, fontWeight: 300 }}>
                Listings are reviewed within 24 hours. You'll receive an email confirmation at {form.email || "your email"}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
