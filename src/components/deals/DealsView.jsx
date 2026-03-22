import { useState, useEffect } from "react";
import { BRAND_STATUS_FILTERS, BRAND_SORTS } from "../../lib/constants";
import useDeals from "../../hooks/useDeals";
import DealCard from "./DealCard";
import BrandPage from "./BrandPage";
import ListBrandModal from "./ListBrandModal";

const VERIFY_TABS = ["All Brands", "Verified", "Claimed", "Unverified"];

export default function DealsView({ watchlist, onToggleWatch, initialDeal, onClearInitialDeal }) {
  const [verifyTab, setVerifyTab] = useState("All Brands");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sort, setSort] = useState("name");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(initialDeal || null);
  const [showListModal, setShowListModal] = useState(false);

  useEffect(() => {
    if (initialDeal) {
      setSelected(initialDeal);
      onClearInitialDeal?.();
    }
  }, [initialDeal]);

  const { brands } = useDeals({ statusFilter, sort, search });

  // Filter by verification tab
  const filtered = verifyTab === "All Brands"
    ? brands
    : brands.filter(b => b.verification === verifyTab.toLowerCase());

  const verifiedCount = brands.filter(b => b.verification === "verified").length;
  const claimedCount = brands.filter(b => b.verification === "claimed").length;
  const unverifiedCount = brands.filter(b => b.verification === "unverified").length;

  // Full-page brand view
  if (selected) {
    return (
      <BrandPage
        brand={selected}
        onBack={() => setSelected(null)}
        watched={watchlist.includes(selected.id)}
        onToggleWatch={onToggleWatch}
      />
    );
  }

  return (
    <div className="feed">
      <div className="feed-hdr">
        <div>
          <h2 className="sec-title">Browse Brands</h2>
          <p style={{ color: "var(--ink3)", fontSize: 14, marginTop: 6, fontWeight: 300 }}>
            Spot potential within consumer brands. Publicly available data, gap analysis, and white space opportunities.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div className="srch">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#aeada5" strokeWidth="1.4" /><path d="M9.5 9.5l3 3" stroke="#aeada5" strokeWidth="1.4" strokeLinecap="round" /></svg>
            <input placeholder="Search brands…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="pill" onClick={() => setShowListModal(true)}>List Your Brand</button>
        </div>
      </div>

      {/* Verification Tabs */}
      <div className="idea-sub-tabs" style={{ marginBottom: 16 }}>
        {VERIFY_TABS.map(t => {
          const count = t === "All Brands" ? brands.length : t === "Verified" ? verifiedCount : t === "Claimed" ? claimedCount : unverifiedCount;
          return (
            <button key={t} className={`ist-btn${verifyTab === t ? " on" : ""}`} onClick={() => setVerifyTab(t)}>
              {t === "Verified" && <span style={{ marginRight: 4 }}>✓</span>}
              {t}
              <span className="ist-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Status + Sort Filters */}
      <div className="filters">
        {BRAND_STATUS_FILTERS.map(f => (
          <button key={f} className={`fchip${statusFilter === f ? " on" : ""}`} onClick={() => setStatusFilter(f)}>{f}</button>
        ))}
        <div className="sort-sep" />
        {BRAND_SORTS.map(s => (
          <button key={s.k} className={`sbtn${sort === s.k ? " on" : ""}`} onClick={() => setSort(s.k)}>{s.l}</button>
        ))}
      </div>

      {/* CTA Banner — show when on Verified tab */}
      {verifyTab === "Verified" && (
        <div className="lb-cta-banner" onClick={() => setShowListModal(true)}>
          <div>
            <div className="lb-cta-title">List your brand with verified revenue</div>
            <div className="lb-cta-desc">Connect Stripe or Shopify to verify your revenue and get priority placement in front of qualified buyers and consultants.</div>
          </div>
          <button className="bw" style={{ flexShrink: 0 }}>List Your Brand →</button>
        </div>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="cgrid deal-grid">
          {filtered.map(b => (
            <DealCard
              key={b.id}
              brand={b}
              watched={watchlist.includes(b.id)}
              onSelect={setSelected}
              onToggleWatch={onToggleWatch}
            />
          ))}
        </div>
      ) : (
        <div style={{ padding: 60, textAlign: "center", border: "1px solid var(--bd)", borderRadius: 14 }}>
          <div style={{ fontSize: 22, color: "var(--ink4)", marginBottom: 10 }}>◇</div>
          <div style={{ fontSize: 15, color: "var(--ink3)", fontWeight: 300 }}>
            No brands match your filters.
          </div>
          <button className="fchip" style={{ marginTop: 14 }} onClick={() => { setStatusFilter("All"); setSearch(""); }}>Clear filters</button>
        </div>
      )}

      {showListModal && <ListBrandModal onClose={() => setShowListModal(false)} />}
    </div>
  );
}
