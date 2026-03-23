import { useState, useMemo, useCallback } from "react";
import { VALIDATED_IDEAS, IDEA_CATEGORIES, BRANDS, MARKET_TRENDS, COMMUNITY_SIGNALS } from "../data";
import { RADAR_KEYWORD_MAP, RADAR_BRAND_MAP, RADAR_INTENT } from "../lib/constants";

function loadRadars() {
  try { return JSON.parse(localStorage.getItem("vb_radars") || "[]"); } catch { return []; }
}
function saveRadars(r) { localStorage.setItem("vb_radars", JSON.stringify(r)); }
function loadActiveId() { return localStorage.getItem("vb_active_radar") || null; }
function saveActiveId(id) { localStorage.setItem("vb_active_radar", id || ""); }

function parsePrompt(prompt) {
  const words = prompt.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  const categoryIds = new Set();
  const brandCategories = new Set();
  let intentType = null;

  // Match categories
  for (const word of words) {
    if (RADAR_KEYWORD_MAP[word]) RADAR_KEYWORD_MAP[word].forEach(id => categoryIds.add(id));
    if (RADAR_BRAND_MAP[word]) RADAR_BRAND_MAP[word].forEach(c => brandCategories.add(c));
  }

  // Detect intent
  for (const [intent, keywords] of Object.entries(RADAR_INTENT)) {
    if (keywords.some(k => prompt.toLowerCase().includes(k))) { intentType = intent; break; }
  }

  // Auto-generate a name
  const catNames = [...categoryIds].map(id => IDEA_CATEGORIES.find(c => c.id === id)?.name).filter(Boolean);
  const name = intentType
    ? `${intentType.charAt(0).toUpperCase() + intentType.slice(1)}: ${catNames[0] || "All Categories"}`
    : catNames[0] || "Custom Radar";

  return { keywords: words, categoryIds: [...categoryIds], brandCategories: [...brandCategories], intentType, name };
}

function matchFeed(config) {
  const { categoryIds, brandCategories, intentType } = config;
  const hasCats = categoryIds.length > 0;
  const hasBrandCats = brandCategories.length > 0;

  let ideas = VALIDATED_IDEAS;
  if (hasCats) ideas = ideas.filter(i => categoryIds.includes(i.categoryId));
  if (intentType) ideas = ideas.filter(i => i.ideaType === intentType);
  if (!hasCats && !intentType) ideas = ideas.slice(0, 6);
  ideas = ideas.sort((a, b) => b.validationScore - a.validationScore);

  let brands = BRANDS;
  if (hasBrandCats) brands = brands.filter(b => brandCategories.includes(b.category));
  else if (hasCats) {
    const catNames = categoryIds.map(id => IDEA_CATEGORIES.find(c => c.id === id)?.name).filter(Boolean);
    brands = brands.filter(b => (b.relatedCategories || []).some(rc => catNames.includes(rc)));
  }
  if (!hasBrandCats && !hasCats) brands = brands.slice(0, 6);

  let trends = MARKET_TRENDS;
  if (hasCats) {
    const catNames = categoryIds.map(id => IDEA_CATEGORIES.find(c => c.id === id)?.name).filter(Boolean);
    const verticals = catNames.map(n => n.split(" ")[0].toLowerCase());
    trends = trends.filter(t => verticals.some(v => t.category.toLowerCase().includes(v)));
  }
  if (trends.length === 0) trends = MARKET_TRENDS.slice(0, 4);
  trends = trends.sort((a, b) => b.growth - a.growth);

  let signals = COMMUNITY_SIGNALS;
  if (hasCats) signals = signals.filter(s => categoryIds.includes(s.categoryId));
  if (signals.length === 0) signals = COMMUNITY_SIGNALS.slice(0, 4);
  signals = signals.sort((a, b) => b.growthRate - a.growthRate);

  return { ideas, brands, trends, signals };
}

export default function useRadar() {
  const [radars, setRadars] = useState(loadRadars);
  const [activeId, setActiveId] = useState(loadActiveId);

  const activeRadar = useMemo(() => radars.find(r => r.id === activeId) || null, [radars, activeId]);

  const feedResults = useMemo(() => {
    if (!activeRadar) return { ideas: [], brands: [], trends: [], signals: [] };
    return matchFeed(activeRadar);
  }, [activeRadar]);

  const createRadar = useCallback((prompt) => {
    const parsed = parsePrompt(prompt);
    const radar = {
      id: `radar-${Date.now()}`,
      prompt,
      ...parsed,
      createdAt: new Date().toISOString(),
    };
    const next = [...radars, radar];
    setRadars(next);
    setActiveId(radar.id);
    saveRadars(next);
    saveActiveId(radar.id);
    return radar;
  }, [radars]);

  const deleteRadar = useCallback((id) => {
    const next = radars.filter(r => r.id !== id);
    setRadars(next);
    saveRadars(next);
    if (activeId === id) {
      const newActive = next[0]?.id || null;
      setActiveId(newActive);
      saveActiveId(newActive);
    }
  }, [radars, activeId]);

  const switchRadar = useCallback((id) => {
    setActiveId(id);
    saveActiveId(id);
  }, []);

  const totalMatches = feedResults.ideas.length + feedResults.brands.length + feedResults.trends.length + feedResults.signals.length;

  return {
    radars,
    activeRadar,
    feedResults,
    totalMatches,
    isNewUser: radars.length === 0,
    createRadar,
    deleteRadar,
    switchRadar,
  };
}
