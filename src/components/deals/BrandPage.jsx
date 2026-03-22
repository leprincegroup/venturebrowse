import { useState } from "react";
import { IDEA_CATEGORIES, IDEA_PROBLEMS, IDEA_OPPORTUNITIES } from "../../data";
import { MARKET_TRENDS } from "../../data/trends";
import AreaChart from "../common/charts/AreaChart";
import AnalyticalChart from "../common/charts/AnalyticalChart";
import BarChart from "../common/charts/BarChart";
import RadarChart from "../common/charts/RadarChart";
import ComparisonBars from "../common/charts/ComparisonBars";
import DonutChart from "../common/charts/DonutChart";
import MatrixQuadrant from "../common/charts/MatrixQuadrant";
import SignalTimeline from "../common/charts/SignalTimeline";
import FlagList from "../common/charts/FlagList";
import StarDistribution from "../common/charts/StarDistribution";
import Sparkline from "../common/Sparkline";

const STATUS_LABEL = {
  "looking-to-sell": "Looking to Sell", "growth-stalled": "Growth Stalled",
  "open-to-consulting": "Open to Consulting", "growing": "Growing",
};
const STATUS_CLASS = {
  "looking-to-sell": "ta", "growth-stalled": "tr", "open-to-consulting": "tb", "growing": "tg",
};
const SEV_CLASS = { critical: "tr", high: "ta", medium: "tm", low: "tm" };
const SRC_COLORS = { organic: "var(--g)", direct: "var(--b)", paid: "var(--a)", social: "#E1306C", referral: "var(--ink3)", email: "#FF9900" };

function buildRadar(brand) {
  const td = brand.trafficTrend ? (brand.trafficTrend[brand.trafficTrend.length - 1] / brand.trafficTrend[0]) * 10 : 5;
  const sd = brand.searchInterest ? (brand.searchInterest[brand.searchInterest.length - 1] / brand.searchInterest[0]) * 10 : 5;
  const soc = brand.socialFollowing?.instagram ? (parseInt(brand.socialFollowing.instagram) >= 1000 ? 8 : 6) : 3;
  const gaps = Math.max(0, 10 - brand.gaps.length * 2);
  const opps = Math.min(10, brand.whiteSpace.length * 2.5);
  const rev = brand.customerVoice?.trustpilotRating ? brand.customerVoice.trustpilotRating * 2 : 5;
  return [
    { label: "Traffic", value: Math.min(10, Math.max(1, Math.round(td * 10) / 10)) },
    { label: "Social", value: soc },
    { label: "Reviews", value: Math.round(rev * 10) / 10 },
    { label: "Ops", value: Math.round(gaps * 10) / 10 },
    { label: "Oppty", value: Math.round(opps * 10) / 10 },
    { label: "Search", value: Math.min(10, Math.max(1, Math.round(sd * 10) / 10)) },
  ];
}

export default function BrandPage({ brand, onBack, watched, onToggleWatch }) {
  const trafficDown = brand.trafficTrend && brand.trafficTrend[0] > brand.trafficTrend[brand.trafficTrend.length - 1];
  const trafficColor = trafficDown ? "var(--r)" : "var(--g)";
  const radar = buildRadar(brand);

  const trafficSrcSegments = Object.entries(brand.trafficSources || {}).map(([k, v]) => ({
    value: v, color: SRC_COLORS[k] || "var(--ink4)", label: k,
  }));

  const countryBars = (brand.topCountries || []).map(c => ({
    label: c.country.length > 12 ? c.country.slice(0, 10) + "…" : c.country,
    value: c.pct, displayValue: `${c.pct}%`, color: brand.brandColor,
  }));

  return (
    <div className="bp">
      {/* Header */}
      <div className="bp-header" style={{ background: brand.bgGradient || brand.brandColor }}>
        <div className="bp-hdr-top">
          <button className="bp-back" onClick={onBack}>← Back</button>
          <div style={{ display: "flex", gap: 8 }}>
            <button className={`dc2-wl${watched ? " on" : ""}`} onClick={() => onToggleWatch(brand.id)}>{watched ? "♥" : "♡"}</button>
          </div>
        </div>
        <div className="bp-hdr-main">
          <div className="bp-logo">{brand.logo}</div>
          <div className="bp-hdr-info">
            <div className="bp-hdr-name">
              {brand.name}
              {brand.verification === "verified" && <span className="vb-badge verified" style={{ marginLeft: 10 }}>✓ Verified</span>}
              {brand.verification === "claimed" && <span className="vb-badge claimed" style={{ marginLeft: 10 }}>Claimed</span>}
            </div>
            <div className="bp-hdr-meta">{brand.category} · {brand.hq} · Est. {brand.founded} · {brand.website}</div>
          </div>
        </div>
        <div className="bp-hdr-stats">
          <div><span className="bp-hs-v">{brand.employees}</span><span className="bp-hs-l">Team</span></div>
          <div><span className="bp-hs-v">{brand.socialFollowing?.instagram || "—"}</span><span className="bp-hs-l">Instagram</span></div>
          <div><span className="bp-hs-v">{brand.socialFollowing?.tiktok || "—"}</span><span className="bp-hs-l">TikTok</span></div>
          {brand.verifiedRevenue && <div><span className="bp-hs-v">{brand.verifiedRevenue}</span><span className="bp-hs-l">Revenue ✓</span></div>}
          <div><span className="bp-hs-v">{brand.customerVoice?.trustpilotRating || "—"}/5</span><span className="bp-hs-l">Trustpilot</span></div>
          <div><span className="bp-hs-v">{brand.hiring?.openRoles || 0}</span><span className="bp-hs-l">Open Roles</span></div>
        </div>
        <div className="bp-hdr-tags">
          <span className={`tag ${STATUS_CLASS[brand.status]}`} style={{ background: "rgba(255,255,255,.15)", borderColor: "rgba(255,255,255,.25)" }}>{STATUS_LABEL[brand.status]}</span>
          {brand.techStack?.map(t => <span key={t} className="bp-tech">{t}</span>)}
        </div>
      </div>

      <div className="bp-body">
        {/* About the Brand — full width, no box */}
        <div className="bp-about">
          <h2 className="bp-about-title">About {brand.name}</h2>
          <p className="bp-about-text">{brand.brandStory}</p>
          <div className="bp-about-built">
            {brand.whatTheyBuilt.map((w, i) => (
              <div key={i} className="bp-about-item">
                <span className="bp-about-check">✓</span>
                <span>{w}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Summary — full width, no box */}
        <div className="bp-exec">
          <h3 className="bp-exec-label">Executive Summary</h3>
          <p className="bp-exec-text">{brand.summary}</p>
        </div>

        {/* ─── SECTION: Overview ─── */}
        <div className="bp-section-divider">
          <span className="bp-section-label">Overview</span>
        </div>

        <div className="bp-row bp-row-3">
          <div className="bp-card">
            <div className="bp-card-title">Brand Health</div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <RadarChart axes={radar} size={200} color={brand.brandColor} />
            </div>
          </div>
          <div className="bp-card">
            <div className="bp-card-title">Signals</div>
            <div style={{ marginBottom: 12 }}>
              <span className="dc3-flag red" style={{ marginRight: 6 }}>{brand.redFlags?.length || 0} red flags</span>
              <span className="dc3-flag green">{brand.greenFlags?.length || 0} green flags</span>
            </div>
            <SignalTimeline events={(brand.signalTimeline || []).slice(0, 4)} />
          </div>
          <div className="bp-card">
            <div className="bp-card-title">Competitive Landscape</div>
            {brand.competitors.map((c, i) => (
              <div key={i} style={{ padding: "10px 0", borderBottom: i < brand.competitors.length - 1 ? "1px solid var(--bd)" : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink3)" }}>{c.metric}</span>
                </div>
                <p style={{ fontSize: 11, color: "var(--ink4)", fontWeight: 300 }}>{c.strength}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── SECTION: Digital Performance ─── */}
        <div className="bp-section-divider">
          <span className="bp-section-label">Digital Performance</span>
        </div>

        {/* Row 2: Traffic + Sources + Countries */}
        <div className="bp-row bp-row-3">
          <div className="bp-card bp-card-wide">
            <div className="bp-card-title">Website Traffic (12 months)</div>
            <AnalyticalChart
              series={[{ name: brand.name, data: brand.trafficTrend || [], color: trafficColor }]}
              yLabel="Visits (K)" height={180} showMinMax={true}
              formatValue={v => `${v}K`}
            />
          </div>
          <div className="bp-card">
            <div className="bp-card-title">Traffic Sources</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <DonutChart segments={trafficSrcSegments} size={80} strokeWidth={10} />
              <div style={{ flex: 1 }}>
                {trafficSrcSegments.map(s => (
                  <div key={s.label} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 11 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                      <span style={{ textTransform: "capitalize", color: "var(--ink2)" }}>{s.label}</span>
                    </span>
                    <span style={{ fontFamily: "var(--mono)", fontWeight: 600, color: "var(--ink)" }}>{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bp-card">
            <div className="bp-card-title">Top Countries</div>
            <ComparisonBars items={countryBars} unit="%" />
          </div>
        </div>

        {/* ─── SECTION: Advertising & Products ─── */}
        <div className="bp-section-divider">
          <span className="bp-section-label">Advertising & Products</span>
        </div>
        {/* Meta Ads — Visual Ad Previews */}
        <div className="bp-card-title" style={{ padding: "0 0 12px" }}>Top Meta Ads by Impressions</div>
        {(brand.metaAds || []).length > 0 ? (
          <div className="bp-ads-visual">
            {brand.metaAds.map((ad, i) => (
              <div className="bp-adv" key={i}>
                <div className="bp-adv-visual" style={{ background: ad.color || brand.brandColor }}>
                  <div className="bp-adv-format-badge">{ad.format}</div>
                  <div className="bp-adv-brand">{brand.name}</div>
                </div>
                <div className="bp-adv-content">
                  <div className="bp-adv-header">
                    <div className="bp-adv-avatar" style={{ background: brand.brandColor }}>{brand.logo}</div>
                    <div>
                      <div className="bp-adv-sponsor">{brand.name} · <span className={`bp-ad-status ${ad.status}`}>{ad.status}</span></div>
                      <div className="bp-adv-label">Sponsored</div>
                    </div>
                  </div>
                  <div className="bp-adv-body">{ad.body || ad.headline}</div>
                  <div className="bp-adv-headline">{ad.headline}</div>
                  <div className="bp-adv-cta">{ad.cta || "Shop Now"}</div>
                  <div className="bp-adv-metrics">
                    <span>{ad.impressions} impressions</span>
                    <span>{ad.daysRunning}d running</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: 40, textAlign: "center", color: "var(--ink4)", fontSize: 13, border: "1px solid var(--bd)", borderRadius: 14 }}>No active Meta ads detected</div>
        )}

        {/* Best Sellers — Product Cards */}
        <div className="bp-row bp-row-2" style={{ marginTop: 16 }}>
          <div className="bp-card">
            <div className="bp-card-title">Best Selling Products</div>
            <div className="bp-prod-grid">
              {(brand.bestSellers || []).map((p, i) => (
                <div className="bp-prodv" key={i}>
                  <div className="bp-prodv-img" style={{ background: p.color || brand.brandColor }}>
                    <span className="bp-prodv-icon">{p.icon || "📦"}</span>
                    <span className="bp-prodv-badge">#{i + 1}</span>
                  </div>
                  <div className="bp-prodv-info">
                    <div className="bp-prodv-name">{p.name}</div>
                    <div className="bp-prodv-cat">{p.category}</div>
                    <div className="bp-prodv-price">{p.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bp-card">
            <div className="bp-card-title">Pricing Architecture</div>
            <div className="bp-pricing-grid">
              <div><span className="dc3-sv">{brand.pricing?.skuCount || "—"}</span><span className="dc3-sl">SKUs</span></div>
              <div><span className="dc3-sv">{brand.pricing?.priceRange || "—"}</span><span className="dc3-sl">Range</span></div>
              <div><span className="dc3-sv">${brand.pricing?.avgPrice || "—"}</span><span className="dc3-sl">Avg Price</span></div>
              <div><span className="dc3-sv">{brand.pricing?.hasSubscription ? "Yes" : "No"}</span><span className="dc3-sl">Subscription</span></div>
            </div>
            {brand.pricing?.hasSubscription && brand.pricing?.subDiscount && (
              <div style={{ marginTop: 12, padding: "8px 10px", background: "var(--gl)", borderRadius: 6, fontSize: 12, color: "var(--g)", fontWeight: 500, textAlign: "center" }}>
                Subscription discount: {brand.pricing.subDiscount}
              </div>
            )}
          </div>
        </div>

        {/* ─── SECTION: Growth & Operations ─── */}
        <div className="bp-section-divider">
          <span className="bp-section-label">Growth & Operations</span>
        </div>
        {/* ─── SECTION: Social Media Presence ─── */}
        <div className="bp-section-divider">
          <span className="bp-section-label">Social Media Presence</span>
        </div>

        {/* Platform Velocity */}
        <div className="bp-row bp-row-2" style={{ marginBottom: 16 }}>
          {Object.entries(brand.socialVelocity || {}).map(([platform, data]) => (
            <div className="bp-card" key={platform}>
              <div className="bp-card-title">{platform} Performance</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div><span className="dc3-sv" style={{ fontSize: 20 }}>{brand.socialFollowing?.[platform] || "—"}</span><span className="dc3-sl">Followers</span></div>
                <div><span className="dc3-sv">{data.postsPerWeek}/wk</span><span className="dc3-sl">Post Frequency</span></div>
                <div><span className="dc3-sv">{data.engagementRate}%</span><span className="dc3-sl">Engagement Rate</span></div>
              </div>
              <AnalyticalChart
                series={[{ name: "Followers", data: data.followerTrend, color: brand.brandColor }]}
                yLabel={platform === "instagram" ? "Followers (K)" : "Followers (K)"} height={140}
                formatValue={v => `${v}K`}
              />
            </div>
          ))}
        </div>

        {/* Latest Posts */}
        {brand.socialPosts && (
          <>
            {brand.socialPosts.instagram && (
              <div style={{ marginBottom: 16 }}>
                <div className="bp-card-title" style={{ padding: "0 0 12px" }}>Latest Instagram Posts</div>
                <div className="bp-post-grid">
                  {brand.socialPosts.instagram.map((post, i) => (
                    <div className="bp-post" key={i}>
                      <div className="bp-post-img" style={{ background: post.color || brand.brandColor }}>
                        <span className="bp-post-type">{post.type === "reel" ? "Reel" : post.type === "carousel" ? "Carousel" : "Post"}</span>
                        <span className="bp-post-icon">{post.icon || "📷"}</span>
                      </div>
                      <div className="bp-post-body">
                        <p className="bp-post-caption">{post.caption.length > 80 ? post.caption.slice(0, 80) + "…" : post.caption}</p>
                        <div className="bp-post-metrics">
                          <span>♡ {post.likes >= 1000 ? (post.likes / 1000).toFixed(1) + "K" : post.likes}</span>
                          <span>💬 {post.comments}</span>
                          <span>{post.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {brand.socialPosts.tiktok && (
              <div style={{ marginBottom: 16 }}>
                <div className="bp-card-title" style={{ padding: "0 0 12px" }}>Latest TikTok Posts</div>
                <div className="bp-post-grid">
                  {brand.socialPosts.tiktok.map((post, i) => (
                    <div className="bp-post" key={i}>
                      <div className="bp-post-img bp-post-tiktok" style={{ background: post.color || "#0d0d0b" }}>
                        <span className="bp-post-type">Video</span>
                        <span className="bp-post-icon">{post.icon || "🎬"}</span>
                      </div>
                      <div className="bp-post-body">
                        <p className="bp-post-caption">{post.caption.length > 80 ? post.caption.slice(0, 80) + "…" : post.caption}</p>
                        <div className="bp-post-metrics">
                          <span>♡ {post.likes >= 1000 ? (post.likes / 1000).toFixed(1) + "K" : post.likes}</span>
                          <span>💬 {post.comments}</span>
                          <span>{post.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ─── SECTION: SEO, Keywords & Search ─── */}
        {brand.keywords && brand.keywords.length > 0 && (
          <>
            <div className="bp-section-divider">
              <span className="bp-section-label">SEO, Keywords & Search</span>
            </div>

            {/* Keyword trend chart — top 3 keywords */}
            <div className="bp-card" style={{ marginBottom: 16 }}>
              <div className="bp-card-title">Keyword Search Volume Trends (12 months)</div>
              <AnalyticalChart
                series={brand.keywords.slice(0, 3).map(k => ({
                  name: k.keyword, data: k.trend, color: k.position <= 3 ? "var(--g)" : k.position <= 10 ? "var(--a)" : "var(--r)",
                }))}
                yLabel="Monthly searches" height={220} showMinMax={false}
                formatValue={v => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v}
              />
            </div>

            {/* Keyword table */}
            <div className="bp-card" style={{ marginBottom: 16 }}>
              <div className="bp-card-title">Top Keywords</div>
              <div className="bp-kw-table">
                <div className="bp-kw-header">
                  <span className="bp-kw-cell bp-kw-keyword">Keyword</span>
                  <span className="bp-kw-cell bp-kw-vol">Volume</span>
                  <span className="bp-kw-cell bp-kw-cpc">CPC</span>
                  <span className="bp-kw-cell bp-kw-comp">Competition</span>
                  <span className="bp-kw-cell bp-kw-pos">Position</span>
                  <span className="bp-kw-cell bp-kw-trend">12mo Trend</span>
                </div>
                {brand.keywords.map((k, i) => (
                  <div className="bp-kw-row" key={i}>
                    <span className="bp-kw-cell bp-kw-keyword">{k.keyword}</span>
                    <span className="bp-kw-cell bp-kw-vol">{k.volume.toLocaleString()}</span>
                    <span className="bp-kw-cell bp-kw-cpc">${k.cpc.toFixed(2)}</span>
                    <span className="bp-kw-cell bp-kw-comp">
                      <span className={`bp-kw-comp-badge ${k.competition}`}>{k.competition}</span>
                    </span>
                    <span className="bp-kw-cell bp-kw-pos">
                      <span className={`bp-kw-pos-badge ${k.position <= 3 ? "top3" : k.position <= 10 ? "top10" : k.position <= 20 ? "top20" : "low"}`}>#{k.position}</span>
                    </span>
                    <span className="bp-kw-cell bp-kw-trend">
                      <Sparkline data={k.trend} color={k.trend[0] < k.trend[11] ? "var(--g)" : "var(--r)"} w={60} h={18} />
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO metrics */}
            <div className="bp-row bp-row-2" style={{ marginBottom: 16 }}>
              <div className="bp-card">
                <div className="bp-card-title">Organic Keyword Rankings (12mo)</div>
                <AnalyticalChart
                  series={[{ name: "Organic Keywords", data: brand.seoHealth?.keywordTrend || [], color: brand.seoHealth?.keywordTrend?.[0] > brand.seoHealth?.keywordTrend?.[11] ? "var(--r)" : "var(--g)" }]}
                  yLabel="Keywords" height={160}
                  formatValue={v => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v}
                />
              </div>
              <div className="bp-card">
                <div className="bp-card-title">SEO Overview</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div><span className="dc3-sv" style={{ fontSize: 28 }}>{brand.seoHealth?.domainAuthority || "—"}</span><span className="dc3-sl">Domain Authority</span></div>
                  <div><span className="dc3-sv" style={{ fontSize: 28 }}>{brand.seoHealth?.organicKeywords?.toLocaleString() || "—"}</span><span className="dc3-sl">Organic Keywords</span></div>
                </div>
                <ComparisonBars items={[
                  { label: "Top 3 positions", value: brand.keywords.filter(k => k.position <= 3).length, displayValue: String(brand.keywords.filter(k => k.position <= 3).length), color: "var(--g)" },
                  { label: "Top 10 positions", value: brand.keywords.filter(k => k.position <= 10).length, displayValue: String(brand.keywords.filter(k => k.position <= 10).length), color: "var(--a)" },
                  { label: "Page 1 (top 20)", value: brand.keywords.filter(k => k.position <= 20).length, displayValue: String(brand.keywords.filter(k => k.position <= 20).length), color: "var(--b)" },
                ]} maxValue={brand.keywords.length} />
              </div>
            </div>
          </>
        )}

        {/* ─── SECTION: Retailers & Marketplaces ─── */}
        {brand.retailers && brand.retailers.length > 0 && (
          <>
            <div className="bp-section-divider">
              <span className="bp-section-label">Retailers & Marketplaces</span>
            </div>
            <div className="bp-card" style={{ marginBottom: 16 }}>
              <div className="bp-card-title">Distribution Channels</div>
              <div className="bp-retail-grid">
                {brand.retailers.map((r, i) => (
                  <div className={`bp-retail-card ${r.status}`} key={i}>
                    <div className="bp-retail-top">
                      <div className="bp-retail-icon">
                        {r.type === "DTC" ? "🌐" : r.type === "Marketplace" ? "🛒" : r.type === "Luxury Marketplace" ? "💎" : r.type === "Own Retail" ? "🏪" : "🏬"}
                      </div>
                      <div className="bp-retail-info">
                        <div className="bp-retail-name">{r.name}</div>
                        <div className="bp-retail-type">{r.type}</div>
                      </div>
                      <span className={`bp-retail-status ${r.status}`}>{r.status}</span>
                    </div>
                    <div className="bp-retail-note">{r.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ─── SECTION: Amazon & Marketplace Intelligence ─── */}
        {brand.amazon && brand.amazon.products?.length > 0 && (
          <>
            <div className="bp-section-divider">
              <span className="bp-section-label">Amazon & Marketplace Intelligence</span>
            </div>

            <div className="bp-card" style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div className="bp-card-title" style={{ marginBottom: 0 }}>Amazon Product Tracking</div>
                <span className={`tag ${brand.amazon.isOfficial ? "tg" : "ta"}`}>{brand.amazon.isOfficial ? "Official Seller" : "Unauthorized Resellers"}</span>
              </div>
              {brand.amazon.note && <p style={{ fontSize: 12, color: "var(--ink3)", marginBottom: 16, fontWeight: 400 }}>{brand.amazon.note}</p>}

              <div className="bp-amazon-grid">
                {brand.amazon.products.map((p, i) => (
                  <div className="bp-amazon-card" key={i}>
                    <div className="bp-amz-header">
                      <div className="bp-amz-rank">#{p.bsr}</div>
                      <div className="bp-amz-category">{p.bsrCategory}</div>
                    </div>
                    <div className="bp-amz-name">{p.name}</div>
                    <div className="bp-amz-chart">
                      <AnalyticalChart
                        series={[{ name: "BSR", data: p.bsrTrend, color: p.bsrTrend[0] < p.bsrTrend[11] ? "var(--r)" : "var(--g)" }]}
                        yLabel="BSR Rank" height={120} showDots={false} showArea={true}
                        formatValue={v => `#${v.toLocaleString()}`}
                      />
                      <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink4)", textAlign: "center", marginTop: 4 }}>
                        {p.bsrTrend[0] < p.bsrTrend[11] ? "↑ BSR rising = declining sales" : "↓ BSR falling = increasing sales"}
                      </div>
                    </div>
                    <div className="bp-amz-stats">
                      <div><span className="dc3-sv">{p.price}</span><span className="dc3-sl">Price</span></div>
                      <div><span className="dc3-sv">{p.rating}/5</span><span className="dc3-sl">Rating</span></div>
                      <div><span className="dc3-sv">{p.reviews.toLocaleString()}</span><span className="dc3-sl">Reviews</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ─── SECTION: Hiring & Team Intelligence ─── */}
        {brand.hiring?.departments && (
          <>
            <div className="bp-section-divider">
              <span className="bp-section-label">Hiring & Team Intelligence</span>
            </div>

            <div className="bp-row bp-row-3" style={{ marginBottom: 16 }}>
              {/* Department Breakdown */}
              <div className="bp-card">
                <div className="bp-card-title">Open Roles by Department</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span className="dc3-sv" style={{ fontSize: 28, color: brand.hiring.openRoles > 0 ? "var(--g)" : "var(--r)" }}>{brand.hiring.openRoles}</span>
                  <span className="dc3-sl">Total Open Roles</span>
                </div>
                <ComparisonBars items={brand.hiring.departments.map(d => ({
                  label: d.name,
                  value: d.roles,
                  displayValue: `${d.roles} ${d.change !== 0 ? `(${d.change > 0 ? "+" : ""}${d.change})` : ""}`,
                  color: d.change > 0 ? "var(--g)" : d.change < 0 ? "var(--r)" : "var(--ink3)",
                }))} />
                <div style={{ marginTop: 14 }}>
                  <BarChart bars={brand.hiring.trend.map((v, i) => ({
                    label: ["J","F","M","A","M","J","J","A","S","O","N","D"][i], value: v,
                    color: v > 0 ? "var(--b)" : "var(--bd)",
                  }))} h={70} barWidth={16} gap={3} />
                </div>
              </div>

              {/* Key Departures */}
              <div className="bp-card">
                <div className="bp-card-title">Key Departures</div>
                {brand.hiring.recentDepartures?.map((d, i) => (
                  <div className="bp-departure" key={i}>
                    <div className="bp-dep-dot" style={{ background: d.signal === "red" ? "var(--r)" : "var(--a)" }} />
                    <div className="bp-dep-info">
                      <div className="bp-dep-role">{d.role}</div>
                      <div className="bp-dep-meta">{d.seniority} · {d.date}</div>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 16, padding: "12px 0", borderTop: "1px solid var(--bd)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div><span className="dc3-sv">{brand.hiring.avgTenure}</span><span className="dc3-sl">Avg Tenure</span></div>
                    <div><span className="dc3-sv" style={{ color: brand.hiring.tenureChange?.startsWith("-") ? "var(--r)" : "var(--g)" }}>{brand.hiring.tenureChange}</span><span className="dc3-sl">Tenure Change</span></div>
                  </div>
                </div>
              </div>

              {/* Glassdoor / Team Health */}
              {brand.hiring.glassdoor && (
                <div className="bp-card">
                  <div className="bp-card-title">Team Health (Glassdoor)</div>
                  <div className="bp-glassdoor">
                    <div className="bp-gd-item">
                      <div className="bp-gd-score" style={{ color: brand.hiring.glassdoor.rating >= 3.5 ? "var(--g)" : brand.hiring.glassdoor.rating >= 3.0 ? "var(--a)" : "var(--r)" }}>
                        {brand.hiring.glassdoor.rating}
                      </div>
                      <div className="bp-gd-label">Company Rating</div>
                      <div className="bp-gd-scale">/5.0</div>
                    </div>
                    <div className="bp-gd-item">
                      <div className="bp-gd-score" style={{ color: brand.hiring.glassdoor.ceoApproval >= 60 ? "var(--g)" : brand.hiring.glassdoor.ceoApproval >= 40 ? "var(--a)" : "var(--r)" }}>
                        {brand.hiring.glassdoor.ceoApproval}%
                      </div>
                      <div className="bp-gd-label">CEO Approval</div>
                    </div>
                    <div className="bp-gd-item">
                      <div className="bp-gd-score" style={{ color: brand.hiring.glassdoor.recommend >= 60 ? "var(--g)" : brand.hiring.glassdoor.recommend >= 40 ? "var(--a)" : "var(--r)" }}>
                        {brand.hiring.glassdoor.recommend}%
                      </div>
                      <div className="bp-gd-label">Would Recommend</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ─── SECTION: Analysis & Opportunities ─── */}
        <div className="bp-section-divider">
          <span className="bp-section-label">Analysis & Opportunities</span>
        </div>
        <div className="bp-row bp-row-2">
          <div className="bp-card">
            <div className="bp-card-title">Gap Analysis</div>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <MatrixQuadrant
                items={brand.gaps.map((g, i) => ({
                  name: g.area,
                  x: g.severity === "critical" ? 9 : g.severity === "high" ? 7 : g.severity === "medium" ? 4 : 2,
                  y: 3 + i * 1.5,
                  color: g.severity === "critical" ? "var(--r)" : g.severity === "high" ? "var(--a)" : "var(--ink3)",
                }))}
                xLabel="Severity →" yLabel="Impact →" size={240}
              />
            </div>
            {brand.gaps.map((g, i) => (
              <div key={i} style={{ padding: "10px 0", borderTop: "1px solid var(--bd)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{g.area}</span>
                  <span className={`tag ${SEV_CLASS[g.severity]}`} style={{ fontSize: 10, padding: "2px 8px" }}>{g.severity}</span>
                </div>
                <p style={{ fontSize: 12, color: "var(--ink3)", fontWeight: 300, lineHeight: 1.5 }}>{g.description}</p>
                {g.competitor && <div style={{ fontSize: 11, color: "var(--ink4)", marginTop: 4 }}>Benchmark: {g.competitor}</div>}
              </div>
            ))}
          </div>
          <div className="bp-card">
            <div className="bp-card-title">White Space Opportunities</div>
            {brand.whiteSpace.map((o, i) => (
              <div key={i} style={{ padding: 14, background: "var(--off)", borderRadius: 8, border: "1px solid var(--bd)", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{o.opportunity}</span>
                  <span className={`tag ${o.impact === "High" ? "tg" : "ta"}`} style={{ fontSize: 10, padding: "2px 8px" }}>{o.impact}</span>
                </div>
                <p style={{ fontSize: 12, color: "var(--ink3)", fontWeight: 300, lineHeight: 1.5, marginBottom: 6 }}>{o.description}</p>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink4)" }}>Timeframe: {o.timeframe}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── SECTION: Risk & Opportunity Signals ─── */}
        <div className="bp-section-divider">
          <span className="bp-section-label">Risk & Opportunity Signals</span>
        </div>
        <div className="bp-row bp-row-2">
          <div className="bp-card">
            <div className="bp-card-title">Red Flags ({brand.redFlags?.length || 0})</div>
            <FlagList flags={brand.redFlags || []} type="red" />
          </div>
          <div className="bp-card">
            <div className="bp-card-title">Green Flags ({brand.greenFlags?.length || 0})</div>
            <FlagList flags={brand.greenFlags || []} type="green" />
          </div>
        </div>

        {/* ─── SECTION: Market Intelligence ─── */}
        <div className="bp-section-divider">
          <span className="bp-section-label">Market Intelligence</span>
        </div>

        {/* Brand vs Category Search Interest */}
        <div className="bp-card" style={{ marginBottom: 16 }}>
          <div className="bp-card-title">Search Interest — {brand.name} vs Category (Google Trends)</div>
          {brand.searchInterest && (
            <AnalyticalChart
              series={[
                { name: brand.name, data: brand.searchInterest, color: brand.brandColor },
                ...((() => {
                  const cats = (brand.relatedCategories || []).map(cn => IDEA_CATEGORIES.find(c => c.name === cn)).filter(Boolean);
                  return cats.slice(0, 2).map(c => ({ name: c.name, data: c.sparkData, color: c.growthRate >= 40 ? "var(--g)" : "var(--a)" }));
                })()),
              ]}
              yLabel="Relative Interest" height={220} showMinMax={false}
            />
          )}
        </div>

        {/* Related Categories */}
        {(() => {
          const cats = (brand.relatedCategories || []).map(cn => IDEA_CATEGORIES.find(c => c.name === cn)).filter(Boolean);
          if (!cats.length) return null;
          return (
            <div style={{ marginBottom: 16 }}>
              <div className="bp-card-title" style={{ padding: "0 0 12px" }}>Related Trending Categories</div>
              <div className="bp-mi-cats">
                {cats.map((cat, i) => (
                  <div className="bp-mi-cat" key={i}>
                    <div className="bp-mi-cat-top">
                      <span className="bp-mi-cat-icon">{cat.icon}</span>
                      <div className="bp-mi-cat-info">
                        <div className="bp-mi-cat-name">{cat.name}</div>
                        <div className="bp-mi-cat-meta">{cat.brandCount} brands</div>
                      </div>
                      <span className="bp-mi-cat-growth" style={{ color: cat.growthRate >= 40 ? "var(--g)" : "var(--a)" }}>+{cat.growthRate}%</span>
                    </div>
                    <AreaChart data={cat.sparkData} color={cat.growthRate >= 40 ? "var(--g)" : "var(--a)"} w={240} h={48} filled={true} />
                    <div className="bp-mi-cat-subs">
                      {cat.subcategories.slice(0, 3).map((s, j) => (
                        <span key={j} className="bp-mi-cat-sub">{s.name} <span style={{ color: s.growth >= 50 ? "var(--g)" : "var(--a)" }}>+{s.growth}%</span></span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Related Emerging Trends */}
        {(() => {
          const trends = (brand.relatedTrendKeywords || []).map(kw => MARKET_TRENDS.find(t => t.keyword === kw)).filter(Boolean);
          if (!trends.length) return null;
          return (
            <div style={{ marginBottom: 16 }}>
              <div className="bp-card-title" style={{ padding: "0 0 12px" }}>Emerging Trends in This Space</div>
              <div className="bp-mi-trends">
                {trends.map((trend, i) => (
                  <div className="bp-mi-trend" key={i}>
                    <div className="bp-mi-trend-visual" style={{ background: trend.growth >= 200 ? "var(--gl)" : "var(--al)" }}>
                      <AreaChart data={trend.sparkData} color={trend.growth >= 200 ? "var(--g)" : "var(--a)"} w={200} h={50} filled={true} />
                    </div>
                    <div className="bp-mi-trend-body">
                      <div className="bp-mi-trend-top">
                        <div>
                          {trend.isBreaking && <span className="intel-breaking" style={{ marginRight: 6 }}>Breaking</span>}
                          <span className="bp-mi-trend-kw">{trend.keyword}</span>
                        </div>
                        <span className="bp-mi-trend-growth" style={{ color: trend.growth >= 200 ? "var(--g)" : "var(--a)" }}>+{trend.growth}%</span>
                      </div>
                      <p className="bp-mi-trend-summary">{trend.summary.length > 100 ? trend.summary.slice(0, 100) + "…" : trend.summary}</p>
                      <div className="bp-mi-trend-meta">
                        <span>{trend.category}</span>
                        <span>{trend.volume >= 1000000 ? (trend.volume / 1000000).toFixed(1) + "M" : (trend.volume / 1000).toFixed(0) + "K"} searches/mo</span>
                        <span>Source: {trend.source}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Related Problems from Find Ideas */}
        {(() => {
          const catIds = (brand.relatedCategories || []).map(cn => IDEA_CATEGORIES.find(c => c.name === cn)?.id).filter(Boolean);
          const problems = IDEA_PROBLEMS.filter(p => catIds.includes(p.categoryId)).slice(0, 3);
          if (!problems.length) return null;
          return (
            <div className="bp-card" style={{ marginBottom: 16 }}>
              <div className="bp-card-title">Consumer Problems in This Category</div>
              {problems.map((p, i) => (
                <div key={i} style={{ padding: "12px 0", borderBottom: i < problems.length - 1 ? "1px solid var(--bd)" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{p.title}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 12, fontWeight: 600, color: p.growthRate >= 50 ? "var(--g)" : "var(--a)" }}>+{p.growthRate}%</span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--ink3)", fontWeight: 300, lineHeight: 1.5 }}>{p.description.length > 120 ? p.description.slice(0, 120) + "…" : p.description}</p>
                  <div style={{ marginTop: 6, fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink4)" }}>{(p.mentionCount / 1000).toFixed(1)}K mentions · {(p.searchVolume / 1000).toFixed(0)}K searches/mo</div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* ─── SECTION: Customer Intelligence ─── */}
        <div className="bp-section-divider">
          <span className="bp-section-label">Customer Intelligence</span>
        </div>

        {/* Part 1: Review Analytics */}
        <div className="bp-row bp-row-2" style={{ marginBottom: 16 }}>
          <div className="bp-card">
            <div className="bp-card-title">Review Overview</div>
            {brand.starDistribution && (
              <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 20 }}>
                <div style={{ textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 40, fontWeight: 800, color: "var(--ink)" }}>{brand.customerVoice?.trustpilotRating || "—"}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--ink4)" }}>/ 5.0 · {brand.customerVoice?.reviewCount?.toLocaleString()} reviews</div>
                </div>
                <div style={{ flex: 1 }}><StarDistribution distribution={brand.starDistribution} /></div>
              </div>
            )}
          </div>
          <div className="bp-card">
            <div className="bp-card-title">Review Frequency & Health</div>
            {brand.reviewTrend && (
              <div style={{ marginBottom: 16 }}>
                <div className="bp-card-subtitle">Monthly Review Volume (12mo)</div>
                <BarChart bars={brand.reviewTrend.map((v, i) => ({
                  label: ["J","F","M","A","M","J","J","A","S","O","N","D"][i], value: v,
                  color: i >= 10 ? "var(--ink)" : "var(--ink4)",
                }))} h={80} barWidth={22} gap={4} />
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, paddingTop: 12, borderTop: "1px solid var(--bd)" }}>
              <div>
                <div className="dc3-sv">{brand.customerVoice?.reviewCount?.toLocaleString() || "—"}</div>
                <div className="dc3-sl">Total Reviews</div>
              </div>
              <div>
                <div className="dc3-sv" style={{ color: brand.customerVoice?.reviewGrowth?.startsWith("-") ? "var(--r)" : "var(--g)" }}>{brand.customerVoice?.reviewGrowth || "—"}</div>
                <div className="dc3-sl">YoY Growth</div>
              </div>
              <div>
                <div className="dc3-sv">{brand.customerVoice?.mostRecentReview || "—"}</div>
                <div className="dc3-sl">Last Review</div>
              </div>
            </div>
          </div>
        </div>

        {/* Part 2: Actual Reviews */}
        <div className="bp-row bp-row-2">
          <div className="bp-card">
            <div className="bp-card-title" style={{ color: "var(--g)" }}>Top 5 Best Reviews</div>
            {brand.customerVoice?.positive?.slice(0, 5).map((r, i) => (
              <div key={i} className="bp-review-item">
                <div className="bp-review-header">
                  <div className="bp-review-stars">{"★".repeat(r.stars || 5)}{"☆".repeat(5 - (r.stars || 5))}</div>
                  <span className="bp-review-source">{r.source}</span>
                  <span className="bp-review-date">{r.date}</span>
                </div>
                <p className="bp-review-text">"{r.text}"</p>
              </div>
            ))}
          </div>
          <div className="bp-card">
            <div className="bp-card-title" style={{ color: "var(--r)" }}>Top 5 Worst Reviews</div>
            {brand.customerVoice?.negative?.slice(0, 5).map((r, i) => (
              <div key={i} className="bp-review-item">
                <div className="bp-review-header">
                  <div className="bp-review-stars" style={{ color: "var(--r)" }}>{"★".repeat(r.stars || 1)}{"☆".repeat(5 - (r.stars || 1))}</div>
                  <span className="bp-review-source">{r.source}</span>
                  <span className="bp-review-date">{r.date}</span>
                </div>
                <p className="bp-review-text">"{r.text}"</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
