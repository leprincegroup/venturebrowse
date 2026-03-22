// Dummy data for Market Intelligence — emerging consumer trends

export const MARKET_TRENDS = [
  {
    id: "trend-1", keyword: "Ozempic alternatives", category: "Health & Wellness",
    source: "tiktok", volume: 2400000, growth: 340, sentiment: 6.2,
    trendScore: 97, isBreaking: true,
    sparkData: [5, 8, 12, 18, 28, 42, 58, 72, 85, 92, 95, 97],
    summary: "Massive demand for GLP-1 alternatives without prescriptions. Natural appetite suppressants, berberine, and fiber-based products seeing explosive growth.",
    signals: [
      { platform: "tiktok", text: "#OzempicAlternative at 890M views — berberine branded as 'nature's Ozempic'", date: "2026-03" },
      { platform: "reddit", text: "r/loseit daily threads on non-prescription alternatives averaging 2K upvotes", date: "2026-03" },
    ],
  },
  {
    id: "trend-2", keyword: "Mouth taping", category: "Sleep & Wellness",
    source: "tiktok", volume: 1800000, growth: 280, sentiment: 5.8,
    trendScore: 91, isBreaking: true,
    sparkData: [3, 5, 8, 14, 22, 35, 48, 62, 74, 82, 88, 91],
    summary: "Sleep optimization trend — taping mouth shut during sleep for better nasal breathing. Medical tape and branded products emerging rapidly.",
    signals: [
      { platform: "tiktok", text: "#MouthTaping at 420M views — sleep influencers driving adoption", date: "2026-03" },
      { platform: "amazon", text: "Mouth tape products up 380% in sales over past 6 months", date: "2026-02" },
    ],
  },
  {
    id: "trend-3", keyword: "Beef tallow skincare", category: "Beauty",
    source: "tiktok", volume: 890000, growth: 520, sentiment: 7.4,
    trendScore: 94, isBreaking: true,
    sparkData: [2, 3, 5, 8, 15, 25, 40, 58, 72, 84, 90, 94],
    summary: "Animal-fat-based skincare movement rejecting synthetic ingredients. Tallow balms, whipped tallow moisturizers, and ancestral beauty positioning.",
    signals: [
      { platform: "tiktok", text: "#TallowSkincare at 680M views — 'ancestral beauty' trending", date: "2026-03" },
      { platform: "instagram", text: "Before/after tallow skincare transformations driving massive engagement", date: "2026-02" },
    ],
  },
  {
    id: "trend-4", keyword: "Protein water", category: "Food & Beverage",
    source: "amazon", volume: 680000, growth: 190, sentiment: 7.0,
    trendScore: 82, isBreaking: false,
    sparkData: [10, 14, 18, 24, 32, 40, 48, 55, 62, 70, 76, 82],
    summary: "Clear protein drinks replacing shakes for everyday hydration. 20g protein in water format appealing to non-gym consumers.",
    signals: [
      { platform: "amazon", text: "Protein water category up 190% YoY — Premier Protein leading but white space remains", date: "2026-03" },
      { platform: "reddit", text: "r/fitness recommending protein water for 'people who hate shakes'", date: "2026-02" },
    ],
  },
  {
    id: "trend-5", keyword: "Magnesium spray", category: "Supplements",
    source: "tiktok", volume: 1200000, growth: 210, sentiment: 7.8,
    trendScore: 86, isBreaking: false,
    sparkData: [8, 12, 16, 22, 30, 38, 48, 58, 66, 74, 80, 86],
    summary: "Topical magnesium bypassing digestive absorption issues. Sprays, lotions, and bath flakes for sleep, muscle recovery, and anxiety.",
    signals: [
      { platform: "tiktok", text: "'Sleepy girl magnesium spray' routine — 340M views on related hashtags", date: "2026-03" },
      { platform: "google", text: "'magnesium spray' search volume up 210% YoY", date: "2026-02" },
    ],
  },
  {
    id: "trend-6", keyword: "Raw milk", category: "Food & Beverage",
    source: "reddit", volume: 560000, growth: 160, sentiment: 5.2,
    trendScore: 78, isBreaking: false,
    sparkData: [12, 15, 18, 22, 28, 34, 42, 50, 58, 66, 72, 78],
    summary: "Unpasteurized dairy movement growing despite regulatory pushback. Driven by anti-processed food sentiment and 'ancestral eating' philosophy.",
    signals: [
      { platform: "reddit", text: "r/rawmilk subreddit grew 400% in 12 months — 85K subscribers", date: "2026-03" },
      { platform: "tiktok", text: "Raw milk taste tests and sourcing guides averaging 500K views", date: "2026-01" },
    ],
  },
  {
    id: "trend-7", keyword: "Red light therapy", category: "Health & Wellness",
    source: "google", volume: 3200000, growth: 85, sentiment: 7.6,
    trendScore: 84, isBreaking: false,
    sparkData: [30, 34, 38, 44, 50, 56, 62, 66, 72, 76, 80, 84],
    summary: "LED red/NIR light therapy for skin, joints, and recovery gaining mainstream adoption. Home devices democratizing clinical treatments.",
    signals: [
      { platform: "google", text: "'red light therapy' sustained search growth for 18+ months", date: "2026-03" },
      { platform: "amazon", text: "Home red light devices averaging 4.4 stars — category maturing", date: "2026-02" },
    ],
  },
  {
    id: "trend-8", keyword: "Seed cycling", category: "Women's Health",
    source: "instagram", volume: 420000, growth: 145, sentiment: 6.8,
    trendScore: 76, isBreaking: false,
    sparkData: [8, 10, 14, 18, 24, 32, 40, 48, 56, 64, 70, 76],
    summary: "Rotating seed intake (flax, pumpkin, sesame, sunflower) aligned with menstrual phases. Pre-made seed cycling blends and subscription kits emerging.",
    signals: [
      { platform: "instagram", text: "Seed cycling infographics consistently in top wellness content", date: "2026-03" },
      { platform: "tiktok", text: "Hormone balancing routines featuring seed cycling — 180M views", date: "2026-02" },
    ],
  },
  {
    id: "trend-9", keyword: "Sourdough everything", category: "Food & Beverage",
    source: "tiktok", volume: 740000, growth: 120, sentiment: 8.2,
    trendScore: 80, isBreaking: false,
    sparkData: [15, 18, 22, 28, 34, 42, 50, 56, 62, 68, 74, 80],
    summary: "Sourdough expanding beyond bread into crackers, pasta, pizza bases, and pancake mixes. Fermented flour as a health positioning.",
    signals: [
      { platform: "tiktok", text: "Sourdough discard recipes at 1.2B views — zero-waste angle driving content", date: "2026-03" },
      { platform: "amazon", text: "Sourdough starter kits and dried starters up 120% in sales", date: "2026-02" },
    ],
  },
  {
    id: "trend-10", keyword: "Electrolyte drinks", category: "Food & Beverage",
    source: "amazon", volume: 4100000, growth: 65, sentiment: 7.4,
    trendScore: 74, isBreaking: false,
    sparkData: [32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 74],
    summary: "Daily electrolyte supplementation becoming mainstream habit beyond athletes. LMNT and Drip Drop leading but massive white space in flavors and formats.",
    signals: [
      { platform: "amazon", text: "Electrolyte category now $2.1B — fragmented with 200+ brands", date: "2026-03" },
      { platform: "reddit", text: "r/hydration growth accelerating — daily electrolyte routines normalized", date: "2026-02" },
    ],
  },
  {
    id: "trend-11", keyword: "Peptide supplements", category: "Supplements",
    source: "reddit", volume: 320000, growth: 290, sentiment: 6.4,
    trendScore: 88, isBreaking: true,
    sparkData: [4, 6, 10, 16, 24, 35, 48, 60, 72, 80, 85, 88],
    summary: "Oral peptides (BPC-157, TB-500) moving from bodybuilding niche to mainstream wellness. Regulatory gray area creating both risk and opportunity.",
    signals: [
      { platform: "reddit", text: "r/peptides grew from 40K to 180K subscribers in 12 months", date: "2026-03" },
      { platform: "google", text: "'BPC-157 supplement' searches up 290% YoY", date: "2026-02" },
    ],
  },
  {
    id: "trend-12", keyword: "Castor oil packs", category: "Wellness",
    source: "tiktok", volume: 980000, growth: 175, sentiment: 6.6,
    trendScore: 79, isBreaking: false,
    sparkData: [8, 12, 16, 22, 30, 38, 48, 56, 64, 70, 76, 79],
    summary: "Traditional castor oil packs for liver detox, inflammation, and fertility. Pre-made wrap products simplifying the application process.",
    signals: [
      { platform: "tiktok", text: "'Castor oil pack results' content averaging 200K views per video", date: "2026-03" },
      { platform: "amazon", text: "Queen of the Thrones castor oil packs — category leader at $35M ARR", date: "2026-02" },
    ],
  },
];
