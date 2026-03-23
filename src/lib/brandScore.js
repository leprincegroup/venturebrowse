// Brand Score Algorithm (0-100)
// Measures brand health objectively — NOT investment opportunity
// Higher = healthier brand, Lower = distressed brand
// Categories weighted by importance to brand health

function parseFollowers(str) {
  if (!str) return 0;
  if (typeof str === "number") return str;
  const s = str.toString().replace(/,/g, "");
  if (s.includes("M")) return parseFloat(s) * 1e6;
  if (s.includes("K")) return parseFloat(s) * 1e3;
  return parseFloat(s) || 0;
}

function clamp(v, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}

// Traffic Health (0-100) — 20% weight
function scoreTraffic(brand) {
  const trend = brand.trafficTrend;
  if (!trend || trend.length < 2) return 40; // neutral if no data

  const first = trend[0];
  const last = trend[trend.length - 1];
  const pctChange = first > 0 ? ((last - first) / first) * 100 : 0;

  // Growth score: +50% = 100, flat = 50, -50% = 0
  let growthScore = clamp(50 + pctChange, 0, 100);

  // Volume score: higher absolute traffic = better
  let volumeScore = 0;
  if (last >= 5000) volumeScore = 100;
  else if (last >= 2000) volumeScore = 85;
  else if (last >= 500) volumeScore = 65;
  else if (last >= 100) volumeScore = 45;
  else if (last >= 10) volumeScore = 25;
  else volumeScore = 10;

  return Math.round(growthScore * 0.6 + volumeScore * 0.4);
}

// Social Presence (0-100) — 15% weight
function scoreSocial(brand) {
  const ig = parseFollowers(brand.socialFollowing?.instagram);
  const tt = parseFollowers(brand.socialFollowing?.tiktok);
  const total = ig + tt;

  if (total === 0) return 20;

  // Scale: 10M+ = 100, 1M = 80, 100K = 60, 10K = 40, 1K = 20
  let score = 0;
  if (total >= 10e6) score = 100;
  else if (total >= 1e6) score = 70 + (total / 10e6) * 30;
  else if (total >= 100e3) score = 50 + (total / 1e6) * 20;
  else if (total >= 10e3) score = 30 + (total / 100e3) * 20;
  else score = 10 + (total / 10e3) * 20;

  return Math.round(clamp(score));
}

// Customer Satisfaction (0-100) — 20% weight
function scoreCustomer(brand) {
  const tp = brand.customerVoice?.trustpilotRating;
  if (!tp) return 40;

  // Trustpilot: 4.5+ = 100, 4.0 = 80, 3.5 = 60, 3.0 = 40, 2.0 = 20, 1.0 = 0
  let ratingScore = clamp((tp - 1) * 25, 0, 100);

  // Review volume bonus (more reviews = more reliable signal)
  const reviewCount = brand.customerVoice?.reviewCount || 0;
  let volumeBonus = 0;
  if (reviewCount >= 10000) volumeBonus = 15;
  else if (reviewCount >= 1000) volumeBonus = 10;
  else if (reviewCount >= 100) volumeBonus = 5;

  return Math.round(clamp(ratingScore + volumeBonus));
}

// Ad Activity (0-100) — 10% weight
function scoreAds(brand) {
  const active = brand.advertising?.activeAds || 0;
  const total = brand.advertising?.totalAds || 0;

  if (total === 0) return 15; // no ad presence = weak signal

  // Active ads show the brand is investing in growth
  let score = 0;
  if (active >= 50) score = 95;
  else if (active >= 20) score = 80;
  else if (active >= 10) score = 65;
  else if (active >= 5) score = 50;
  else if (active >= 1) score = 35;
  else score = 15;

  return Math.round(score);
}

// Team Strength (0-100) — 10% weight
function scoreTeam(brand) {
  const emp = parseInt(brand.employees) || 0;
  const openRoles = brand.hiring?.openRoles || 0;
  const glassdoor = brand.hiring?.glassdoor?.rating || 0;

  // Employee count score
  let empScore = 0;
  if (emp >= 500) empScore = 90;
  else if (emp >= 200) empScore = 75;
  else if (emp >= 50) empScore = 60;
  else if (emp >= 20) empScore = 45;
  else if (emp >= 5) empScore = 30;
  else empScore = 15;

  // Hiring activity bonus
  let hiringBonus = openRoles > 10 ? 15 : openRoles > 5 ? 10 : openRoles > 0 ? 5 : -5;

  // Glassdoor factor
  let gdFactor = glassdoor >= 4 ? 10 : glassdoor >= 3 ? 0 : glassdoor > 0 ? -10 : 0;

  return Math.round(clamp(empScore + hiringBonus + gdFactor));
}

// Financial Health (0-100) — 15% weight
function scoreFinancial(brand) {
  let score = 40; // baseline

  // Revenue
  if (brand.verifiedRevenue) {
    const rev = brand.verifiedRevenue.replace(/[^0-9.]/g, "");
    const revNum = parseFloat(rev);
    if (revNum >= 100) score = 90; // $100M+
    else if (revNum >= 50) score = 80;
    else if (revNum >= 10) score = 70;
    else if (revNum >= 1) score = 55;
    else score = 40;
  }

  return Math.round(clamp(score));
}

// Brand Signals (0-100) — 10% weight
function scoreSignals(brand) {
  const red = brand.redFlags?.length || 0;
  const green = brand.greenFlags?.length || 0;
  const total = red + green;

  if (total === 0) return 50; // neutral

  // Ratio of green to total signals
  const ratio = green / total;
  return Math.round(ratio * 100);
}

// Main scoring function
export function computeBrandScore(brand) {
  const traffic = scoreTraffic(brand);
  const social = scoreSocial(brand);
  const customer = scoreCustomer(brand);
  const ads = scoreAds(brand);
  const team = scoreTeam(brand);
  const financial = scoreFinancial(brand);
  const signals = scoreSignals(brand);

  const overall = Math.round(
    traffic * 0.20 +
    social * 0.15 +
    customer * 0.20 +
    ads * 0.10 +
    team * 0.10 +
    financial * 0.15 +
    signals * 0.10
  );

  return {
    overall: clamp(overall),
    breakdown: {
      traffic: { score: traffic, weight: 20, label: "Traffic" },
      social: { score: social, weight: 15, label: "Social" },
      customer: { score: customer, weight: 20, label: "Customer" },
      ads: { score: ads, weight: 10, label: "Ads" },
      team: { score: team, weight: 10, label: "Team" },
      financial: { score: financial, weight: 15, label: "Financial" },
      signals: { score: signals, weight: 10, label: "Signals" },
    },
    grade: overall >= 80 ? "A" : overall >= 65 ? "B" : overall >= 50 ? "C" : overall >= 35 ? "D" : "F",
  };
}

// Score label
export function scoreLabel(score) {
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Strong";
  if (score >= 50) return "Average";
  if (score >= 35) return "Weak";
  return "Distressed";
}

// Score color
export function scoreColor(score) {
  if (score >= 80) return "var(--g)";
  if (score >= 65) return "#4ade80";
  if (score >= 50) return "var(--a)";
  if (score >= 35) return "#f97316";
  return "var(--r)";
}
