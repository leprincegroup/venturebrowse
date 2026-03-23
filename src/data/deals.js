// Brand profiles for Browse Brands — spotting potential within consumer brands

export const BRANDS = [
  {
    id: "brand-1", name: "WelleCo", logo: "WC", logoUrl: "https://unavatar.io/welleco.com", category: "Wellness Supplements", hq: "Sydney, Australia",
    founded: 2014, employees: 45, website: "welleco.com",
    relatedCategories: ["Gut Health Supplements", "Clean Protein", "Functional Gummies"],
    relatedTrendKeywords: ["Ozempic alternatives", "Magnesium spray", "Electrolyte drinks"],
    brandColor: "#2D5A3D", bgGradient: "linear-gradient(135deg, #2D5A3D 0%, #1a3a28 100%)",
    verification: "unverified",
    status: "growth-stalled",
    socialFollowing: { instagram: "380K", tiktok: "12K" },
    trafficTrend: [450, 420, 380, 350, 320, 290, 260, 240, 220, 210, 200, 185],
    searchInterest: [80, 78, 72, 68, 62, 55, 50, 45, 42, 40, 38, 35],

    metaAds: [
      { headline: "The Super Elixir — Your Daily Greens Ritual", body: "Nourish your body with 45 superfoods in one scoop. Join 500K+ women who start their day with WelleCo.", cta: "Shop Now", impressions: "2.4M", status: "active", daysRunning: 220, format: "Video", color: "#2D5A3D", hook: "Join 500K+ women who start their day with WelleCo", landingPage: "welleco.com/super-elixir" },
      { headline: "Elle Macpherson's Wellness Secret", body: "The supermodel's daily greens ritual — now available worldwide. Premium ingredients, real results.", cta: "Learn More", impressions: "1.8M", status: "paused", daysRunning: 180, format: "Carousel", color: "#1a3a28", hook: "The supermodel's daily greens ritual", landingPage: "welleco.com/elle-wellness" },
      { headline: "45 Ingredients. One Scoop. Every Day.", body: "PhD-formulated. No fillers. No compromises. The greens powder trusted by nutritionists.", cta: "Shop Now", impressions: "980K", status: "active", daysRunning: 90, format: "Image", color: "#3d6b4a", hook: "The greens powder trusted by nutritionists", landingPage: "welleco.com/shop" },
      { headline: "WelleCo x Vogue — Editor's Pick", body: "Why Vogue editors can't stop talking about this greens powder. Discover the ritual.", cta: "Shop Now", impressions: "640K", status: "active", daysRunning: 45, format: "Image", color: "#2D5A3D", hook: "Why Vogue editors can't stop talking about this", landingPage: "welleco.com/vogue-pick" },
    ],
    advertising: {
      totalAds: 18, activeAds: 6,
      formats: { video: 5, image: 7, carousel: 4, ugc: 2 },
      topHooks: [
        { hook: "Join 500K+ women who start their day with WelleCo", impressions: "2.4M", ctr: "3.2%" },
        { hook: "The supermodel's daily greens ritual", impressions: "1.8M", ctr: "2.8%" },
        { hook: "The greens powder trusted by nutritionists", impressions: "980K", ctr: "4.1%" },
        { hook: "Why Vogue editors can't stop talking about this", impressions: "640K", ctr: "3.6%" },
      ],
      topLandingPages: [
        { url: "welleco.com/super-elixir", visits: "84K", convRate: "3.8%" },
        { url: "welleco.com/shop", visits: "62K", convRate: "2.9%" },
        { url: "welleco.com/elle-wellness", visits: "41K", convRate: "2.1%" },
        { url: "welleco.com/vogue-pick", visits: "28K", convRate: "4.2%" },
      ],
    },
    // Traffic sources
    trafficSources: { organic: 35, direct: 28, paid: 8, social: 18, referral: 7, email: 4 },
    topCountries: [
      { country: "Australia", pct: 42 }, { country: "United Kingdom", pct: 18 },
      { country: "United States", pct: 15 }, { country: "Germany", pct: 8 },
      { country: "New Zealand", pct: 6 }, { country: "Other", pct: 11 },
    ],
    bestSellers: [
      { name: "The Super Elixir Greens", price: "$145", category: "Greens Powder", color: "#2D5A3D", icon: "🍃" },
      { name: "Nourishing Protein", price: "$65", category: "Protein", color: "#5B8A72", icon: "💪" },
      { name: "Sleep Welle Calming Tea", price: "$38", category: "Tea", color: "#8BAF9E", icon: "🌙" },
    ],
    socialPosts: {
      instagram: [
        { type: "image", caption: "Start your morning ritual with The Super Elixir ✨ 45 superfoods in one scoop.", likes: 2840, comments: 124, date: "2026-03-15", color: "#2D5A3D", icon: "🍃" },
        { type: "carousel", caption: "Your gut health journey starts here. Swipe to see how our ingredients work together →", likes: 1920, comments: 88, date: "2026-03-08", color: "#1a3a28", icon: "🦠" },
        { type: "reel", caption: "POV: You finally find a greens powder that actually tastes good", likes: 5200, comments: 342, date: "2026-02-28", color: "#3d6b4a", icon: "🎬" },
      ],
      tiktok: [
        { type: "video", caption: "What I eat in a day as a wellness founder #greens #wellness", likes: 8400, comments: 220, date: "2026-02-10", color: "#2D5A3D", icon: "🥤" },
        { type: "video", caption: "How the Super Elixir is made — factory tour 🏭", likes: 4200, comments: 180, date: "2026-01-20", color: "#1a3a28", icon: "🏭" },
        { type: "video", caption: "3 signs your greens powder isn't working", likes: 12800, comments: 450, date: "2025-12-15", color: "#3d6b4a", icon: "⚡" },
      ],
    },
    socialVelocity: {
      instagram: { postsPerWeek: 1.8, engagementRate: 0.9, followerTrend: [410, 405, 400, 395, 392, 388, 385, 383, 382, 381, 380, 380] },
      tiktok: { postsPerWeek: 0.2, engagementRate: 0.3, followerTrend: [8, 8, 9, 9, 10, 10, 11, 11, 11, 12, 12, 12] },
    },
    // Tech & Operations
    techStack: ["Shopify", "Recharge", "Klaviyo", "Yotpo"],
    pricing: { skuCount: 18, priceRange: "$28 — $145", avgPrice: 72, hasSubscription: true, subDiscount: "15%" },
    seoHealth: { domainAuthority: 42, organicKeywords: 1200, keywordTrend: [2200, 2000, 1800, 1600, 1500, 1400, 1350, 1300, 1280, 1250, 1220, 1200] },
    hiring: {
      openRoles: 0, trend: [3, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      departments: [
        { name: "Marketing", roles: 0, change: -2, was: 2 },
        { name: "Operations", roles: 0, change: -1, was: 1 },
        { name: "Customer Service", roles: 0, change: 0, was: 0 },
        { name: "Product", roles: 0, change: 0, was: 0 },
      ],
      recentDepartures: [
        { role: "Head of EU Operations", seniority: "Senior", date: "2026-01", signal: "red" },
        { role: "Customer Experience Manager", seniority: "Mid", date: "2025-11", signal: "red" },
        { role: "Digital Marketing Lead", seniority: "Mid", date: "2025-09", signal: "amber" },
      ],
      avgTenure: "1.8 years", tenureChange: "-0.6 years vs 2024",
      glassdoor: { rating: 2.8, ceoApproval: 35, recommend: 32 },
    },
    // Amazon Presence
    amazon: {
      isOfficial: false, note: "Unauthorized resellers only — not an official channel",
      products: [
        { name: "The Super Elixir Original 300g", bsr: 4250, bsrCategory: "Greens Powders", rating: 4.1, reviews: 342, price: "$145.00", bsrTrend: [3200, 3400, 3600, 3800, 3900, 4000, 4050, 4100, 4150, 4200, 4220, 4250] },
        { name: "Nourishing Protein Chocolate 500g", bsr: 8900, bsrCategory: "Plant Protein", rating: 3.8, reviews: 128, price: "$65.00", bsrTrend: [6500, 7000, 7400, 7800, 8000, 8200, 8400, 8500, 8600, 8700, 8800, 8900] },
        { name: "Sleep Welle Calming Tea 50pk", bsr: 12400, bsrCategory: "Herbal Tea", rating: 4.3, reviews: 89, price: "$38.00", bsrTrend: [10000, 10500, 11000, 11200, 11500, 11800, 12000, 12100, 12200, 12300, 12350, 12400] },
      ],
    },
    // SEO & Keywords
    keywords: [
      { keyword: "super elixir greens", volume: 8100, cpc: 2.40, competition: "medium", trend: [6500, 6800, 7200, 7500, 7800, 8000, 8100, 8100, 8100, 8000, 7900, 8100], position: 1 },
      { keyword: "welleco super elixir", volume: 5400, cpc: 1.80, competition: "low", trend: [7200, 6800, 6400, 6000, 5800, 5600, 5500, 5400, 5400, 5400, 5300, 5400], position: 1 },
      { keyword: "greens powder australia", volume: 12100, cpc: 3.20, competition: "high", trend: [8000, 8500, 9000, 9500, 10000, 10500, 11000, 11200, 11500, 11800, 12000, 12100], position: 8 },
      { keyword: "elle macpherson supplements", volume: 3600, cpc: 0.90, competition: "low", trend: [5200, 4800, 4400, 4200, 4000, 3800, 3700, 3600, 3600, 3600, 3500, 3600], position: 1 },
      { keyword: "best greens powder", volume: 74000, cpc: 4.50, competition: "high", trend: [58000, 60000, 62000, 64000, 66000, 68000, 70000, 71000, 72000, 73000, 73500, 74000], position: 42 },
      { keyword: "daily greens supplement", volume: 22000, cpc: 3.80, competition: "high", trend: [16000, 17000, 18000, 18500, 19000, 19500, 20000, 20500, 21000, 21500, 21800, 22000], position: 28 },
    ],
    // Retailers & Marketplaces
    retailers: [
      { name: "welleco.com", type: "DTC", status: "primary", note: "Main revenue channel" },
      { name: "Net-a-Porter", type: "Luxury Marketplace", status: "active", note: "Premium positioning, limited SKUs" },
      { name: "David Jones", type: "Department Store", status: "active", note: "AU flagship retail presence" },
      { name: "Amazon AU", type: "Marketplace", status: "limited", note: "Unauthorized resellers — not official" },
      { name: "Selfridges", type: "Department Store", status: "inactive", note: "Previously stocked, now discontinued" },
    ],

    // What they built
    brandStory: "Elle Macpherson's wellness brand built around the Super Elixir — a 45-ingredient daily greens powder formulated by Dr. Simone Laubscher PhD. Pioneered the 'luxury daily ritual' positioning in the greens supplement category.",
    whatTheyBuilt: [
      "Cult product (Super Elixir) with genuine 10+ year subscriber loyalty",
      "Celebrity founder with global brand recognition",
      "Premium positioning in a commoditizing category (greens powders)",
      "Proprietary formula with PhD-backed credentialing",
    ],

    // Voice of the customer
    customerVoice: {
      positive: [
        { text: "Wouldn't live without my Super Elixir. Been taking it for 8 years. Nothing else compares.", source: "Trustpilot", date: "2026-01", stars: 5 },
        { text: "The quality is genuinely superior to AG1. You can feel the difference.", source: "Product review", date: "2025-11", stars: 5 },
        { text: "My skin, energy, and digestion all improved within 3 weeks. Worth every penny.", source: "Trustpilot", date: "2025-09", stars: 5 },
        { text: "PhD-formulated and you can tell. This isn't another greens powder — it's medicine-grade.", source: "Reddit", date: "2025-08", stars: 5 },
        { text: "Gifted this to my mum and now she's subscribed. Two generations hooked.", source: "Product review", date: "2025-07", stars: 4 },
      ],
      negative: [
        { text: "Tried to cancel my subscription for 3 months. Still getting charged. No one responds to emails.", source: "Trustpilot", date: "2026-03", stars: 1 },
        { text: "EU delivery has been broken since last year. My last 2 orders never arrived.", source: "Trustpilot", date: "2026-02", stars: 1 },
        { text: "Was charged 3 times in one month. Had to dispute with my bank. Absolutely unacceptable.", source: "Trustpilot", date: "2026-02", stars: 1 },
        { text: "Customer service is non-existent. 5 emails, zero replies. Premium price, zero support.", source: "Trustpilot", date: "2026-01", stars: 1 },
        { text: "Product arrived expired. Requested a replacement 6 weeks ago. Still waiting.", source: "Product review", date: "2025-12", stars: 1 },
      ],
      trustpilotRating: 2.9, reviewCount: 1200,
      avgResponseTime: "19 days", reviewGrowth: "-12%", mostRecentReview: "2 days ago",
    },

    // Gaps vs best in class
    gaps: [
      { area: "Customer Service", description: "Near-zero CS responsiveness — 5+ emails unanswered. No ticketing system, no phone, no live chat.", severity: "critical", competitor: "AG1 offers 24/7 live chat and <2hr email response" },
      { area: "Subscription Billing", description: "Unauthorized recurring charges via Recharge billing platform creating legal liability and brand destruction.", severity: "critical", competitor: "Standard in industry: transparent cancel-anytime flows" },
      { area: "EU Logistics", description: "Customs documentation failures causing systematic delivery failures across European markets.", severity: "high", competitor: "AG1 ships from EU warehouse with 2-3 day delivery" },
      { area: "Marketing", description: "No visible paid acquisition. Zero TikTok presence. Brand awareness declining.", severity: "high", competitor: "AG1 spends $100M+/yr on marketing; Bloom has 4M TikTok followers" },
      { area: "Leadership", description: "Both co-founders aged ~55-62, visibly disengaged. No succession plan. Elle's brand ambassadorship inactive since 2022.", severity: "high", competitor: "Competitor founders are active and public-facing" },
    ],

    // White space / opportunities
    whiteSpace: [
      { opportunity: "Fix subscription billing", description: "Audit Recharge, fix unauthorized charges. Removes legal liability and recovers churn.", timeframe: "30-60 days", impact: "High" },
      { opportunity: "GCC market expansion", description: "Zero UAE/Saudi presence. Super Elixir's luxury daily ritual positioning perfect for Dubai/Riyadh wellness market.", timeframe: "6-9 months", impact: "High" },
      { opportunity: "Clinical study", description: "Commission one clinical study on the formula to de-commoditise vs AG1 and Zoe.", timeframe: "8-12 months", impact: "Medium" },
      { opportunity: "Hire CS team + implement Gorgias", description: "3-5 CS agents. Clear Trustpilot from 2.9 to 4.0+ within 90 days.", timeframe: "90 days", impact: "High" },
    ],

    // Competitor benchmarks
    competitors: [
      { name: "AG1 (Athletic Greens)", metric: "Market leader", strength: "Massive marketing spend, strong brand, global distribution",
        traffic: 4200, trafficTrend: [3000, 3200, 3400, 3500, 3700, 3800, 3900, 4000, 4050, 4100, 4150, 4200],
        instagram: "1.8M", tiktok: "420K", trustpilot: 4.2, reviews: 18400, employees: 800, metaAds: 145, domainAuthority: 78 },
      { name: "Zoe", metric: "Science-led", strength: "Personalization, clinical backing, UK/EU focused",
        traffic: 1800, trafficTrend: [800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1750, 1800],
        instagram: "380K", tiktok: "85K", trustpilot: 4.0, reviews: 5200, employees: 220, metaAds: 68, domainAuthority: 62 },
      { name: "Bloom Nutrition", metric: "TikTok-native", strength: "Gen Z appeal, viral content, 4M+ TikTok followers",
        traffic: 2800, trafficTrend: [1200, 1400, 1600, 1800, 2000, 2200, 2300, 2400, 2500, 2600, 2700, 2800],
        instagram: "2.2M", tiktok: "4.1M", trustpilot: 3.9, reviews: 8200, employees: 150, metaAds: 210, domainAuthority: 55 },
    ],

    // Founder & Leadership
    leadership: [
      { name: "Elle Macpherson", role: "Co-Founder & Brand Ambassador", status: "inactive", linkedin: true, previousExits: 0, note: "Stepped back from public role since 2022. Age ~62. Brand association remains valuable but involvement is minimal." },
      { name: "Andrea Horwood", role: "Co-Founder & CEO", status: "active", linkedin: true, previousExits: 1, note: "Previously founded a wellness consultancy. Has been running WelleCo operationally but showing signs of fatigue." },
      { name: "Dr. Simone Laubscher", role: "Formulator / CSO", status: "active", linkedin: true, previousExits: 0, note: "PhD in nutritional medicine. Created the Super Elixir formula. Key IP holder — critical to retain in any acquisition." },
    ],
    boardAndInvestors: { knownInvestors: "Self-funded / angel", fundingRounds: 0, lastRoundDate: null, estimatedTotalRaised: "<$5M" },

    // Legal & Regulatory
    legalRisk: {
      fdaWarnings: 0, ftcActions: 0, bbbComplaints: 12, bbbRating: "B-",
      activeLawsuits: [
        { type: "Consumer complaint", description: "Unauthorized recurring billing charges — multiple consumer complaints filed with ACCC (Australian Competition & Consumer Commission)", status: "Under review", date: "2026-02" },
      ],
      regulatoryNotes: "Supplements category in Australia regulated by TGA. No adverse findings to date. EU Novel Food regulations may affect some ingredients.",
      trademarks: [
        { name: "WELLECO", status: "active", jurisdiction: "AU, US, EU" },
        { name: "THE SUPER ELIXIR", status: "active", jurisdiction: "AU, US, EU" },
        { name: "SUPER ELIXIR GREENS", status: "pending", jurisdiction: "US" },
      ],
    },

    // M&A Comparables
    maComps: [
      { name: "AG1 acquired by private investors", date: "2022", multiple: "3.5x revenue", dealSize: "$1.2B", note: "Premium multiple for high-growth, category-leading brand" },
      { name: "Vital Proteins acquired by Nestle", date: "2021", multiple: "2.8x revenue", dealSize: "$780M", note: "Strategic acquisition — Nestle wanted wellness portfolio" },
      { name: "Nutrafol majority stake by Groupe Rocher", date: "2022", multiple: "4.0x revenue", dealSize: "$500M+", note: "Premium paid for clinical differentiation and subscription base" },
      { name: "Liquid IV acquired by Unilever", date: "2022", multiple: "3.2x revenue", dealSize: "$500M", note: "Functional hydration — similar category dynamics" },
    ],
    categoryMaActivity: "Active — 12 wellness supplement acquisitions in past 24 months. Strategic buyers (Nestle, Unilever, P&G) and PE firms (L Catterton, TSG Consumer) both active. Multiples range 1.5-4.0x revenue depending on growth rate and brand strength.",

    // Pricing Power
    pricingAnalysis: {
      currentAOV: "$128",
      priceHistory: [
        { date: "2024-01", heroPrice: "$135", note: "Original pricing" },
        { date: "2024-09", heroPrice: "$140", note: "Price increase +3.7%" },
        { date: "2025-06", heroPrice: "$145", note: "Price increase +3.6%" },
      ],
      discountFrequency: "Low — sale section has 8 items (out of 18 SKUs). Black Friday 20% off only major promotion.",
      promoCodeProliferation: "Low — 2 active codes found on coupon sites vs 15+ for AG1",
      priceVsCompetitors: [
        { competitor: "AG1", price: "$99/mo", positioning: "Lower price, mass market positioning" },
        { competitor: "Zoe", price: "$59.99/mo", positioning: "Significantly lower, science/data angle" },
        { competitor: "Bloom Nutrition", price: "$39.99", positioning: "Mass market, Gen Z pricing" },
      ],
    },

    // Channel Dependency
    channelDependency: {
      primaryChannel: "DTC Website (65%)",
      riskLevel: "medium",
      breakdown: [
        { channel: "DTC Website", pct: 65, risk: "low", note: "Owned channel — good" },
        { channel: "Retail (David Jones, Net-a-Porter)", pct: 20, risk: "medium", note: "Dependent on retail partner decisions" },
        { channel: "Amazon (unauthorized)", pct: 15, risk: "high", note: "No control over pricing/brand presentation" },
      ],
      platformRisk: "Low Meta dependency (8% paid traffic). But zero TikTok = missing fastest-growing discovery channel.",
    },

    // Press & Media
    pressCoverage: [
      { outlet: "Vogue Australia", headline: "Is WelleCo Still Worth It in 2026?", date: "2026-02", sentiment: "mixed" },
      { outlet: "Business Insider AU", headline: "WelleCo's Subscription Billing Nightmare", date: "2026-01", sentiment: "negative" },
      { outlet: "The Australian Financial Review", headline: "Elle Macpherson's Wellness Empire Faces Headwinds", date: "2025-11", sentiment: "negative" },
      { outlet: "Byrdie", headline: "The Super Elixir: 8-Year Review — Still the Best Greens?", date: "2025-08", sentiment: "positive" },
      { outlet: "Well+Good", headline: "How WelleCo Pioneered Luxury Wellness", date: "2025-03", sentiment: "positive" },
    ],
    mediaMentionsTrend: [45, 42, 38, 35, 30, 28, 25, 22, 20, 18, 16, 14],

    // Certifications & IP
    // Data Sources — where the intelligence comes from
    dataSources: [
      { platform: "Trustpilot", icon: "⭐", dataPoints: ["Customer reviews", "Star distribution", "Review volume trend", "Sentiment analysis"], count: "1,200 reviews analyzed" },
      { platform: "SimilarWeb", icon: "🌐", dataPoints: ["Website traffic", "Traffic sources", "Top countries", "Competitor traffic"], count: "12 months of data" },
      { platform: "Meta Ad Library", icon: "📢", dataPoints: ["Active ads", "Ad creatives", "Impression estimates", "Run duration"], count: "3 ads tracked" },
      { platform: "Google Trends", icon: "📈", dataPoints: ["Search interest", "Keyword trends", "Category comparison"], count: "12 months tracked" },
      { platform: "LinkedIn", icon: "💼", dataPoints: ["Employee count", "Open roles", "Department breakdown", "Key departures"], count: "45 profiles analyzed" },
      { platform: "Glassdoor", icon: "🏢", dataPoints: ["Company rating", "CEO approval", "Recommend %", "Employee reviews"], count: "Rating: 2.8/5" },
      { platform: "Amazon", icon: "📦", dataPoints: ["BSR tracking", "Product ratings", "Review counts", "Price monitoring"], count: "3 products tracked" },
      { platform: "Reddit", icon: "🔴", dataPoints: ["Brand mentions", "Complaint patterns", "Competitor discussions"], count: "342 mentions found" },
      { platform: "USPTO / IP Australia", icon: "📋", dataPoints: ["Trademark registrations", "Patent filings", "IP status"], count: "3 trademarks, 2 patents" },
      { platform: "ACCC / BBB", icon: "⚖️", dataPoints: ["Consumer complaints", "Regulatory actions", "Business rating"], count: "12 complaints" },
    ],

    certifications: ["Vegan Certified", "Non-GMO", "Gluten-Free", "TGA Listed (Australia)"],
    patents: [
      { title: "Synergistic superfood composition for daily nutritional support", status: "Granted", jurisdiction: "AU", year: 2018 },
      { title: "Method of producing alkalizing greens supplement", status: "Pending", jurisdiction: "US", year: 2023 },
    ],

    summary: "Product works. Brand has sleeping equity. Loyal customer base with 10+ year subscribers proves product-market fit. All issues are operational — not product failure. Fixable within 6-12 months with competent operations.",

    // Signals
    lastActivity: "2026-03-18",
    redFlags: ["Traffic declining >20% YoY", "Trustpilot below 3.0", "No active paid media", "CS response time >14 days", "Key leadership departing"],
    greenFlags: ["Loyal 10+ year subscriber base", "Premium product quality validated", "Strong IP (proprietary formula)"],
    signalTimeline: [
      { date: "2026-03", text: "Trustpilot dropped to 2.9 — unauthorized billing complaints accelerating", type: "red" },
      { date: "2026-02", text: "EU fulfillment pipeline broke — systematic delivery failures", type: "red" },
      { date: "2025-12", text: "Elle Macpherson stepped back from ambassador role", type: "amber" },
      { date: "2025-09", text: "Super Elixir reformulated with 3 new ingredients", type: "green" },
      { date: "2025-06", text: "Launched in 2 new EU markets (Netherlands, Belgium)", type: "green" },
    ],
    starDistribution: { 5: 180, 4: 120, 3: 90, 2: 280, 1: 530 },
    reviewTrend: [60, 65, 70, 80, 95, 110, 130, 140, 135, 120, 105, 95],
  },
  {
    id: "brand-2", name: "Glossier", logo: "GL", logoUrl: "https://unavatar.io/glossier.com", category: "Beauty & Skincare", hq: "New York, USA",
    founded: 2014, employees: 280, website: "glossier.com",
    relatedCategories: ["Peptide Skincare", "Waterless Beauty"],
    relatedTrendKeywords: ["Beef tallow skincare", "Seed cycling"],
    brandColor: "#F5C6C6", bgGradient: "linear-gradient(135deg, #F5C6C6 0%, #e8a0a0 100%)",
    verification: "unverified",
    status: "growth-stalled",
    socialFollowing: { instagram: "2.8M", tiktok: "420K" },
    trafficTrend: [2200, 2100, 2000, 1900, 1850, 1800, 1750, 1700, 1680, 1650, 1620, 1600],
    searchInterest: [85, 82, 78, 72, 68, 65, 62, 60, 58, 55, 53, 50],
    metaAds: [
      { headline: "Boy Brow — The Brow That Started It All", body: "Thick, fluffy brows in one swipe. Our #1 bestseller with 10M+ sold.", cta: "Shop Now", impressions: "8.2M", status: "active", daysRunning: 340, format: "Video", color: "#F5C6C6", hook: "Our #1 bestseller with 10M+ sold", landingPage: "glossier.com/boy-brow" },
      { headline: "Cloud Paint Seamless Blush", body: "A gel-cream blush that looks like skin, not makeup. 8 shades that blend themselves.", cta: "Shop Now", impressions: "5.6M", status: "active", daysRunning: 280, format: "Carousel", color: "#e8a0a0", hook: "A gel-cream blush that looks like skin, not makeup", landingPage: "glossier.com/cloud-paint" },
      { headline: "You Look Good — Glossier Skin Tint", body: "Your skin, but better. Sheer, buildable coverage that lets you through.", cta: "Try Now", impressions: "3.1M", status: "paused", daysRunning: 120, format: "UGC", color: "#d4b5a0", hook: "Your skin, but better", landingPage: "glossier.com/skin-tint" },
      { headline: "Balm Dotcom — Your Everywhere Skin Salve", body: "Hydrate, soothe, and glow. The cult-favourite multitasker in 10 flavours.", cta: "Shop Now", impressions: "2.8M", status: "active", daysRunning: 200, format: "Image", color: "#F5C6C6", hook: "The cult-favourite multitasker in 10 flavours", landingPage: "glossier.com/balm-dotcom" },
    ],
    advertising: {
      totalAds: 42, activeAds: 18,
      formats: { video: 14, image: 12, carousel: 10, ugc: 6 },
      topHooks: [
        { hook: "Our #1 bestseller with 10M+ sold", impressions: "8.2M", ctr: "4.5%" },
        { hook: "A gel-cream blush that looks like skin, not makeup", impressions: "5.6M", ctr: "3.8%" },
        { hook: "Your skin, but better", impressions: "3.1M", ctr: "5.2%" },
        { hook: "The cult-favourite multitasker in 10 flavours", impressions: "2.8M", ctr: "3.4%" },
      ],
      topLandingPages: [
        { url: "glossier.com/boy-brow", visits: "320K", convRate: "4.8%" },
        { url: "glossier.com/cloud-paint", visits: "210K", convRate: "4.2%" },
        { url: "glossier.com/balm-dotcom", visits: "180K", convRate: "3.6%" },
        { url: "glossier.com/skin-tint", visits: "95K", convRate: "2.9%" },
      ],
    },
    trafficSources: { organic: 42, direct: 25, paid: 15, social: 12, referral: 4, email: 2 },
    topCountries: [
      { country: "United States", pct: 58 }, { country: "United Kingdom", pct: 14 },
      { country: "Canada", pct: 10 }, { country: "Australia", pct: 5 },
      { country: "France", pct: 4 }, { country: "Other", pct: 9 },
    ],
    bestSellers: [
      { name: "Boy Brow", price: "$18", category: "Brows", color: "#8B6E58", icon: "✏️" },
      { name: "Cloud Paint", price: "$20", category: "Blush", color: "#E88B8B", icon: "🎨" },
      { name: "Balm Dotcom", price: "$14", category: "Lip", color: "#F5C6C6", icon: "💋" },
    ],
    socialPosts: {
      instagram: [
        { type: "image", caption: "You look good. ✨ #glossier #skincare #beauty", likes: 42000, comments: 680, date: "2026-03-20", color: "#F5C6C6", icon: "✨" },
        { type: "carousel", caption: "Cloud Paint: before and after. The blush that melts into skin.", likes: 28000, comments: 420, date: "2026-03-14", color: "#E88B8B", icon: "🎨" },
        { type: "reel", caption: "My 3-product Glossier routine — 2 minutes flat ⏱️", likes: 68000, comments: 1200, date: "2026-03-08", color: "#d4b5a0", icon: "🎬" },
      ],
      tiktok: [
        { type: "video", caption: "The viral Boy Brow hack everyone's talking about #glossier", likes: 180000, comments: 3200, date: "2026-03-18", color: "#8B6E58", icon: "✏️" },
        { type: "video", caption: "GRWM with only Glossier products — minimal makeup era", likes: 95000, comments: 1800, date: "2026-03-10", color: "#F5C6C6", icon: "💄" },
        { type: "video", caption: "Why Cloud Paint changed my entire makeup routine", likes: 62000, comments: 890, date: "2026-03-01", color: "#E88B8B", icon: "🎨" },
      ],
    },
    socialVelocity: {
      instagram: { postsPerWeek: 4.2, engagementRate: 1.8, followerTrend: [2900, 2880, 2860, 2850, 2840, 2830, 2820, 2810, 2805, 2800, 2800, 2800] },
      tiktok: { postsPerWeek: 2.1, engagementRate: 2.4, followerTrend: [320, 340, 350, 360, 370, 380, 390, 395, 400, 410, 415, 420] },
    },
    techStack: ["Custom Platform", "Sailthru", "Contentful"],
    pricing: { skuCount: 42, priceRange: "$12 — $36", avgPrice: 22, hasSubscription: false, subDiscount: null },
    seoHealth: { domainAuthority: 68, organicKeywords: 8400, keywordTrend: [9200, 9100, 9000, 8900, 8800, 8700, 8600, 8500, 8450, 8420, 8400, 8400] },
    hiring: {
      openRoles: 8, trend: [18, 15, 12, 10, 9, 8, 8, 8, 8, 8, 8, 8],
      departments: [
        { name: "Retail", roles: 3, change: -5, was: 8 },
        { name: "Engineering", roles: 2, change: -4, was: 6 },
        { name: "Marketing", roles: 2, change: -3, was: 5 },
        { name: "Product", roles: 1, change: -2, was: 3 },
      ],
      recentDepartures: [
        { role: "Chief Commercial Officer", seniority: "C-Suite", date: "2026-01", signal: "red" },
        { role: "CFO (3rd in 2 years)", seniority: "C-Suite", date: "2025-08", signal: "red" },
        { role: "VP Retail Strategy", seniority: "Senior", date: "2025-06", signal: "red" },
      ],
      avgTenure: "2.4 years", tenureChange: "-0.8 years vs 2024",
      glassdoor: { rating: 3.4, ceoApproval: 48, recommend: 52 },
    },
    amazon: {
      isOfficial: false, note: "Not sold on Amazon — unauthorized resellers only",
      products: [],
    },
    keywords: [
      { keyword: "glossier", volume: 450000, cpc: 1.20, competition: "low", trend: [520000, 500000, 490000, 480000, 475000, 470000, 465000, 460000, 458000, 455000, 452000, 450000], position: 1 },
      { keyword: "boy brow", volume: 74000, cpc: 0.80, competition: "low", trend: [82000, 80000, 78000, 76000, 75000, 74500, 74200, 74000, 74000, 74000, 74000, 74000], position: 1 },
      { keyword: "cloud paint", volume: 49500, cpc: 0.60, competition: "low", trend: [52000, 51000, 50500, 50000, 49800, 49600, 49500, 49500, 49500, 49500, 49500, 49500], position: 1 },
      { keyword: "balm dotcom", volume: 33100, cpc: 0.50, competition: "low", trend: [36000, 35000, 34500, 34000, 33500, 33200, 33100, 33100, 33000, 33000, 33100, 33100], position: 1 },
      { keyword: "best lip balm", volume: 165000, cpc: 3.20, competition: "high", trend: [140000, 145000, 148000, 150000, 152000, 155000, 158000, 160000, 162000, 163000, 164000, 165000], position: 18 },
      { keyword: "dewy makeup look", volume: 40500, cpc: 2.10, competition: "medium", trend: [28000, 30000, 32000, 34000, 35000, 36000, 37000, 38000, 39000, 40000, 40200, 40500], position: 12 },
    ],
    retailers: [
      { name: "glossier.com", type: "DTC", status: "primary", note: "Main revenue channel — 55% of sales" },
      { name: "Sephora US", type: "Retail", status: "active", note: "In-store + online since 2023" },
      { name: "Sephora Middle East", type: "Retail", status: "active", note: "Launched 2025, growing" },
      { name: "Glossier Flagships", type: "Own Retail", status: "active", note: "NYC, LA, London — under review" },
      { name: "Amazon", type: "Marketplace", status: "inactive", note: "Not sold on Amazon — unauthorized resellers only" },
    ],

    brandStory: "Emily Weiss built Glossier from her beauty blog Into The Gloss into a $1.8B-valued beauty brand that defined the 'skin first, makeup second' movement. Core products like Boy Brow and Cloud Paint have genuine cult followings.",
    whatTheyBuilt: [
      "Category-defining brand that changed how a generation thinks about beauty",
      "Cult hero products with exceptional repeat purchase rates",
      "Community-driven brand identity ahead of its time",
      "2.8M Instagram following with genuine engagement",
    ],

    customerVoice: {
      positive: [
        { text: "Boy Brow is the only brow product I've used for 6 years. Nothing comes close.", source: "Reddit", date: "2026-01" },
        { text: "Cloud Paint changed my entire makeup routine. The formula is perfection.", source: "Product review", date: "2025-12" },
      ],
      negative: [
        { text: "The brand used to feel special. Now it just feels like another beauty company.", source: "Reddit", date: "2026-02" },
        { text: "Haven't seen an exciting launch in over a year. Where's the innovation?", source: "TikTok", date: "2026-01" },
      ],
      trustpilotRating: 3.6, reviewCount: 3400,
    },

    gaps: [
      { area: "Innovation Pipeline", description: "No meaningful new product launch in 18+ months. Category is moving faster than the brand.", severity: "high", competitor: "Rhode launches quarterly with viral sellouts" },
      { area: "Strategic Clarity", description: "Caught between DTC and retail, mass and prestige. No clear positioning since 2022.", severity: "high", competitor: "Rare Beauty has clear mission-driven positioning" },
      { area: "Retail Economics", description: "Flagship stores burning cash. Store-level economics don't work at current traffic.", severity: "high", competitor: "e.l.f. grew retail profitably via Walmart/Target" },
      { area: "Cultural Relevance", description: "Lost 'cool factor' — Gen Z audience moved to Rhode, Rare Beauty. Perceived as millennial brand.", severity: "medium", competitor: "Rhode is the Gen Z beauty brand of the moment" },
    ],

    whiteSpace: [
      { opportunity: "Rationalize retail footprint", description: "Close underperforming flagships, convert to pop-up model. Redirect capital to DTC and wholesale.", timeframe: "6 months", impact: "High" },
      { opportunity: "Product innovation sprint", description: "5 new SKU launches in 12 months. Focus on skin tint and complexion — their strongest category.", timeframe: "12 months", impact: "High" },
      { opportunity: "Asia expansion", description: "Zero presence in Asia's largest beauty market. Brand recognition exists from social media.", timeframe: "9-12 months", impact: "High" },
    ],

    competitors: [
      { name: "Rhode (Hailey Bieber)", metric: "Viral launches", strength: "Celebrity founder, Gen Z appeal, sold-out drops" },
      { name: "Rare Beauty (Selena Gomez)", metric: "Mission-driven", strength: "Inclusive positioning, mental health mission" },
      { name: "e.l.f. Beauty", metric: "Value leader", strength: "TikTok mastery, mass distribution, strong growth" },
    ],

    summary: "Brand equity remains exceptionally strong. Core products have genuine repeat purchase behavior. Needs strategic clarity and innovation — not a turnaround. The community and product love are real; the execution has stalled.",

    lastActivity: "2026-03-20",
    redFlags: ["Valuation dropped >60%", "C-suite turnover (3 CFOs in 2 years)", "Innovation pipeline stalled 18+ months", "Retail stores burning cash"],
    greenFlags: ["2.8M Instagram following with genuine engagement", "Cult hero products (Boy Brow, Cloud Paint)", "Strong repeat purchase rate", "Brand awareness remains very high"],
    signalTimeline: [
      { date: "2026-02", text: "Gen Z brand trackers show Glossier dropping from top 10 for first time", type: "red" },
      { date: "2026-01", text: "Chief Commercial Officer departed", type: "red" },
      { date: "2025-09", text: "Play sub-brand officially shuttered — $60M+ write-off", type: "red" },
      { date: "2025-06", text: "Boy Brow reformulation received positive reviews", type: "green" },
      { date: "2025-03", text: "Launched in Sephora Middle East — first GCC presence", type: "green" },
    ],
    starDistribution: { 5: 890, 4: 720, 3: 580, 2: 640, 1: 570 },
    reviewTrend: [320, 310, 290, 280, 270, 260, 250, 245, 240, 235, 230, 225],
  },
  {
    id: "brand-3", name: "Huel", logo: "HU", logoUrl: "https://unavatar.io/huel.com", category: "Meal Replacement", hq: "Tring, UK",
    founded: 2015, employees: 320, website: "huel.com",
    brandColor: "#000000", bgGradient: "linear-gradient(135deg, #1a1a1a 0%, #333 100%)",
    verification: "verified",
    listedBy: "Founder", listedDate: "2026-02-15", verifiedRevenue: "$220M ARR",
    status: "open-to-consulting",
    socialFollowing: { instagram: "620K", tiktok: "85K" },
    trafficTrend: [1800, 1850, 1900, 1920, 1940, 1960, 1970, 1980, 1990, 2000, 2010, 2020],
    searchInterest: [70, 72, 73, 74, 74, 75, 75, 76, 76, 76, 77, 77],
    metaAds: [
      { headline: "Complete Nutrition in 60 Seconds", body: "Everything your body needs in one meal. Balanced macros, 27 vitamins. Just add water.", impressions: "12.4M", status: "active", daysRunning: 365, format: "Video", color: "#1A1A1A", hook: "Everything your body needs in one meal", landingPage: "huel.com/products/powder" },
      { headline: "Huel Hot & Savoury — Not Just Shakes", body: "Nutritionally complete hot meals. Ready in 5 minutes. From Mac & Cheeze to Thai Green Curry.", impressions: "8.9M", status: "active", daysRunning: 280, format: "UGC", color: "#333", hook: "Nutritionally complete hot meals. Ready in 5 minutes.", landingPage: "huel.com/hot-and-savoury" },
      { headline: "400 Calories. 27 Vitamins. Zero Effort.", body: "Stop overpaying for lunch. Huel gives you everything you need for less than £2 a meal.", impressions: "6.2M", status: "active", daysRunning: 180, format: "Image", color: "#2a2a2a", hook: "Stop overpaying for lunch", landingPage: "huel.com/shop" },
      { headline: "What I Eat in a Day — Huel Edition", body: "Watch how busy professionals fuel their entire day with Huel. No meal prep, no stress.", impressions: "4.1M", status: "active", daysRunning: 120, format: "UGC", color: "#1A1A1A", hook: "No meal prep, no stress", landingPage: "huel.com/starter-kit" },
    ],
    advertising: {
      totalAds: 86, activeAds: 34,
      formats: { video: 28, image: 22, carousel: 18, ugc: 18 },
      topHooks: [
        { hook: "Everything your body needs in one meal", impressions: "12.4M", ctr: "3.9%" },
        { hook: "Nutritionally complete hot meals. Ready in 5 minutes.", impressions: "8.9M", ctr: "4.2%" },
        { hook: "Stop overpaying for lunch", impressions: "6.2M", ctr: "5.1%" },
        { hook: "No meal prep, no stress", impressions: "4.1M", ctr: "3.6%" },
      ],
      topLandingPages: [
        { url: "huel.com/products/powder", visits: "480K", convRate: "5.2%" },
        { url: "huel.com/hot-and-savoury", visits: "310K", convRate: "4.8%" },
        { url: "huel.com/starter-kit", visits: "220K", convRate: "6.1%" },
        { url: "huel.com/shop", visits: "180K", convRate: "3.2%" },
      ],
    },
    trafficSources: { organic: 38, direct: 32, paid: 14, social: 8, referral: 5, email: 3 },
    topCountries: [
      { country: "United Kingdom", pct: 38 }, { country: "United States", pct: 28 },
      { country: "Germany", pct: 12 }, { country: "Japan", pct: 6 },
      { country: "France", pct: 5 }, { country: "Other", pct: 11 },
    ],
    bestSellers: [
      { name: "Huel Black Edition Powder", price: "$46", category: "Powder" },
      { name: "Huel Hot & Savoury", price: "$42", category: "Meals" },
      { name: "Huel Ready-to-Drink", price: "$48/12pk", category: "RTD" },
    ],
    socialVelocity: {
      instagram: { postsPerWeek: 5.5, engagementRate: 1.4, followerTrend: [580, 585, 590, 595, 600, 605, 608, 610, 612, 615, 618, 620] },
      tiktok: { postsPerWeek: 3.2, engagementRate: 2.8, followerTrend: [45, 50, 55, 58, 62, 65, 70, 72, 76, 80, 82, 85] },
    },
    techStack: ["Shopify Plus", "Klaviyo", "Gorgias", "Yotpo", "Google Analytics 4"],
    pricing: { skuCount: 32, priceRange: "$28 — $72", avgPrice: 44, hasSubscription: true, subDiscount: "10%" },
    seoHealth: { domainAuthority: 72, organicKeywords: 12800, keywordTrend: [11000, 11200, 11500, 11800, 12000, 12100, 12200, 12400, 12500, 12600, 12700, 12800] },
    hiring: { openRoles: 15, trend: [8, 9, 10, 10, 11, 12, 12, 13, 14, 14, 15, 15] },

    brandStory: "Complete nutrition brand that pioneered 'meals in a bottle' for time-poor professionals. Profitable with strong unit economics but hitting a growth ceiling — brand perception as 'tech bro food' limits addressable market.",
    whatTheyBuilt: [
      "Profitable $220M revenue business with 35% subscriber revenue",
      "Strong NPS (38) and genuine product loyalty",
      "Category pioneer — 'Complete nutrition' brand archetype",
      "International presence across US, UK, EU",
    ],

    customerVoice: {
      positive: [
        { text: "Huel replaced my breakfast and lunch 5 days a week for 3 years. Best health decision I've made.", source: "Reddit", date: "2026-02" },
        { text: "The new Hot & Savoury is actually delicious. Way better than expected.", source: "Trustpilot", date: "2026-01" },
      ],
      negative: [
        { text: "I keep recommending Huel to women friends but they all think it's a 'bro' thing.", source: "Reddit", date: "2026-01" },
        { text: "The branding feels very masculine. Wish they'd make it more approachable.", source: "Trustpilot", date: "2025-12" },
      ],
      trustpilotRating: 4.1, reviewCount: 8500,
    },

    gaps: [
      { area: "Brand Positioning", description: "Perceived as 'tech bro food' — limiting addressable market. Female consumers underrepresented.", severity: "medium", competitor: "Ka'Chava positions as organic/natural, appeals to broader audience" },
      { area: "Retail Distribution", description: "100% online. No convenience store, gas station, or grocery presence for impulse/trial.", severity: "medium", competitor: "Soylent available in 30,000+ US retail locations" },
      { area: "Growth Rate", description: "Decelerated from 40% to 8% YoY. US expansion stalling.", severity: "medium", competitor: "AG1 growing 30%+ YoY with aggressive marketing" },
    ],

    whiteSpace: [
      { opportunity: "Female-focused product line", description: "Develop products and branding specifically for women's nutrition needs.", timeframe: "12-18 months", impact: "High" },
      { opportunity: "Convenience/retail channel", description: "Ready-to-drink format in grab-and-go channels. Currently 100% online.", timeframe: "12 months", impact: "High" },
      { opportunity: "Workplace partnerships", description: "B2B office/corporate wellness channel. Huel as the 'office lunch solution'.", timeframe: "6-12 months", impact: "Medium" },
    ],

    competitors: [
      { name: "AG1 (Athletic Greens)", metric: "Premium wellness", strength: "Podcast advertising, premium positioning, 30%+ growth" },
      { name: "Soylent", metric: "Retail presence", strength: "First mover, 30K+ retail locations, convenience" },
      { name: "Ka'Chava", metric: "Natural positioning", strength: "Organic/natural, broader demographic appeal" },
    ],

    summary: "Profitable business with strong unit economics but hitting a growth ceiling. Not a turnaround — a strategic opportunity to unlock the next phase through repositioning and channel expansion.",

    lastActivity: "2026-03-21",
    redFlags: ["Growth decelerated from 40% to 8%", "Brand perceived as 'tech bro food'", "US expansion stalling"],
    greenFlags: ["Profitable with strong unit economics", "35% subscriber revenue (sticky)", "NPS of 38 — genuine product love", "Active hiring (15+ roles)", "Regular product launches", "Strong social content output"],
    signalTimeline: [
      { date: "2026-03", text: "Launched Huel Daily Greens — entering AG1's category", type: "green" },
      { date: "2026-01", text: "Opened first physical retail pop-up in London", type: "green" },
      { date: "2025-10", text: "US growth rate dropped below 5% for first time", type: "amber" },
      { date: "2025-08", text: "Hired new VP Marketing from Oatly", type: "green" },
    ],
    starDistribution: { 5: 3800, 4: 2100, 3: 1200, 2: 800, 1: 600 },
    reviewTrend: [680, 690, 700, 710, 720, 730, 740, 750, 755, 760, 765, 770],
  },
  {
    id: "brand-4", name: "Brandless", logo: "BL", logoUrl: "https://unavatar.io/brandless.com", category: "CPG / Essentials", hq: "San Francisco, USA",
    founded: 2017, employees: 12, website: "brandless.com",
    brandColor: "#E8673C", bgGradient: "linear-gradient(135deg, #E8673C 0%, #c44e28 100%)",
    verification: "unverified",
    status: "looking-to-sell",
    socialFollowing: { instagram: "89K", tiktok: "2K" },
    trafficTrend: [80, 65, 50, 40, 32, 25, 20, 16, 12, 10, 8, 7],
    searchInterest: [45, 38, 30, 24, 18, 14, 10, 8, 6, 5, 4, 3],
    metaAds: [],
    advertising: {
      totalAds: 0, activeAds: 0,
      formats: { video: 0, image: 0, carousel: 0, ugc: 0 },
      topHooks: [],
      topLandingPages: [],
    },
    trafficSources: { organic: 45, direct: 35, paid: 0, social: 12, referral: 5, email: 3 },
    topCountries: [{ country: "United States", pct: 82 }, { country: "Canada", pct: 8 }, { country: "Other", pct: 10 }],
    bestSellers: [
      { name: "Organic Snack Mix", price: "$6", category: "Snacks" },
      { name: "Hand Soap", price: "$4", category: "Home" },
      { name: "Face Moisturizer", price: "$9", category: "Beauty" },
    ],
    socialVelocity: {
      instagram: { postsPerWeek: 0, engagementRate: 0.1, followerTrend: [120, 115, 110, 105, 100, 98, 95, 93, 92, 91, 90, 89] },
      tiktok: { postsPerWeek: 0, engagementRate: 0, followerTrend: [3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2] },
    },
    techStack: ["Shopify (outdated)"],
    pricing: { skuCount: 8, priceRange: "$3 — $12", avgPrice: 6, hasSubscription: false, subDiscount: null },
    seoHealth: { domainAuthority: 38, organicKeywords: 180, keywordTrend: [1200, 1000, 800, 600, 450, 350, 280, 240, 210, 195, 185, 180] },
    hiring: { openRoles: 0, trend: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },

    brandStory: "Raised $292M (including SoftBank Vision Fund) with a '$3 for everything' model that never achieved unit economics. Pivoted twice, now operating with a skeleton crew. Brand name and domain may have residual value.",
    whatTheyBuilt: [
      "Recognizable brand name and domain with media coverage history",
      "Proved market interest in simplified, accessible consumer goods",
      "Built and lost a $240M peak revenue business — lessons learned",
    ],

    customerVoice: {
      positive: [
        { text: "The original Brandless concept was genuinely great. Simple, affordable, quality basics.", source: "Reddit", date: "2025-06" },
      ],
      negative: [
        { text: "What even is Brandless now? The website barely works.", source: "Reddit", date: "2026-01" },
        { text: "I loved the old Brandless. Whatever it is now isn't that.", source: "Trustpilot", date: "2025-09" },
      ],
      trustpilotRating: 2.1, reviewCount: 340,
    },

    gaps: [
      { area: "Business Model", description: "Original '$3 for everything' was unit-economics negative. Never found sustainable pricing.", severity: "critical", competitor: "Public Goods uses membership model with sustainable margins" },
      { area: "Supply Chain", description: "All supplier relationships degraded. Would need complete rebuild.", severity: "critical", competitor: "Grove Collaborative has established supply chain" },
      { area: "Technology", description: "E-commerce platform outdated and barely functional.", severity: "high", competitor: "Standard Shopify migration would fix this" },
    ],

    whiteSpace: [
      { opportunity: "Acquire brand name + IP only", description: "The 'Brandless' trademark and domain have value for a complete rebrand/relaunch.", timeframe: "30 days", impact: "Medium" },
      { opportunity: "Pivot to private-label platform", description: "Use brand recognition and remaining relationships to build a private-label marketplace.", timeframe: "12-18 months", impact: "Medium" },
    ],

    competitors: [
      { name: "Public Goods", metric: "Membership model", strength: "Sustainable essentials, clean design" },
      { name: "Grove Collaborative", metric: "Eco-friendly", strength: "Sustainability focus, public company" },
      { name: "Amazon Basics", metric: "Scale", strength: "Price, distribution, trust" },
    ],

    summary: "Asset acquisition only — the operating business is effectively dead. Brand name has some residual value but carries negative associations. Only interesting as a domain/trademark play for a new venture.",

    lastActivity: "2025-11-02",
    redFlags: ["Revenue collapsed 98% from peak", "Workforce reduced 94%", "Burned through $292M VC funding", "Brand name associated with failure", "Website barely functional", "No social activity in 4+ months"],
    greenFlags: ["Recognizable brand name + domain", "Original concept validated market interest"],
    signalTimeline: [
      { date: "2026-01", text: "Website traffic dropped to near-zero — under 10K monthly visits", type: "red" },
      { date: "2025-09", text: "Last social media post across all platforms", type: "red" },
      { date: "2025-06", text: "Final round of layoffs — from 30 to ~12 employees", type: "red" },
    ],
    starDistribution: { 5: 40, 4: 30, 3: 50, 2: 80, 1: 140 },
    reviewTrend: [45, 40, 35, 30, 25, 20, 18, 15, 12, 10, 8, 6],
  },
  {
    id: "brand-5", name: "Native", logo: "ND", logoUrl: "https://unavatar.io/nativecos.com", category: "Personal Care", hq: "San Francisco, USA",
    founded: 2015, employees: 65, website: "nativecos.com",
    brandColor: "#5B8A72", bgGradient: "linear-gradient(135deg, #5B8A72 0%, #3d6b55 100%)",
    verification: "claimed",
    listedBy: "M&A Advisor", listedDate: "2026-03-01",
    status: "looking-to-sell",
    socialFollowing: { instagram: "420K", tiktok: "35K" },
    trafficTrend: [900, 920, 930, 940, 945, 950, 950, 955, 955, 960, 960, 960],
    searchInterest: [60, 60, 59, 58, 58, 57, 57, 56, 56, 55, 55, 55],
    metaAds: [
      { headline: "Natural Deodorant That Actually Works", body: "Aluminum-free, long-lasting protection. 10 signature scents. 30-day risk-free trial.", impressions: "4.8M", status: "active", daysRunning: 300, format: "Video", color: "#7B4F3A", hook: "Aluminum-free, long-lasting protection", landingPage: "nativecos.com/deodorant" },
      { headline: "Switch to Native — Feel the Difference", body: "Thousands of 5-star reviews. Clean ingredients. Made for real people.", impressions: "3.2M", status: "active", daysRunning: 180, format: "Carousel", color: "#A0522D", hook: "Thousands of 5-star reviews. Clean ingredients.", landingPage: "nativecos.com/bundle" },
      { headline: "New Seasonal Scents — Limited Edition", body: "Spring has arrived at Native. Fresh, light, and gone fast. Shop the collection.", impressions: "1.4M", status: "paused", daysRunning: 45, format: "Image", color: "#8B7355", hook: "Fresh, light, and gone fast", landingPage: "nativecos.com/seasonal" },
      { headline: "Body Wash + Deo Bundle — Save 20%", body: "Your whole routine, simplified. Bundle and save on bestselling body care.", impressions: "2.1M", status: "active", daysRunning: 120, format: "Image", color: "#7B4F3A", hook: "Your whole routine, simplified", landingPage: "nativecos.com/bundle-save" },
    ],
    advertising: {
      totalAds: 52, activeAds: 22,
      formats: { video: 18, image: 16, carousel: 12, ugc: 6 },
      topHooks: [
        { hook: "Aluminum-free, long-lasting protection", impressions: "4.8M", ctr: "3.4%" },
        { hook: "Thousands of 5-star reviews. Clean ingredients.", impressions: "3.2M", ctr: "2.9%" },
        { hook: "Your whole routine, simplified", impressions: "2.1M", ctr: "4.0%" },
        { hook: "Fresh, light, and gone fast", impressions: "1.4M", ctr: "3.1%" },
      ],
      topLandingPages: [
        { url: "nativecos.com/deodorant", visits: "190K", convRate: "5.4%" },
        { url: "nativecos.com/bundle-save", visits: "120K", convRate: "6.2%" },
        { url: "nativecos.com/bundle", visits: "88K", convRate: "4.1%" },
        { url: "nativecos.com/seasonal", visits: "42K", convRate: "3.8%" },
      ],
    },
    trafficSources: { organic: 28, direct: 20, paid: 22, social: 10, referral: 8, email: 12 },
    topCountries: [{ country: "United States", pct: 78 }, { country: "Canada", pct: 12 }, { country: "United Kingdom", pct: 4 }, { country: "Other", pct: 6 }],
    bestSellers: [
      { name: "Coconut & Vanilla Deodorant", price: "$14", category: "Deodorant" },
      { name: "Charcoal Deodorant", price: "$14", category: "Deodorant" },
      { name: "Body Wash — Cucumber & Mint", price: "$10", category: "Body Wash" },
    ],
    socialVelocity: {
      instagram: { postsPerWeek: 3.5, engagementRate: 1.2, followerTrend: [400, 405, 408, 410, 412, 414, 416, 417, 418, 419, 420, 420] },
      tiktok: { postsPerWeek: 1.5, engagementRate: 1.8, followerTrend: [22, 24, 25, 27, 28, 29, 30, 31, 32, 33, 34, 35] },
    },
    techStack: ["Shopify Plus", "P&G Infrastructure", "Bazaarvoice"],
    pricing: { skuCount: 28, priceRange: "$10 — $18", avgPrice: 13, hasSubscription: true, subDiscount: "12%" },
    seoHealth: { domainAuthority: 58, organicKeywords: 4200, keywordTrend: [4500, 4450, 4400, 4380, 4350, 4320, 4300, 4280, 4260, 4240, 4220, 4200] },
    hiring: { openRoles: 3, trend: [5, 5, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3] },

    brandStory: "DTC natural deodorant pioneer acquired by P&G for $100M in 2017. Strong product with loyal Amazon review base (4.3 stars, 45K+ reviews). Lost indie authenticity post-acquisition — P&G reportedly looking to divest non-core DTC acquisitions.",
    whatTheyBuilt: [
      "Natural deodorant category leader with 45K+ Amazon reviews at 4.3 stars",
      "Proven product-market fit — natural deodorant that actually works",
      "Established retail distribution through P&G channels",
      "Strong brand recognition in natural personal care",
    ],

    customerVoice: {
      positive: [
        { text: "Only natural deodorant I've found that actually works through a workout.", source: "Amazon", date: "2026-02" },
        { text: "Been using Native for 5 years. Tried others, always come back.", source: "Product review", date: "2026-01" },
      ],
      negative: [
        { text: "Quality has changed since P&G bought them. Formula feels different.", source: "Reddit", date: "2026-02" },
        { text: "Used to feel like supporting an indie brand. Now it's just P&G.", source: "Reddit", date: "2025-12" },
      ],
      trustpilotRating: 3.9, reviewCount: 2100,
    },

    gaps: [
      { area: "Brand Identity", description: "Lost DTC/indie authenticity after P&G acquisition. Core audience feels 'sold out'.", severity: "medium", competitor: "Each & Every maintains indie positioning with subscription model" },
      { area: "Innovation", description: "Product line stagnated — same SKUs for 3 years with seasonal scent variants only.", severity: "medium", competitor: "Lume expanded into whole-body care positioning" },
      { area: "Ownership", description: "P&G may divest — brand could be available as carve-out at discount to book value.", severity: "low", competitor: "N/A" },
    ],

    whiteSpace: [
      { opportunity: "Carve-out from P&G", description: "Re-establish indie positioning. P&G likely to sell at discount.", timeframe: "6-9 months", impact: "High" },
      { opportunity: "Whole-body care expansion", description: "Extend from deodorant into body wash, lotion, hair care. Natural personal care ecosystem.", timeframe: "12 months", impact: "High" },
    ],

    competitors: [
      { name: "Lume", metric: "Whole-body positioning", strength: "Strong DTC, expanded beyond deodorant" },
      { name: "Each & Every", metric: "Clean + subscription", strength: "Indie appeal, subscription model" },
      { name: "Dove (Unilever)", metric: "Mass market", strength: "Distribution, brand trust, scale" },
    ],

    summary: "Strong brand being underutilized inside a corporate parent. Divestiture opportunity — solid revenue base and healthy margins. Core product genuinely works and has loyal customers.",

    lastActivity: "2026-03-15",
    redFlags: ["Lost indie brand identity post-P&G acquisition", "Product line stagnant for 3 years", "Quality complaints increasing"],
    greenFlags: ["45K+ Amazon reviews at 4.3 stars", "Proven product-market fit", "Established retail distribution", "Profitable business", "P&G may divest at discount"],
    signalTimeline: [
      { date: "2026-03", text: "Industry reports suggest P&G reviewing DTC portfolio for divestiture", type: "green" },
      { date: "2026-02", text: "Lume launched direct competitor product in same retail channels", type: "amber" },
      { date: "2025-12", text: "No new product launches in 12 months", type: "red" },
      { date: "2025-09", text: "Amazon reviews crossed 45K milestone — category leader in reviews", type: "green" },
    ],
    starDistribution: { 5: 980, 4: 520, 3: 280, 2: 180, 1: 140 },
    reviewTrend: [160, 165, 170, 175, 178, 180, 182, 184, 185, 186, 187, 188],
  },
  {
    id: "brand-6", name: "Barkbox", logo: "BB", logoUrl: "https://unavatar.io/barkbox.com", category: "Pet Products", hq: "New York, USA",
    founded: 2011, employees: 380, website: "barkbox.com",
    brandColor: "#4A90D9", bgGradient: "linear-gradient(135deg, #4A90D9 0%, #2d6cb5 100%)",
    verification: "verified",
    listedBy: "Board", listedDate: "2026-01-20", verifiedRevenue: "$410M ARR",
    status: "looking-to-sell",
    socialFollowing: { instagram: "1.2M", tiktok: "340K" },
    trafficTrend: [3200, 3100, 3000, 2900, 2800, 2700, 2600, 2500, 2450, 2400, 2350, 2300],
    searchInterest: [75, 72, 70, 68, 65, 62, 60, 58, 56, 54, 52, 50],
    metaAds: [
      { headline: "Every Month, a New Adventure for Your Pup", body: "2 toys, 2 bags of treats, and a chew. Delivered to your door. Cancel anytime.", impressions: "18.5M", status: "active", daysRunning: 365, format: "UGC", color: "#1565C0", hook: "Delivered to your door. Cancel anytime.", landingPage: "barkbox.com/subscribe" },
      { headline: "Super Chewer Box — Tough Toys for Tough Dogs", body: "Guaranteed tough toys for aggressive chewers. If they destroy it, we replace it.", impressions: "11.2M", status: "active", daysRunning: 300, format: "Video", color: "#0D47A1", hook: "If they destroy it, we replace it", landingPage: "barkbox.com/super-chewer" },
      { headline: "First Box for $5 — Treat Your Dog", body: "Sign up today and get your first BarkBox for just $5. Your dog deserves it.", impressions: "8.8M", status: "active", daysRunning: 240, format: "Carousel", color: "#1976D2", hook: "Your dog deserves it", landingPage: "barkbox.com/offer" },
      { headline: "Unboxing Day Is the Best Day", body: "Watch real dogs go wild for their BarkBox. Pure joy, every single month.", impressions: "6.4M", status: "active", daysRunning: 180, format: "UGC", color: "#1565C0", hook: "Pure joy, every single month", landingPage: "barkbox.com/gift" },
    ],
    advertising: {
      totalAds: 124, activeAds: 48,
      formats: { video: 32, image: 28, carousel: 24, ugc: 40 },
      topHooks: [
        { hook: "Delivered to your door. Cancel anytime.", impressions: "18.5M", ctr: "4.8%" },
        { hook: "If they destroy it, we replace it", impressions: "11.2M", ctr: "5.2%" },
        { hook: "Your dog deserves it", impressions: "8.8M", ctr: "6.1%" },
        { hook: "Pure joy, every single month", impressions: "6.4M", ctr: "4.4%" },
      ],
      topLandingPages: [
        { url: "barkbox.com/subscribe", visits: "820K", convRate: "7.2%" },
        { url: "barkbox.com/super-chewer", visits: "540K", convRate: "6.8%" },
        { url: "barkbox.com/offer", visits: "410K", convRate: "8.4%" },
        { url: "barkbox.com/gift", visits: "220K", convRate: "5.1%" },
      ],
    },
    trafficSources: { organic: 30, direct: 25, paid: 28, social: 10, referral: 4, email: 3 },
    topCountries: [{ country: "United States", pct: 88 }, { country: "Canada", pct: 6 }, { country: "United Kingdom", pct: 3 }, { country: "Other", pct: 3 }],
    bestSellers: [
      { name: "Monthly Subscription Box", price: "$35/mo", category: "Subscription" },
      { name: "Super Chewer Box", price: "$45/mo", category: "Subscription" },
      { name: "BARK Bright Dental Kit", price: "$30", category: "Health" },
    ],
    socialVelocity: {
      instagram: { postsPerWeek: 7, engagementRate: 3.2, followerTrend: [1100, 1110, 1120, 1130, 1140, 1150, 1160, 1170, 1175, 1180, 1190, 1200] },
      tiktok: { postsPerWeek: 5, engagementRate: 4.8, followerTrend: [220, 240, 255, 270, 280, 290, 300, 310, 318, 325, 332, 340] },
    },
    techStack: ["Shopify Plus", "Recharge", "Kustomer", "Segment", "Iterable"],
    pricing: { skuCount: 45, priceRange: "$5 — $45", avgPrice: 28, hasSubscription: true, subDiscount: "40% first box" },
    seoHealth: { domainAuthority: 65, organicKeywords: 6800, keywordTrend: [7500, 7400, 7300, 7200, 7100, 7050, 7000, 6950, 6900, 6850, 6820, 6800] },
    hiring: {
      openRoles: 25, trend: [30, 28, 26, 25, 25, 25, 25, 25, 25, 25, 25, 25],
      departments: [
        { name: "Engineering", roles: 8, change: 0, was: 8 },
        { name: "Marketing", roles: 6, change: -2, was: 8 },
        { name: "Product", roles: 5, change: 1, was: 4 },
        { name: "Operations", roles: 4, change: -1, was: 5 },
        { name: "Customer Success", roles: 2, change: -2, was: 4 },
      ],
      recentDepartures: [
        { role: "Former CEO (replaced by Chewy VP)", seniority: "C-Suite", date: "2025-09", signal: "amber" },
        { role: "VP Supply Chain", seniority: "Senior", date: "2025-07", signal: "red" },
      ],
      avgTenure: "2.8 years", tenureChange: "-0.4 years vs 2024",
      glassdoor: { rating: 3.6, ceoApproval: 62, recommend: 58 },
    },
    amazon: {
      isOfficial: true, note: "Official Amazon storefront — significant channel",
      products: [
        { name: "BARK Super Chewer Box - Monthly", bsr: 180, bsrCategory: "Dog Toys", rating: 4.4, reviews: 18200, price: "$45.00/mo", bsrTrend: [120, 130, 140, 145, 150, 155, 160, 165, 168, 172, 175, 180] },
        { name: "BARK Bright Dental Kit", bsr: 420, bsrCategory: "Dog Dental Care", rating: 4.6, reviews: 8400, price: "$30.00", bsrTrend: [350, 360, 370, 375, 380, 385, 390, 395, 400, 408, 415, 420] },
        { name: "BarkBox Best of Box - Sampler", bsr: 890, bsrCategory: "Dog Treats", rating: 4.3, reviews: 5200, price: "$35.00", bsrTrend: [600, 650, 700, 720, 750, 780, 800, 820, 840, 860, 875, 890] },
      ],
    },

    brandStory: "Subscription box pioneer for dogs — custom toys, treats, and chews delivered monthly. Built genuine emotional brand connection. Went public via SPAC at $1.6B but market cap collapsed to ~$60M. Revenue at scale but persistent losses.",
    whatTheyBuilt: [
      "$410M revenue business with 1.2M Instagram following",
      "Genuine emotional brand — dogs love the products, owners love the unboxing",
      "High NPS (45) and strong engagement on unboxing content",
      "Custom toy/treat design capability unique in the market",
    ],

    customerVoice: {
      positive: [
        { text: "My dog goes INSANE when the Barkbox arrives. Best subscription we have.", source: "Trustpilot", date: "2026-02" },
        { text: "The themed boxes are so creative. My dog and I both look forward to it.", source: "Product review", date: "2026-01" },
      ],
      negative: [
        { text: "Price keeps going up but the toys feel cheaper. Used to feel like a premium box.", source: "Reddit", date: "2026-01" },
        { text: "After 6 months the novelty wears off. Hard to justify when Chewy is cheaper.", source: "Trustpilot", date: "2025-12" },
      ],
      trustpilotRating: 3.8, reviewCount: 12400,
    },

    gaps: [
      { area: "Unit Economics", description: "COGS on custom toys/treats too high. Box assembly and shipping erode margins. Persistent quarterly losses.", severity: "critical", competitor: "Chewy subscription box at 40% lower price with similar quality" },
      { area: "Retention", description: "Churn accelerates after month 6. Novelty wears off and value perception drops.", severity: "high", competitor: "Chewy autoship model has higher retention (needs-based vs wants-based)" },
      { area: "Capital Structure", description: "Public company trading below cash value. SPAC structure creating misaligned incentives.", severity: "high", competitor: "Private competitors can invest for long-term without quarterly pressure" },
    ],

    whiteSpace: [
      { opportunity: "Pivot to pet wellness platform", description: "Leverage subscriber base to sell health products, televet, insurance. Beyond treats/toys.", timeframe: "12-18 months", impact: "High" },
      { opportunity: "Take private and restructure", description: "Acquire at distressed public valuation. Cut costs, focus on profitable segments.", timeframe: "6-9 months", impact: "High" },
      { opportunity: "Retail partnerships", description: "Barkbox-branded endcaps in pet stores. Revenue without fulfillment costs.", timeframe: "6-12 months", impact: "Medium" },
    ],

    competitors: [
      { name: "Chewy", metric: "Scale leader", strength: "Scale, trust, autoship, 32% market share" },
      { name: "PupBox (Petco)", metric: "Retail-backed", strength: "In-store distribution, Petco integration" },
      { name: "Amazon Pet", metric: "Convenience", strength: "Price, Prime integration, massive reach" },
    ],

    summary: "Revenue-at-scale opportunity. The brand and subscriber base are genuinely valuable — the public market structure and cost base are the problems. Take-private at current valuation could be highly accretive.",

    lastActivity: "2026-03-22",
    redFlags: ["Market cap collapsed 96% from SPAC peak", "Persistent quarterly losses", "CAC rising while LTV declining", "Chewy launched competing product at 40% lower price"],
    greenFlags: ["$410M revenue at scale", "1.2M Instagram + 340K TikTok following", "NPS of 45 — dogs genuinely love the products", "Active hiring (25+ roles)", "Strong unboxing content engagement", "Custom toy/treat design capability"],
    signalTimeline: [
      { date: "2026-03", text: "Board confirmed exploring strategic alternatives including take-private", type: "green" },
      { date: "2026-02", text: "Q4 earnings: revenue declined 12% YoY", type: "red" },
      { date: "2026-01", text: "Chewy launched subscription box at 40% lower price", type: "red" },
      { date: "2025-11", text: "Launched wellness product line (vitamins, dental chews)", type: "green" },
      { date: "2025-09", text: "Named new CEO from Chewy's former VP Product", type: "green" },
    ],
    starDistribution: { 5: 5200, 4: 3100, 3: 1800, 2: 1200, 1: 1100 },
    reviewTrend: [1100, 1080, 1060, 1040, 1020, 1000, 990, 980, 970, 960, 950, 940],
  },
  {
    id: "brand-7", name: "Haus Labs", logo: "HL", logoUrl: "https://unavatar.io/hauslabs.com", category: "Color Cosmetics", hq: "Los Angeles, USA",
    founded: 2019, employees: 25, website: "hauslabs.com",
    brandColor: "#8B5CF6", bgGradient: "linear-gradient(135deg, #8B5CF6 0%, #6d3fd4 100%)",
    verification: "unverified",
    status: "growth-stalled",
    socialFollowing: { instagram: "1.1M", tiktok: "65K" },
    trafficTrend: [350, 320, 280, 250, 220, 200, 180, 165, 150, 140, 130, 120],
    searchInterest: [55, 50, 45, 40, 36, 32, 28, 25, 22, 20, 18, 16],
    metaAds: [
      { headline: "Triclone Foundation — 51 Shades", body: "Find your perfect match. Clinically tested, all-day wear, inclusive shades.", impressions: "2.1M", status: "paused", daysRunning: 90, format: "Video", color: "#2C2C2C", hook: "Find your perfect match", landingPage: "hauslabs.com/triclone" },
      { headline: "PhD Hybrid Lip Oil — Viral for a Reason", body: "The lip oil TikTok can't stop talking about. Hydrating color in one swipe.", impressions: "1.8M", status: "active", daysRunning: 60, format: "UGC", color: "#3a1f1f", hook: "The lip oil TikTok can't stop talking about", landingPage: "hauslabs.com/phd-lip-oil" },
      { headline: "Clean Beauty. No Compromises.", body: "Vegan, cruelty-free, dermatologist-tested. Performance beauty that cares.", impressions: "1.2M", status: "active", daysRunning: 150, format: "Image", color: "#1a1a1a", hook: "Performance beauty that cares", landingPage: "hauslabs.com/about" },
      { headline: "Eye Armor Collection — Smudge Proof", body: "Liner that stays put from morning to night. 12 shades, zero transfer.", impressions: "890K", status: "active", daysRunning: 45, format: "Carousel", color: "#2C2C2C", hook: "12 shades, zero transfer", landingPage: "hauslabs.com/eye-armor" },
    ],
    advertising: {
      totalAds: 28, activeAds: 12,
      formats: { video: 8, image: 10, carousel: 6, ugc: 4 },
      topHooks: [
        { hook: "Find your perfect match", impressions: "2.1M", ctr: "2.8%" },
        { hook: "The lip oil TikTok can't stop talking about", impressions: "1.8M", ctr: "5.4%" },
        { hook: "Performance beauty that cares", impressions: "1.2M", ctr: "2.2%" },
        { hook: "12 shades, zero transfer", impressions: "890K", ctr: "3.6%" },
      ],
      topLandingPages: [
        { url: "hauslabs.com/triclone", visits: "68K", convRate: "3.2%" },
        { url: "hauslabs.com/phd-lip-oil", visits: "52K", convRate: "4.8%" },
        { url: "hauslabs.com/eye-armor", visits: "34K", convRate: "3.1%" },
        { url: "hauslabs.com/about", visits: "22K", convRate: "1.8%" },
      ],
    },
    trafficSources: { organic: 40, direct: 22, paid: 5, social: 25, referral: 5, email: 3 },
    topCountries: [{ country: "United States", pct: 65 }, { country: "United Kingdom", pct: 12 }, { country: "Canada", pct: 8 }, { country: "Other", pct: 15 }],
    bestSellers: [
      { name: "Triclone Skin Tech Foundation", price: "$45", category: "Foundation" },
      { name: "PhD Hybrid Lip Oil", price: "$24", category: "Lip" },
      { name: "Eye Armor Liner", price: "$22", category: "Eye" },
    ],
    socialVelocity: {
      instagram: { postsPerWeek: 0.5, engagementRate: 0.6, followerTrend: [1200, 1180, 1170, 1160, 1150, 1140, 1135, 1130, 1125, 1120, 1110, 1100] },
      tiktok: { postsPerWeek: 0, engagementRate: 0.2, followerTrend: [72, 70, 69, 68, 68, 67, 67, 66, 66, 65, 65, 65] },
    },
    techStack: ["Shopify"],
    pricing: { skuCount: 22, priceRange: "$18 — $45", avgPrice: 28, hasSubscription: false, subDiscount: null },
    seoHealth: { domainAuthority: 52, organicKeywords: 2100, keywordTrend: [4200, 3800, 3500, 3200, 3000, 2800, 2600, 2500, 2400, 2300, 2200, 2100] },
    hiring: { openRoles: 0, trend: [5, 4, 3, 2, 1, 1, 0, 0, 0, 0, 0, 0] },

    brandStory: "Lady Gaga's beauty brand — launched with massive celebrity hype but failed to build beyond the initial buzz. Sephora partnership ended, product innovation stalled, and Gaga's involvement has been minimal since 2023.",
    whatTheyBuilt: [
      "Lady Gaga brand association worth significant awareness equity",
      "1.1M Instagram followers from Gaga's fanbase",
      "Early products (Triclone foundation) received genuine critical acclaim",
      "Celebrity beauty brand template that could be repurposed",
    ],

    customerVoice: {
      positive: [
        { text: "Triclone foundation is genuinely one of the best I've ever used. Formula is incredible.", source: "Reddit", date: "2025-10" },
        { text: "When Haus Labs is good, it's REALLY good. Just wish they'd launch more.", source: "Product review", date: "2025-09" },
      ],
      negative: [
        { text: "Is this brand even still alive? Haven't seen a new launch in over a year.", source: "TikTok", date: "2026-01" },
        { text: "Half the products are out of stock. Website feels abandoned.", source: "Reddit", date: "2026-02" },
      ],
      trustpilotRating: 3.2, reviewCount: 680,
    },

    gaps: [
      { area: "Supply Chain", description: "Chronic stockouts across key SKUs. Fulfillment delays averaging 14+ days.", severity: "critical", competitor: "Fenty Beauty maintains 99%+ in-stock rate on hero products" },
      { area: "Leadership", description: "No permanent CEO. Team reduced from 80+ to ~25. No beauty industry experience in interim leadership.", severity: "critical", competitor: "Rare Beauty has experienced leadership team with clear vision" },
      { area: "Product Pipeline", description: "No new product launches in 14 months. Innovation pipeline appears empty.", severity: "high", competitor: "Rhode launches every quarter with viral sellouts" },
    ],

    whiteSpace: [
      { opportunity: "Renegotiate Gaga licensing", description: "Brand has value through celebrity association. Restructure ambassador deal at reduced commitment.", timeframe: "3-6 months", impact: "High" },
      { opportunity: "Relaunch as clean color cosmetics", description: "Pivot from 'celebrity brand' to 'performance-first clean color.' Focus on hero products.", timeframe: "9-12 months", impact: "High" },
    ],

    competitors: [
      { name: "Fenty Beauty", metric: "Category leader", strength: "Rihanna, inclusivity, Sephora partnership" },
      { name: "Rare Beauty", metric: "Mission-driven", strength: "Selena Gomez, mental health mission" },
      { name: "Rhode", metric: "Gen Z darling", strength: "Hailey Bieber, minimalist, viral drops" },
    ],

    summary: "Celebrity brand at fire-sale potential. Gaga association provides brand recognition that would cost $50M+ to build from scratch. Operational rebuild required but addressable. Key question: can you secure Gaga licensing at reasonable terms?",

    lastActivity: "2026-01-08",
    redFlags: ["No permanent CEO", "Team reduced 70%", "No product launch in 14 months", "Chronic stockouts", "Sephora partnership ended", "No social posts in 6+ weeks"],
    greenFlags: ["Lady Gaga brand association", "1.1M Instagram followers", "Triclone foundation critically acclaimed"],
    signalTimeline: [
      { date: "2026-02", text: "Website audit: 34% of SKUs showing out of stock", type: "red" },
      { date: "2026-01", text: "Last social media post across all platforms", type: "red" },
      { date: "2025-10", text: "CMO departed — no replacement announced", type: "red" },
      { date: "2025-06", text: "Sephora partnership officially ended", type: "red" },
    ],
    starDistribution: { 5: 180, 4: 140, 3: 110, 2: 120, 1: 130 },
    reviewTrend: [80, 75, 70, 65, 55, 50, 45, 40, 38, 35, 32, 30],
  },
  {
    id: "brand-8", name: "Oatly", logo: "OT", logoUrl: "https://unavatar.io/oatly.com", category: "Plant-Based Dairy", hq: "Malmo, Sweden",
    founded: 1994, employees: 1200, website: "oatly.com",
    brandColor: "#1B365D", bgGradient: "linear-gradient(135deg, #1B365D 0%, #0f2240 100%)",
    verification: "unverified",
    status: "open-to-consulting",
    socialFollowing: { instagram: "540K", tiktok: "125K" },
    trafficTrend: [4500, 4400, 4300, 4200, 4100, 4050, 4000, 3950, 3900, 3850, 3800, 3750],
    searchInterest: [80, 78, 76, 74, 72, 70, 68, 66, 65, 64, 63, 62],
    metaAds: [
      { headline: "It's Like Milk But Made for Humans", body: "Oat milk for your coffee, cereal, and everything else. No cows involved.", impressions: "22.1M", status: "active", daysRunning: 400, format: "Video", color: "#1B365D", hook: "No cows involved", landingPage: "oatly.com/products" },
      { headline: "Oatly Barista Edition — Foam Perfected", body: "The oat milk baristas swear by. Full foam, rich texture, incredible taste.", impressions: "14.8M", status: "active", daysRunning: 350, format: "Video", color: "#2A4A7F", hook: "The oat milk baristas swear by", landingPage: "oatly.com/barista" },
      { headline: "Post-Post-Milk Generation", body: "We're not even trying to be milk anymore. We're just oats and water doing our thing.", impressions: "9.4M", status: "active", daysRunning: 200, format: "Image", color: "#1B365D", hook: "We're just oats and water doing our thing", landingPage: "oatly.com/about" },
      { headline: "Ditch Dairy. It's Easier Than You Think.", body: "Swap one thing this week. Start with your morning coffee. Your planet says thanks.", impressions: "7.2M", status: "active", daysRunning: 140, format: "Carousel", color: "#2A4A7F", hook: "Your planet says thanks", landingPage: "oatly.com/sustainability" },
    ],
    advertising: {
      totalAds: 64, activeAds: 28,
      formats: { video: 24, image: 18, carousel: 14, ugc: 8 },
      topHooks: [
        { hook: "No cows involved", impressions: "22.1M", ctr: "4.2%" },
        { hook: "The oat milk baristas swear by", impressions: "14.8M", ctr: "3.8%" },
        { hook: "We're just oats and water doing our thing", impressions: "9.4M", ctr: "3.1%" },
        { hook: "Your planet says thanks", impressions: "7.2M", ctr: "4.6%" },
      ],
      topLandingPages: [
        { url: "oatly.com/products", visits: "640K", convRate: "3.4%" },
        { url: "oatly.com/barista", visits: "420K", convRate: "5.8%" },
        { url: "oatly.com/sustainability", visits: "180K", convRate: "2.2%" },
        { url: "oatly.com/about", visits: "120K", convRate: "1.4%" },
      ],
    },
    trafficSources: { organic: 45, direct: 30, paid: 10, social: 8, referral: 4, email: 3 },
    topCountries: [{ country: "United States", pct: 35 }, { country: "United Kingdom", pct: 18 }, { country: "Sweden", pct: 15 }, { country: "Germany", pct: 12 }, { country: "China", pct: 8 }, { country: "Other", pct: 12 }],
    bestSellers: [
      { name: "Oat Drink Barista Edition", price: "$5.49", category: "Oat Milk" },
      { name: "Oat Drink Original", price: "$4.99", category: "Oat Milk" },
      { name: "Oatgurt Strawberry", price: "$6.49", category: "Yogurt" },
    ],
    socialVelocity: {
      instagram: { postsPerWeek: 4, engagementRate: 1.6, followerTrend: [520, 522, 525, 528, 530, 532, 534, 535, 536, 537, 538, 540] },
      tiktok: { postsPerWeek: 3, engagementRate: 3.2, followerTrend: [80, 85, 90, 95, 100, 104, 108, 112, 116, 120, 122, 125] },
    },
    techStack: ["Custom Platform", "Salesforce", "Contentful", "Algolia"],
    pricing: { skuCount: 28, priceRange: "$3.99 — $8.99", avgPrice: 5.50, hasSubscription: false, subDiscount: null },
    seoHealth: { domainAuthority: 74, organicKeywords: 18500, keywordTrend: [19000, 18900, 18800, 18700, 18650, 18600, 18580, 18560, 18540, 18520, 18510, 18500] },
    hiring: { openRoles: 32, trend: [40, 38, 36, 35, 34, 33, 33, 32, 32, 32, 32, 32] },

    brandStory: "Category-defining oat milk brand from Sweden. Built one of the most recognizable brands in consumer goods — 'The Oatly of X' is a common expression. Went public but stock dropped 92% from IPO highs. Brand itself is strong; capital structure is the problem.",
    whatTheyBuilt: [
      "Category-defining brand — arguably created the oat milk category",
      "Distinctive brand voice and design language recognized globally",
      "Strong foodservice presence in specialty coffee shops worldwide",
      "Sustainability positioning with genuine credibility",
    ],

    customerVoice: {
      positive: [
        { text: "Oatly Barista is the only plant milk that foams properly. Every coffee shop knows it.", source: "Reddit", date: "2026-02" },
        { text: "The brand personality is genius. The packaging alone makes me choose it over competitors.", source: "Instagram", date: "2026-01" },
      ],
      negative: [
        { text: "Private label oat milk is half the price and honestly tastes the same.", source: "Reddit", date: "2026-01" },
        { text: "The Blackstone investment killed my trust in their sustainability claims.", source: "Reddit", date: "2025-08" },
      ],
      trustpilotRating: 3.5, reviewCount: 1800,
    },

    gaps: [
      { area: "Profitability", description: "Never achieved sustained profitability at scale. Gross margins improving but still below industry average.", severity: "high", competitor: "Private-label oat milk profitable at 50% lower price point" },
      { area: "Private Label Pressure", description: "Every major retailer now offers own-brand oat milk at 50% lower price.", severity: "high", competitor: "Planet Oat and Chobani Oat gaining share on price" },
      { area: "Public Market Structure", description: "Stock down 92% from IPO. Public company costs and pressures misaligned with brand-building needs.", severity: "high", competitor: "Private competitors can invest without quarterly earnings pressure" },
    ],

    whiteSpace: [
      { opportunity: "Take private", description: "Remove public market pressure. Cut unprofitable markets, focus on core US/EU/UK.", timeframe: "6-9 months", impact: "High" },
      { opportunity: "Foodservice expansion", description: "Double down on coffee shop/restaurant channel where brand commands premium and private label can't compete.", timeframe: "12 months", impact: "High" },
      { opportunity: "Product innovation", description: "Oat-based yogurt, ice cream, and cheese. Extend the Oatly brand into adjacent categories.", timeframe: "12-18 months", impact: "Medium" },
    ],

    competitors: [
      { name: "Planet Oat (HP Hood)", metric: "Price leader", strength: "Lower price, mass distribution" },
      { name: "Chobani Oat", metric: "Brand extension", strength: "Yogurt crossover, retail relationships" },
      { name: "Private Label", metric: "25% market share", strength: "Price, shelf space, retailer incentives" },
    ],

    summary: "Category-defining brand trading at distressed public valuation. The brand itself is one of the most recognizable in consumer goods. Needs to be taken private, right-sized, and focused on profitable channels. Not a broken brand — a broken capital structure.",

    lastActivity: "2026-03-22",
    redFlags: ["Stock down 92% from IPO", "Never achieved sustained profitability", "Private label oat milk eroding share", "Environmental activist backlash"],
    greenFlags: ["Category-defining brand — globally recognized", "Strong foodservice presence in specialty coffee", "Distinctive brand voice and design", "Sustainability credibility", "Active hiring (30+ roles)", "Regular product innovation"],
    signalTimeline: [
      { date: "2026-03", text: "Launched oat-based cream cheese — category expansion continues", type: "green" },
      { date: "2026-02", text: "US factory reached 85% utilization — overcapacity concerns easing", type: "green" },
      { date: "2026-01", text: "Stock hit all-time low — market cap below annual revenue", type: "red" },
      { date: "2025-10", text: "Walmart launched private-label oat milk at 50% lower price", type: "red" },
      { date: "2025-08", text: "Named new CFO from Beyond Meat", type: "amber" },
    ],
    starDistribution: { 5: 420, 4: 380, 3: 340, 2: 320, 1: 340 },
    reviewTrend: [140, 145, 150, 155, 158, 160, 162, 163, 164, 165, 165, 166],
  },
  {
    id: "brand-9", name: "FabFitFun", logo: "FF", logoUrl: "https://unavatar.io/fabfitfun.com", category: "Subscription Box", hq: "Los Angeles, USA",
    founded: 2010, employees: 180, website: "fabfitfun.com",
    brandColor: "#E91E8C", bgGradient: "linear-gradient(135deg, #E91E8C 0%, #c4186f 100%)",
    verification: "claimed",
    listedBy: "CEO", listedDate: "2026-02-28",
    status: "looking-to-sell",
    socialFollowing: { instagram: "2.1M", tiktok: "280K" },
    trafficTrend: [2800, 2600, 2400, 2200, 2050, 1900, 1800, 1700, 1600, 1550, 1500, 1450],
    searchInterest: [70, 65, 60, 55, 50, 46, 42, 40, 38, 36, 34, 32],
    metaAds: [
      { headline: "FabFitFun Spring Box — $200+ Value for $49.99", body: "Full-size beauty, wellness, and lifestyle products. Curated just for you.", impressions: "14.2M", status: "active", daysRunning: 320, format: "Video", color: "#E91E63", hook: "Curated just for you", landingPage: "fabfitfun.com/spring" },
      { headline: "Customize Your Box — Choose What You Love", body: "Pick exactly what goes in your box. No surprises, all favourites.", impressions: "8.6M", status: "active", daysRunning: 250, format: "UGC", color: "#C2185B", hook: "No surprises, all favourites", landingPage: "fabfitfun.com/customize" },
      { headline: "Annual Members Get First Pick", body: "Join annual and get 4 boxes per year, early access to sales, and full customization.", impressions: "5.1M", status: "active", daysRunning: 180, format: "Carousel", color: "#AD1457", hook: "Early access to sales, and full customization", landingPage: "fabfitfun.com/annual" },
      { headline: "Unboxing the $200 FabFitFun Box", body: "Watch me unbox everything inside. Is it really worth it? Spoiler: absolutely.", impressions: "3.8M", status: "active", daysRunning: 90, format: "UGC", color: "#E91E63", hook: "Is it really worth it? Spoiler: absolutely.", landingPage: "fabfitfun.com/starter" },
    ],
    advertising: {
      totalAds: 96, activeAds: 42,
      formats: { video: 22, image: 18, carousel: 20, ugc: 36 },
      topHooks: [
        { hook: "Curated just for you", impressions: "14.2M", ctr: "4.1%" },
        { hook: "No surprises, all favourites", impressions: "8.6M", ctr: "5.4%" },
        { hook: "Early access to sales, and full customization", impressions: "5.1M", ctr: "3.8%" },
        { hook: "Is it really worth it? Spoiler: absolutely.", impressions: "3.8M", ctr: "6.2%" },
      ],
      topLandingPages: [
        { url: "fabfitfun.com/spring", visits: "520K", convRate: "6.8%" },
        { url: "fabfitfun.com/customize", visits: "380K", convRate: "5.2%" },
        { url: "fabfitfun.com/annual", visits: "210K", convRate: "4.6%" },
        { url: "fabfitfun.com/starter", visits: "160K", convRate: "7.1%" },
      ],
    },
    trafficSources: { organic: 22, direct: 18, paid: 35, social: 15, referral: 6, email: 4 },
    topCountries: [{ country: "United States", pct: 82 }, { country: "Canada", pct: 10 }, { country: "United Kingdom", pct: 4 }, { country: "Other", pct: 4 }],
    bestSellers: [
      { name: "Annual Subscription Box", price: "$179.99/yr", category: "Subscription" },
      { name: "Seasonal Box", price: "$49.99/qtr", category: "Subscription" },
      { name: "Add-On Market Items", price: "$5-$30", category: "Add-ons" },
    ],
    socialVelocity: {
      instagram: { postsPerWeek: 6, engagementRate: 1.4, followerTrend: [2200, 2180, 2170, 2160, 2150, 2140, 2130, 2125, 2120, 2115, 2110, 2100] },
      tiktok: { postsPerWeek: 4, engagementRate: 2.8, followerTrend: [200, 210, 220, 230, 240, 248, 255, 260, 265, 270, 275, 280] },
    },
    techStack: ["Custom Platform", "Braze", "Looker", "Segment"],
    pricing: { skuCount: 120, priceRange: "$5 — $180", avgPrice: 42, hasSubscription: true, subDiscount: "25%" },
    seoHealth: { domainAuthority: 62, organicKeywords: 5600, keywordTrend: [8000, 7600, 7200, 6800, 6500, 6300, 6100, 6000, 5900, 5800, 5700, 5600] },
    hiring: { openRoles: 4, trend: [22, 18, 14, 10, 8, 6, 5, 4, 4, 4, 4, 4] },

    brandStory: "Seasonal subscription box for women featuring full-size beauty, fitness, and lifestyle products. Built 2M+ subscriber peak with strong community. Now at ~800K subscribers after category fatigue and rising CAC.",
    whatTheyBuilt: [
      "800K active subscriber base — predominantly women 25-45",
      "2.1M Instagram following with high engagement",
      "Brand relationships with 500+ consumer brands for curation",
      "Proven commerce audience with known purchase behavior",
    ],

    customerVoice: {
      positive: [
        { text: "FFF is the only subscription I've kept for 4 years. The annual box is always worth it.", source: "Reddit", date: "2026-01" },
        { text: "The customization options make it feel personal. I actually use everything now.", source: "Trustpilot", date: "2025-12" },
      ],
      negative: [
        { text: "Quality has declined. Getting more filler products and brands I've never heard of.", source: "Reddit", date: "2026-02" },
        { text: "The price increase wasn't justified. Same value, higher cost.", source: "Trustpilot", date: "2026-01" },
      ],
      trustpilotRating: 3.4, reviewCount: 5600,
    },

    gaps: [
      { area: "Customer Acquisition", description: "CAC has tripled as influencer marketing effectiveness declined. Getting harder and more expensive to acquire subscribers.", severity: "critical", competitor: "Ipsy/BoxyCharm scaled via data-driven personalization and sampling" },
      { area: "Curation Quality", description: "Product quality perception declining — subscribers report 'filler' items. Brand partnerships may be weakening.", severity: "high", competitor: "Premium boxes like Allure maintain editorial curation standards" },
      { area: "Subscriber Erosion", description: "From 2M peak to ~800K. Churn accelerating as category fatigue sets in.", severity: "high", competitor: "Category-wide problem but FFF hit hardest due to premium pricing" },
    ],

    whiteSpace: [
      { opportunity: "Pivot to commerce marketplace", description: "Leverage 800K subscribers as a commerce audience. Move from box curation to shoppable discovery.", timeframe: "12 months", impact: "High" },
      { opportunity: "Simplify tiers + raise price", description: "Reduce from 4 customization options to 2 tiers: Essential and Luxe. Improve margin per box.", timeframe: "1 quarter", impact: "High" },
      { opportunity: "Data monetization", description: "Purchase behavior data from 800K women is extremely valuable for brand partnerships.", timeframe: "3-6 months", impact: "Medium" },
    ],

    competitors: [
      { name: "Ipsy/BoxyCharm", metric: "Data-driven", strength: "Personalization, beauty focus, scale" },
      { name: "Allure Beauty Box", metric: "Editorial curation", strength: "Magazine brand, trusted recommendations" },
    ],

    summary: "Subscriber base of 800K women is the real asset — not the box model. The audience is valuable; the delivery mechanism needs evolution. Pivot from subscription box to commerce/discovery platform.",

    lastActivity: "2026-03-19",
    redFlags: ["Subscriber count declined 60% from peak", "CAC tripled", "Two rounds of layoffs (40%)", "Product curation quality declining"],
    greenFlags: ["800K active subscribers — known purchase behavior", "2.1M Instagram + 280K TikTok", "Relationships with 500+ consumer brands", "Annual subscriber renewal rate 45%"],
    signalTimeline: [
      { date: "2026-02", text: "CEO publicly stated 'exploring strategic alternatives'", type: "green" },
      { date: "2026-01", text: "Subscription price increased 15% — subscriber backlash", type: "red" },
      { date: "2025-11", text: "Second round of layoffs — 80 positions eliminated", type: "red" },
      { date: "2025-09", text: "Launched FFF marketplace — testing commerce pivot", type: "green" },
      { date: "2025-07", text: "Annual subscriber count crossed below 800K", type: "amber" },
    ],
    starDistribution: { 5: 1200, 4: 980, 3: 840, 2: 1100, 1: 1480 },
    reviewTrend: [520, 500, 480, 460, 440, 420, 400, 390, 380, 370, 360, 350],
  },
  {
    id: "brand-10", name: "HiSmile", logo: "HS", logoUrl: "https://unavatar.io/hismileteeth.com", category: "Oral Care", hq: "Gold Coast, Australia",
    founded: 2014, employees: 55, website: "hismile.com",
    brandColor: "#00C2CB", bgGradient: "linear-gradient(135deg, #00C2CB 0%, #009da5 100%)",
    verification: "verified",
    listedBy: "Founder", listedDate: "2026-03-10", verifiedRevenue: "$45M ARR",
    status: "growing",
    socialFollowing: { instagram: "3.2M", tiktok: "1.8M" },
    trafficTrend: [800, 820, 850, 880, 900, 920, 940, 950, 960, 970, 980, 990],
    searchInterest: [50, 52, 54, 56, 58, 60, 61, 62, 63, 64, 65, 66],
    metaAds: [
      { headline: "Whiter Teeth in 10 Minutes — See Real Results", body: "Peroxide-free whitening that works. 1M+ kits sold. Before & after pics don't lie.", impressions: "28.4M", status: "active", daysRunning: 400, format: "UGC", color: "#6C63FF", hook: "Before & after pics don't lie", landingPage: "hismileteeth.com/whitening-kit" },
      { headline: "The Toothpaste Your Dentist Wishes They Made", body: "Clinically proven ingredients. Purple formula cancels yellow tones instantly.", impressions: "16.2M", status: "active", daysRunning: 280, format: "Video", color: "#5A52D5", hook: "Purple formula cancels yellow tones instantly", landingPage: "hismileteeth.com/toothpaste" },
      { headline: "PAP+ Whitening Kit — As Seen on TikTok", body: "The kit that broke TikTok. 50M+ views. Zero sensitivity. Maximum results.", impressions: "11.8M", status: "active", daysRunning: 200, format: "Carousel", color: "#4A42C0", hook: "50M+ views. Zero sensitivity. Maximum results.", landingPage: "hismileteeth.com/pap-plus" },
      { headline: "I Tried HiSmile for 30 Days", body: "Real people. Real results. No filters, no editing. See the transformation.", impressions: "8.2M", status: "active", daysRunning: 150, format: "UGC", color: "#6C63FF", hook: "Real people. Real results. No filters, no editing.", landingPage: "hismileteeth.com/results" },
    ],
    advertising: {
      totalAds: 156, activeAds: 68,
      formats: { video: 38, image: 24, carousel: 32, ugc: 62 },
      topHooks: [
        { hook: "Before & after pics don't lie", impressions: "28.4M", ctr: "5.8%" },
        { hook: "Purple formula cancels yellow tones instantly", impressions: "16.2M", ctr: "4.6%" },
        { hook: "50M+ views. Zero sensitivity. Maximum results.", impressions: "11.8M", ctr: "5.2%" },
        { hook: "Real people. Real results. No filters, no editing.", impressions: "8.2M", ctr: "6.4%" },
      ],
      topLandingPages: [
        { url: "hismileteeth.com/whitening-kit", visits: "1.2M", convRate: "8.4%" },
        { url: "hismileteeth.com/toothpaste", visits: "680K", convRate: "6.2%" },
        { url: "hismileteeth.com/pap-plus", visits: "420K", convRate: "7.8%" },
        { url: "hismileteeth.com/results", visits: "310K", convRate: "5.1%" },
      ],
    },
    trafficSources: { organic: 25, direct: 20, paid: 30, social: 18, referral: 4, email: 3 },
    topCountries: [{ country: "Australia", pct: 30 }, { country: "United States", pct: 28 }, { country: "United Kingdom", pct: 18 }, { country: "Germany", pct: 8 }, { country: "Canada", pct: 6 }, { country: "Other", pct: 10 }],
    bestSellers: [
      { name: "PAP+ Whitening Kit", price: "$59.99", category: "Whitening" },
      { name: "Colour Corrector Toothpaste", price: "$12.99", category: "Toothpaste" },
      { name: "Whitening Strips (14 day)", price: "$29.99", category: "Whitening" },
    ],
    socialVelocity: {
      instagram: { postsPerWeek: 8, engagementRate: 2.8, followerTrend: [2800, 2850, 2900, 2950, 3000, 3050, 3080, 3100, 3120, 3150, 3180, 3200] },
      tiktok: { postsPerWeek: 6, engagementRate: 4.2, followerTrend: [1200, 1280, 1350, 1400, 1450, 1500, 1560, 1620, 1680, 1720, 1760, 1800] },
    },
    techStack: ["Shopify Plus", "Klaviyo", "Gorgias", "Triple Whale", "Recharge"],
    pricing: { skuCount: 16, priceRange: "$9.99 — $79.99", avgPrice: 32, hasSubscription: true, subDiscount: "20%" },
    seoHealth: { domainAuthority: 55, organicKeywords: 3800, keywordTrend: [2800, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3550, 3600, 3700, 3800] },
    hiring: { openRoles: 8, trend: [4, 4, 5, 5, 6, 6, 7, 7, 7, 8, 8, 8] },

    brandStory: "Australian teeth whitening brand built on influencer marketing with 3.2M Instagram and 1.8M TikTok followers. Profitable with 65% margins but growth plateauing and regulatory scrutiny increasing. Founders looking for a partner to scale beyond single-product dependency.",
    whatTheyBuilt: [
      "Profitable $45M business with 65% gross margins",
      "Massive social following: 3.2M Instagram + 1.8M TikTok",
      "Successfully built DTC brand in oral care — traditionally retail-dominated",
      "Global distribution across US, UK, EU, Australia",
    ],

    customerVoice: {
      positive: [
        { text: "Actually works! Teeth were noticeably whiter after 2 weeks.", source: "TikTok", date: "2026-02" },
        { text: "Love the flavored toothpaste line. Makes brushing teeth actually enjoyable.", source: "Amazon", date: "2026-01" },
      ],
      negative: [
        { text: "Results didn't last. After 3 months back to normal.", source: "Reddit", date: "2025-12" },
        { text: "Is this even safe? Seen articles about whitening product regulations.", source: "Reddit", date: "2026-01" },
      ],
      trustpilotRating: 4.0, reviewCount: 3200,
    },

    gaps: [
      { area: "Regulatory", description: "Multiple markets tightening rules on cosmetic teeth whitening claims. EU and Australia scrutiny increasing.", severity: "high", competitor: "Colgate has clinical backing and regulatory compliance infrastructure" },
      { area: "Product Dependency", description: "Over-reliance on single hero product (whitening kit). Repeat rate only ~18%.", severity: "medium", competitor: "Colgate/Crest have full product ecosystems driving daily use" },
      { area: "Influencer ROI Declining", description: "Influencer marketing CPM up 60% with lower conversion. Channel becoming less efficient.", severity: "medium", competitor: "Brands pivoting to community-driven and UGC models" },
    ],

    whiteSpace: [
      { opportunity: "Full oral care line", description: "Toothpaste, mouthwash, electric toothbrush. Leverage existing audience for category expansion.", timeframe: "12 months", impact: "High" },
      { opportunity: "Clinical validation", description: "University-backed clinical studies to address regulatory concerns and differentiate.", timeframe: "6-9 months", impact: "High" },
      { opportunity: "Subscription model", description: "Recurring revenue from toothpaste/mouthwash refills. Fix the 18% repeat rate.", timeframe: "3-6 months", impact: "Medium" },
    ],

    competitors: [
      { name: "Colgate (Optic White)", metric: "Clinical backing", strength: "Distribution, trust, regulatory compliance" },
      { name: "Crest Whitestrips", metric: "Proven efficacy", strength: "Mass distribution, decades of clinical data" },
      { name: "Snow Teeth Whitening", metric: "DTC competitor", strength: "Similar positioning, US-focused" },
    ],

    summary: "Profitable brand with strong margins and massive social following. Not distressed — founders seeking a partner to help scale beyond whitening into full oral care. Regulatory navigation is key challenge.",

    lastActivity: "2026-03-22",
    redFlags: ["Regulatory scrutiny increasing in EU + Australia", "Single product dependency — whitening kit", "Repeat purchase rate only 18%", "Influencer CPM up 60%"],
    greenFlags: ["Profitable with 65% margins", "3.2M Instagram + 1.8M TikTok — massive reach", "Global distribution across 4 continents", "Founder-led and actively growing", "Active paid media spend", "Recent product expansion (toothpaste, mouthwash)"],
    signalTimeline: [
      { date: "2026-03", text: "Listed on VentureBrowse — founders seeking growth partner", type: "green" },
      { date: "2026-02", text: "Launched flavored toothpaste line — first non-whitening product", type: "green" },
      { date: "2026-01", text: "ASA upheld complaint about whitening efficacy claims", type: "red" },
      { date: "2025-11", text: "TikTok following crossed 1.8M milestone", type: "green" },
      { date: "2025-09", text: "EU regulatory review opened on cosmetic whitening products", type: "amber" },
    ],
    starDistribution: { 5: 1400, 4: 800, 3: 420, 2: 280, 1: 300 },
    reviewTrend: [240, 250, 260, 270, 275, 280, 285, 290, 295, 300, 305, 310],
  },
];
