import { useState } from "react";
import { MARKET_TRENDS, COMMUNITY_SIGNALS, MARKET_NEWS, IDEA_CATEGORIES, VALIDATED_IDEAS, BRANDS } from "../../data";
import Sparkline from "../common/Sparkline";
import AreaChart from "../common/charts/AreaChart";

// ── Market View panels ──

const MARKET_PANELS = [
  { id: "trends", label: "Breaking Trends" },
  { id: "traffic", label: "Traffic Monitor" },
  { id: "news", label: "Market News" },
  { id: "categories", label: "Category Heatmap" },
  { id: "signals", label: "Community Pulse" },
  { id: "ideas", label: "Idea Pipeline" },
  { id: "ads", label: "Ad Activity" },
  { id: "deals", label: "Deal Flow" },
  { id: "volume", label: "Search Volume" },
];

const DEFAULT_MARKET = ["trends", "traffic", "news", "categories", "signals", "ideas"];

// ── Brand View panels ──

const BRAND_PANELS = [
  { id: "b-overview", label: "Brand Overview" },
  { id: "b-traffic", label: "Traffic Trends" },
  { id: "b-ads", label: "Ad Intelligence" },
  { id: "b-flags", label: "Risk & Strength Signals" },
  { id: "b-gaps", label: "Opportunity Gaps" },
  { id: "b-news", label: "Related News" },
];

const DEFAULT_BRAND = ["b-overview", "b-traffic", "b-ads", "b-flags", "b-gaps", "b-news"];

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}

// ── Market panel renderers ──

function PanelTrends() {
  const top = [...MARKET_TRENDS].sort((a, b) => b.growth - a.growth).slice(0, 8);
  return top.map(t => (
    <div className="t-row" key={t.id}>
      <div className="t-row-main">
        <span className="t-name">{t.keyword}</span>
        <span className="t-val" style={{ color: t.growth >= 200 ? "#4ade80" : "#fbbf24" }}>+{t.growth}%</span>
      </div>
      <div className="t-row-chart"><Sparkline data={t.sparkData} color={t.growth >= 200 ? "#4ade80" : "#fbbf24"} w={120} h={20} filled={true} /></div>
      <div className="t-row-sub"><span>{t.category}</span><span>{t.volume >= 1e6 ? (t.volume / 1e6).toFixed(1) + "M" : (t.volume / 1000).toFixed(0) + "K"} vol</span></div>
    </div>
  ));
}

function PanelTraffic() {
  const sorted = [...BRANDS].sort((a, b) => (b.trafficTrend?.slice(-1)[0] || 0) - (a.trafficTrend?.slice(-1)[0] || 0));
  return sorted.map(b => {
    const down = b.trafficTrend?.[0] > b.trafficTrend?.slice(-1)[0];
    return (
      <div className="t-row" key={b.id}>
        <div className="t-row-main"><span className="t-name">{b.name}</span><span className="t-val" style={{ color: down ? "#f87171" : "#4ade80" }}>{b.trafficTrend?.slice(-1)[0]}K</span></div>
        {b.trafficTrend && <div className="t-row-chart"><Sparkline data={b.trafficTrend} color={down ? "#f87171" : "#4ade80"} w={120} h={18} filled={true} /></div>}
        <div className="t-row-sub"><span>{b.category}</span><span>{b.employees} team</span></div>
      </div>
    );
  });
}

function PanelNews() {
  const icons = { acquisition: "\u{1F91D}", funding: "\u{1F4B0}", ipo: "\u{1F4C8}", launch: "\u{1F680}" };
  return MARKET_NEWS.map(n => (
    <div className="t-row" key={n.id}>
      <div className="t-row-main"><span className="t-name">{icons[n.type] || ""} {n.title.length > 40 ? n.title.slice(0, 40) + "..." : n.title}</span></div>
      <div className="t-row-sub"><span>{new Date(n.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>{n.value !== "N/A" && <span style={{ color: "#4ade80" }}>{n.value}</span>}</div>
    </div>
  ));
}

function PanelCategories() {
  const sorted = [...IDEA_CATEGORIES].sort((a, b) => b.growthRate - a.growthRate);
  const max = Math.max(...sorted.map(c => c.growthRate));
  return sorted.map(c => (
    <div className="t-row" key={c.id}>
      <div className="t-row-main"><span className="t-name">{c.icon} {c.name}</span><span className="t-val" style={{ color: c.growthRate >= 40 ? "#4ade80" : "#fbbf24" }}>+{c.growthRate}%</span></div>
      <div className="t-bar-track"><div className="t-bar-fill" style={{ width: `${(c.growthRate / max) * 100}%`, background: c.growthRate >= 40 ? "#4ade80" : c.growthRate >= 25 ? "#fbbf24" : "#52525b" }} /></div>
      <div className="t-row-sub"><span>{c.brandCount} brands</span><span>{c.sentiment}/10</span></div>
    </div>
  ));
}

function PanelSignals() {
  const top = [...COMMUNITY_SIGNALS].sort((a, b) => b.growthRate - a.growthRate).slice(0, 7);
  return top.map(s => {
    const cat = IDEA_CATEGORIES.find(c => c.id === s.categoryId);
    return (
      <div className="t-row" key={s.id}>
        <div className="t-row-main"><span className="t-sev" style={{ background: s.severity === "high" ? "#f87171" : s.severity === "medium" ? "#fbbf24" : "#52525b" }} /><span className="t-name">{s.title.length > 35 ? s.title.slice(0, 35) + "..." : s.title}</span><span className="t-val" style={{ color: s.growthRate >= 50 ? "#4ade80" : "#fbbf24" }}>+{s.growthRate}%</span></div>
        <div className="t-row-sub"><span>{cat?.name || ""}</span><span>{(s.mentionCount / 1000).toFixed(1)}K</span></div>
      </div>
    );
  });
}

function PanelIdeas() {
  const top = [...VALIDATED_IDEAS].sort((a, b) => b.validationScore - a.validationScore).slice(0, 6);
  return top.map(i => {
    const cat = IDEA_CATEGORIES.find(c => c.id === i.categoryId);
    return (
      <div className="t-row" key={i.id}>
        <div className="t-row-main"><span className="t-name">{i.title.length > 35 ? i.title.slice(0, 35) + "..." : i.title}</span><span className="t-val">{i.validationScore}/10</span></div>
        <div className="t-row-sub"><span>{cat?.name || ""}</span><span>{i.marketSize}</span><span style={{ color: "#4ade80" }}>+{i.growthRate}%</span></div>
      </div>
    );
  });
}

function PanelAds() {
  return [...BRANDS].sort((a, b) => (b.advertising?.activeAds || 0) - (a.advertising?.activeAds || 0)).filter(b => (b.advertising?.activeAds || 0) > 0).map(b => (
    <div className="t-row" key={b.id}>
      <div className="t-row-main"><span className="t-name">{b.name}</span><span className="t-val">{b.advertising?.activeAds} live</span></div>
      <div className="t-row-sub"><span>{b.advertising?.totalAds || 0} total</span><span>{b.category}</span></div>
    </div>
  ));
}

function PanelDeals() {
  return MARKET_NEWS.filter(n => n.type === "acquisition" || n.type === "funding").map(n => (
    <div className="t-row" key={n.id}>
      <div className="t-row-main"><span className="t-name">{n.brands[0]}</span>{n.value !== "N/A" && <span className="t-val" style={{ color: "#4ade80" }}>{n.value}</span>}</div>
      <div className="t-row-sub"><span>{n.type === "acquisition" ? "Acquired" : "Funded"}</span><span>{new Date(n.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span></div>
    </div>
  ));
}

function PanelVolume() {
  const sorted = [...MARKET_TRENDS].sort((a, b) => b.volume - a.volume).slice(0, 8);
  const max = Math.max(...sorted.map(t => t.volume));
  return sorted.map(t => (
    <div className="t-row" key={t.id}>
      <div className="t-row-main"><span className="t-name">{t.keyword}</span><span className="t-val">{t.volume >= 1e6 ? (t.volume / 1e6).toFixed(1) + "M" : (t.volume / 1000).toFixed(0) + "K"}</span></div>
      <div className="t-bar-track"><div className="t-bar-fill" style={{ width: `${(t.volume / max) * 100}%`, background: "#60a5fa" }} /></div>
    </div>
  ));
}

const MARKET_RENDERERS = {
  trends: PanelTrends, traffic: PanelTraffic, news: PanelNews,
  categories: PanelCategories, signals: PanelSignals, ideas: PanelIdeas,
  ads: PanelAds, deals: PanelDeals, volume: PanelVolume,
};

// ── Brand panel renderers (take selected brands as arg) ──

function BrandOverview({ brands }) {
  return brands.map(b => {
    const down = b.trafficTrend?.[0] > b.trafficTrend?.slice(-1)[0];
    return (
      <div className="t-row" key={b.id} style={{ paddingBottom: 10 }}>
        <div className="t-row-main" style={{ marginBottom: 4 }}>
          <span className="t-name" style={{ fontWeight: 600, fontSize: 13, color: "#fafafa" }}>{b.name}</span>
          <span className="t-val" style={{ color: down ? "#f87171" : "#4ade80" }}>{b.trafficTrend?.slice(-1)[0]}K/mo</span>
        </div>
        <div className="t-row-sub"><span>{b.category}</span><span>{b.hq.split(",")[0]}</span><span>{b.employees} team</span></div>
        <div style={{ fontSize: 11, color: "#71717a", marginTop: 4, lineHeight: 1.5 }}>{b.summary?.length > 100 ? b.summary.slice(0, 100) + "..." : b.summary}</div>
      </div>
    );
  });
}

function BrandTrafficPanel({ brands }) {
  return brands.map(b => {
    if (!b.trafficTrend) return null;
    const down = b.trafficTrend[0] > b.trafficTrend.slice(-1)[0];
    const pctChange = Math.round(((b.trafficTrend.slice(-1)[0] - b.trafficTrend[0]) / b.trafficTrend[0]) * 100);
    return (
      <div className="t-row" key={b.id}>
        <div className="t-row-main"><span className="t-name">{b.name}</span><span className="t-val" style={{ color: down ? "#f87171" : "#4ade80" }}>{pctChange > 0 ? "+" : ""}{pctChange}%</span></div>
        <div className="t-row-chart"><Sparkline data={b.trafficTrend} color={down ? "#f87171" : "#4ade80"} w={160} h={24} filled={true} /></div>
        <div className="t-row-sub">
          <span>{b.trafficTrend.slice(-1)[0]}K now</span>
          <span>was {b.trafficTrend[0]}K</span>
          {b.trafficSources && <span>{b.trafficSources.organic}% organic</span>}
        </div>
      </div>
    );
  }).filter(Boolean);
}

function BrandAdsPanel({ brands }) {
  return brands.map(b => {
    const ads = b.advertising;
    if (!ads) return null;
    return (
      <div className="t-row" key={b.id}>
        <div className="t-row-main"><span className="t-name">{b.name}</span><span className="t-val">{ads.activeAds || 0} live</span></div>
        <div className="t-row-sub">
          <span>{ads.totalAds || 0} total ads</span>
          {ads.formats && <span>{Object.keys(ads.formats).filter(f => ads.formats[f] > 0).join(", ")}</span>}
        </div>
        {b.metaAds?.[0] && <div style={{ fontSize: 10, color: "#52525b", marginTop: 3, fontStyle: "italic" }}>"{b.metaAds[0].headline?.slice(0, 50)}..."</div>}
      </div>
    );
  }).filter(Boolean);
}

function BrandFlagsPanel({ brands }) {
  return brands.flatMap(b => {
    const items = [];
    if (b.redFlags) b.redFlags.slice(0, 3).forEach((f, i) => items.push(
      <div className="t-row" key={`${b.id}-r-${i}`}>
        <div className="t-row-main"><span className="t-sev" style={{ background: "#f87171" }} /><span className="t-name">{f.length > 45 ? f.slice(0, 45) + "..." : f}</span></div>
        <div className="t-row-sub"><span>{b.name}</span><span style={{ color: "#f87171" }}>Risk</span></div>
      </div>
    ));
    if (b.greenFlags) b.greenFlags.slice(0, 2).forEach((f, i) => items.push(
      <div className="t-row" key={`${b.id}-g-${i}`}>
        <div className="t-row-main"><span className="t-sev" style={{ background: "#4ade80" }} /><span className="t-name">{f.length > 45 ? f.slice(0, 45) + "..." : f}</span></div>
        <div className="t-row-sub"><span>{b.name}</span><span style={{ color: "#4ade80" }}>Strength</span></div>
      </div>
    ));
    return items;
  });
}

function BrandGapsPanel({ brands }) {
  return brands.flatMap(b =>
    (b.gaps || []).map((g, i) => (
      <div className="t-row" key={`${b.id}-gap-${i}`}>
        <div className="t-row-main"><span className="t-name">{g.area}</span><span className="t-val" style={{ color: g.severity === "critical" ? "#f87171" : g.severity === "high" ? "#fbbf24" : "#52525b", fontSize: 10, textTransform: "uppercase" }}>{g.severity}</span></div>
        <div style={{ fontSize: 10, color: "#52525b", marginTop: 2, lineHeight: 1.4 }}>{g.description?.length > 60 ? g.description.slice(0, 60) + "..." : g.description}</div>
        <div className="t-row-sub"><span>{b.name}</span></div>
      </div>
    ))
  );
}

function BrandNewsPanel({ brands }) {
  const names = brands.map(b => b.name.toLowerCase());
  const relevant = MARKET_NEWS.filter(n => n.brands.some(bn => names.includes(bn.toLowerCase())));
  if (!relevant.length) return [<div key="empty" className="t-empty">No recent news for selected brands.</div>];
  return relevant.map(n => (
    <div className="t-row" key={n.id}>
      <div className="t-row-main"><span className="t-name">{n.title.length > 45 ? n.title.slice(0, 45) + "..." : n.title}</span></div>
      <div className="t-row-sub"><span>{new Date(n.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>{n.value !== "N/A" && <span style={{ color: "#4ade80" }}>{n.value}</span>}</div>
    </div>
  ));
}

// ── Saved views ──

function loadViews() {
  try { return JSON.parse(localStorage.getItem("vb_t_views")) || []; } catch { return []; }
}
function saveViews(views) { localStorage.setItem("vb_t_views", JSON.stringify(views)); }

// ── Main component ──

export default function TerminalView({ fullscreen = false }) {
  const [mode, setMode] = useState("market");
  const [marketPanels, setMarketPanelsRaw] = useState(() => load("vb_t_market", DEFAULT_MARKET));
  const [brandPanels, setBrandPanelsRaw] = useState(() => load("vb_t_brand", DEFAULT_BRAND));
  const [selectedBrandIds, setSelectedBrandIds] = useState(() => load("vb_t_brands", BRANDS.slice(0, 3).map(b => b.id)));
  const [showPicker, setShowPicker] = useState(false);
  const [showBrandPicker, setShowBrandPicker] = useState(false);
  const [savedViews, setSavedViews] = useState(loadViews);
  const [showViews, setShowViews] = useState(false);
  const [saveName, setSaveName] = useState("");

  function setMarketPanels(p) { setMarketPanelsRaw(p); localStorage.setItem("vb_t_market", JSON.stringify(p)); }
  function setBrandPanels(p) { setBrandPanelsRaw(p); localStorage.setItem("vb_t_brand", JSON.stringify(p)); }
  function setSelectedBrands(ids) { setSelectedBrandIds(ids); localStorage.setItem("vb_t_brands", JSON.stringify(ids)); }

  function togglePanel(id) {
    if (mode === "market") setMarketPanels(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    else setBrandPanels(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  }

  function toggleBrand(id) {
    setSelectedBrands(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  }

  function openFullscreen() {
    window.open(window.location.origin + "/?terminal=full", "VBTerminal", "width=1920,height=1080");
  }

  function saveCurrentView() {
    if (!saveName.trim()) return;
    const view = { name: saveName.trim(), mode, marketPanels, brandPanels, brandIds: selectedBrandIds, savedAt: new Date().toISOString() };
    const updated = [...savedViews.filter(v => v.name !== view.name), view];
    setSavedViews(updated);
    saveViews(updated);
    setSaveName("");
  }

  function loadView(view) {
    setMode(view.mode);
    setMarketPanels(view.marketPanels);
    setBrandPanels(view.brandPanels);
    setSelectedBrands(view.brandIds);
    setShowViews(false);
  }

  function deleteView(name) {
    const updated = savedViews.filter(v => v.name !== name);
    setSavedViews(updated);
    saveViews(updated);
  }

  const panels = mode === "market" ? marketPanels : brandPanels;
  const defs = mode === "market" ? MARKET_PANELS : BRAND_PANELS;
  const cols = panels.length <= 4 ? 2 : panels.length <= 6 ? 3 : 4;
  const selectedBrands = BRANDS.filter(b => selectedBrandIds.includes(b.id));

  const BRAND_RENDERERS = {
    "b-overview": () => <BrandOverview brands={selectedBrands} />,
    "b-traffic": () => <BrandTrafficPanel brands={selectedBrands} />,
    "b-ads": () => <BrandAdsPanel brands={selectedBrands} />,
    "b-flags": () => <BrandFlagsPanel brands={selectedBrands} />,
    "b-gaps": () => <BrandGapsPanel brands={selectedBrands} />,
    "b-news": () => <BrandNewsPanel brands={selectedBrands} />,
  };

  const renderers = mode === "market" ? MARKET_RENDERERS : BRAND_RENDERERS;

  return (
    <div className="terminal" style={fullscreen ? { top: 0 } : undefined}>
      {/* Header */}
      <div className="t-hdr">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span className="t-title">Terminal</span>
          <div className="t-mode-toggle">
            <button className={`t-mode${mode === "market" ? " on" : ""}`} onClick={() => { setMode("market"); setShowPicker(false); setShowBrandPicker(false); }}>Market</button>
            <button className={`t-mode${mode === "brand" ? " on" : ""}`} onClick={() => { setMode("brand"); setShowPicker(false); setShowBrandPicker(false); }}>Brands</button>
          </div>
          <span className="t-sub">{panels.length} panels{mode === "brand" ? ` \u00b7 ${selectedBrands.length} brands` : ""}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="t-customize" onClick={() => { setShowViews(!showViews); setShowPicker(false); setShowBrandPicker(false); }}>
            {showViews ? "Done" : "Views"}
          </button>
          {mode === "brand" && (
            <button className="t-customize" onClick={() => { setShowBrandPicker(!showBrandPicker); setShowPicker(false); setShowViews(false); }}>
              {showBrandPicker ? "Done" : "Select Brands"}
            </button>
          )}
          <button className="t-customize" onClick={() => { setShowPicker(!showPicker); setShowBrandPicker(false); setShowViews(false); }}>
            {showPicker ? "Done" : "Panels"}
          </button>
          {!fullscreen && (
            <button className="t-customize" onClick={openFullscreen} title="Open in new window">
              &#x2197;
            </button>
          )}
        </div>
      </div>

      {/* Saved views */}
      {showViews && (
        <div className="t-picker" style={{ flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              className="t-view-input"
              placeholder="Name this view..."
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && saveCurrentView()}
            />
            <button className="t-pick on" onClick={saveCurrentView}>Save current</button>
          </div>
          {savedViews.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {savedViews.map(v => (
                <div key={v.name} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                  <button className="t-pick" onClick={() => loadView(v)} style={{ borderRight: "none" }}>
                    {v.name}
                    <span style={{ fontSize: 9, color: "#3f3f46", marginLeft: 6 }}>{v.mode}</span>
                  </button>
                  <button className="t-pick" onClick={() => deleteView(v.name)} style={{ padding: "5px 8px", color: "#f87171" }}>&times;</button>
                </div>
              ))}
            </div>
          )}
          {savedViews.length === 0 && <span style={{ fontSize: 11, color: "#3f3f46" }}>No saved views yet. Configure your panels and save.</span>}
        </div>
      )}

      {/* Panel picker */}
      {showPicker && (
        <div className="t-picker">
          {defs.map(p => (
            <button key={p.id} className={`t-pick${panels.includes(p.id) ? " on" : ""}`} onClick={() => togglePanel(p.id)}>
              {panels.includes(p.id) ? "\u2713 " : ""}{p.label}
            </button>
          ))}
        </div>
      )}

      {/* Brand picker */}
      {showBrandPicker && (
        <div className="t-picker">
          {BRANDS.map(b => (
            <button key={b.id} className={`t-pick${selectedBrandIds.includes(b.id) ? " on" : ""}`} onClick={() => toggleBrand(b.id)}>
              {selectedBrandIds.includes(b.id) ? "\u2713 " : ""}{b.name}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="t-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {panels.map(id => {
          const def = defs.find(p => p.id === id);
          const Renderer = renderers[id];
          if (!def || !Renderer) return null;
          const content = typeof Renderer === "function" && !Renderer.prototype
            ? Renderer()
            : <Renderer />;
          return (
            <div className="t-panel" key={id}>
              <div className="t-panel-hdr">{def.label}</div>
              <div className="t-panel-body">{content}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
