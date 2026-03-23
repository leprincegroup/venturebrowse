// Navigation
export const PILLARS = ["Find Ideas", "Browse Brands", "Market Intel"];
export const INTEL_TABS = ["Keyword Trends", "Community Signals", "Market News"];
export const TIME_RANGES = [
  { k: "7d", l: "7 days" },
  { k: "30d", l: "30 days" },
  { k: "90d", l: "90 days" },
  { k: "6m", l: "6 months" },
  { k: "all", l: "All time" },
];

// Filters
export const IDEA_CATEGORIES_FILTER = [
  "All", "Gut Health Supplements", "Mushroom Coffee", "Peptide Skincare",
  "Adaptogenic Beverages", "At-Home Diagnostics", "Postpartum Recovery",
  "Pet Wellness", "Functional Gummies", "Waterless Beauty",
  "Sleep Optimization", "Clean Protein", "Sustainable Packaging",
];
export const IDEA_TYPE_FILTER = ["All", "Build", "Acquire", "Roll-up"];
export const IDEA_SOURCES = ["All", "Reddit", "TikTok", "Amazon", "Google", "Instagram"];

// Brand filters
export const BRAND_STATUS_FILTERS = ["All", "Looking to Sell", "Growth Stalled", "Open to Consulting", "Growing"];
export const BRAND_CLAIM_FILTERS = ["All", "Claimed", "Unclaimed"];
export const BRAND_CATEGORY_FILTERS = [
  "All", "Wellness Supplements", "Beauty & Skincare", "Meal Replacement",
  "CPG / Essentials", "Personal Care", "Pet Products", "Color Cosmetics",
  "Plant-Based Dairy", "Subscription Box", "Oral Care",
];

// Sorts
export const IDEA_SORTS = [
  { k: "validation", l: "Validation Score" },
  { k: "growth", l: "Growth Rate" },
  { k: "market", l: "Market Size" },
  { k: "recent", l: "Newest" },
];
export const SIGNAL_SORTS = [
  { k: "growth", l: "Growth Rate" },
  { k: "severity", l: "Severity" },
  { k: "mentions", l: "Mentions" },
  { k: "name", l: "A → Z" },
];
export const BRAND_SORTS = [
  { k: "name", l: "A → Z" },
  { k: "red", l: "Red Flags" },
  { k: "green", l: "Green Flags" },
  { k: "gaps", l: "Most Gaps" },
  { k: "traffic", l: "Web Traffic" },
  { k: "recent", l: "Recently Active" },
];

// Radar
export const RADAR_EXAMPLES = [
  "I want to acquire beauty brands under $5M ARR",
  "Show me ideas to build in health & wellness",
  "Find trending pet wellness opportunities",
  "I'm looking for distressed consumer brands to roll up",
];

export const RADAR_KEYWORD_MAP = {
  beauty: ["cat-3", "cat-9"], skincare: ["cat-3"], cosmetics: ["cat-3"],
  supplements: ["cat-1", "cat-8"], health: ["cat-1", "cat-5", "cat-10"],
  wellness: ["cat-1", "cat-4", "cat-10"], gut: ["cat-1"], probiotics: ["cat-1"],
  coffee: ["cat-2"], mushroom: ["cat-2"], adaptogen: ["cat-4"],
  beverage: ["cat-4"], drink: ["cat-4"], alcohol: ["cat-4"],
  diagnostics: ["cat-5"], testing: ["cat-5"],
  postpartum: ["cat-6"], maternal: ["cat-6"],
  pet: ["cat-7"], dog: ["cat-7"], cat: ["cat-7"],
  gummies: ["cat-8"], gummy: ["cat-8"],
  waterless: ["cat-9"], sustainable: ["cat-12"], packaging: ["cat-12"],
  sleep: ["cat-10"], protein: ["cat-11"], food: ["cat-11"],
};

export const RADAR_BRAND_MAP = {
  beauty: ["Beauty & Skincare", "Color Cosmetics"],
  skincare: ["Beauty & Skincare"], cosmetics: ["Color Cosmetics"],
  supplements: ["Wellness Supplements"], wellness: ["Wellness Supplements"],
  pet: ["Pet Products"], dog: ["Pet Products"],
  food: ["Meal Replacement", "Plant-Based Dairy", "CPG / Essentials"],
  oral: ["Oral Care"], teeth: ["Oral Care"],
  subscription: ["Subscription Box"],
  care: ["Personal Care"],
};

export const RADAR_INTENT = {
  acquire: ["acquire", "buy", "acquisition", "purchase", "distressed", "acquiring"],
  build: ["build", "launch", "create", "start", "found", "building"],
  "roll-up": ["roll-up", "rollup", "consolidate", "roll up", "aggregate"],
};
