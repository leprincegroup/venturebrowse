-- 005_data_collection_schema.sql
-- VentureBrowse Phase 3: Data collection tables for brand intelligence
-- Pattern: Scheduled Edge Functions collect data → store in Postgres → frontend reads from DB only

-- ============================================================
-- TRAFFIC SNAPSHOTS
-- Weekly traffic data per company domain
-- Sources: Tranco rank (free), SimilarWeb HTML scrape (free)
-- ============================================================
CREATE TABLE traffic_snapshots (
  id          SERIAL PRIMARY KEY,
  company_id  INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  domain      TEXT NOT NULL,
  tranco_rank INT,
  visits_est  BIGINT,
  bounce_rate NUMERIC(5,2),
  pages_per_visit NUMERIC(5,2),
  avg_visit_duration_sec INT,
  traffic_sources JSONB DEFAULT '{}',
  top_countries JSONB DEFAULT '[]',
  source      TEXT NOT NULL DEFAULT 'tranco',
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, source, snapshot_date)
);

CREATE INDEX idx_traffic_company_date ON traffic_snapshots(company_id, snapshot_date DESC);
CREATE INDEX idx_traffic_tranco ON traffic_snapshots(tranco_rank ASC NULLS LAST) WHERE tranco_rank IS NOT NULL;

ALTER TABLE traffic_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Traffic snapshots are viewable by everyone" ON traffic_snapshots FOR SELECT USING (true);

-- ============================================================
-- SOCIAL MEDIA SNAPSHOTS
-- Daily follower/engagement snapshots per platform
-- Sources: RapidAPI Instagram + TikTok scrapers (~$30/mo)
-- ============================================================
CREATE TABLE social_snapshots (
  id              SERIAL PRIMARY KEY,
  company_id      INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  platform        TEXT NOT NULL CHECK (platform IN ('instagram','tiktok','twitter','youtube','linkedin')),
  handle          TEXT NOT NULL,
  followers       BIGINT,
  following       BIGINT,
  posts_count     INT,
  avg_likes       NUMERIC(12,1),
  avg_comments    NUMERIC(12,1),
  avg_views       BIGINT,
  engagement_rate NUMERIC(6,4),
  follower_growth_7d  NUMERIC(8,2),
  follower_growth_pct NUMERIC(6,3),
  raw_data        JSONB DEFAULT '{}',
  snapshot_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, platform, snapshot_date)
);

CREATE INDEX idx_social_company_platform ON social_snapshots(company_id, platform, snapshot_date DESC);
CREATE INDEX idx_social_engagement ON social_snapshots(engagement_rate DESC NULLS LAST);

ALTER TABLE social_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Social snapshots are viewable by everyone" ON social_snapshots FOR SELECT USING (true);

-- ============================================================
-- SEARCH TRENDS
-- Weekly Google Trends interest + keyword volumes
-- Sources: Google Trends HTTP (free), DataForSEO (optional, ~$50/mo)
-- ============================================================
CREATE TABLE search_trends (
  id             SERIAL PRIMARY KEY,
  company_id     INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  keyword        TEXT NOT NULL,
  interest_score INT CHECK (interest_score BETWEEN 0 AND 100),
  interest_delta INT,
  search_volume  INT,
  related_rising JSONB DEFAULT '[]',
  related_top    JSONB DEFAULT '[]',
  geo            TEXT DEFAULT 'US',
  source         TEXT NOT NULL DEFAULT 'google_trends',
  period_start   DATE NOT NULL,
  period_end     DATE NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, keyword, geo, period_start, source)
);

CREATE INDEX idx_trends_company ON search_trends(company_id, period_start DESC);
CREATE INDEX idx_trends_interest ON search_trends(interest_score DESC NULLS LAST);

ALTER TABLE search_trends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Search trends are viewable by everyone" ON search_trends FOR SELECT USING (true);

-- ============================================================
-- AD INTELLIGENCE
-- Weekly snapshot of active ads per brand
-- Sources: Meta Ad Library API (free, official)
-- ============================================================
CREATE TABLE ad_snapshots (
  id              SERIAL PRIMARY KEY,
  company_id      INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  platform        TEXT NOT NULL CHECK (platform IN ('meta','tiktok','google')),
  page_id         TEXT,
  active_ad_count INT DEFAULT 0,
  ad_formats      JSONB DEFAULT '{}',
  spend_lower     NUMERIC(12,2),
  spend_upper     NUMERIC(12,2),
  top_creatives   JSONB DEFAULT '[]',
  snapshot_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, platform, snapshot_date)
);

CREATE INDEX idx_ads_company_date ON ad_snapshots(company_id, snapshot_date DESC);
CREATE INDEX idx_ads_active_count ON ad_snapshots(active_ad_count DESC);

ALTER TABLE ad_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ad snapshots are viewable by everyone" ON ad_snapshots FOR SELECT USING (true);

-- Individual ad creatives (deduplicated by ad_id)
CREATE TABLE ad_creatives (
  id            SERIAL PRIMARY KEY,
  company_id    INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  platform      TEXT NOT NULL CHECK (platform IN ('meta','tiktok','google')),
  ad_id         TEXT NOT NULL,
  page_name     TEXT,
  body_text     TEXT,
  link_url      TEXT,
  image_url     TEXT,
  video_url     TEXT,
  cta           TEXT,
  ad_start_date DATE,
  ad_end_date   DATE,
  is_active     BOOLEAN DEFAULT true,
  first_seen_at TIMESTAMPTZ DEFAULT now(),
  last_seen_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(platform, ad_id)
);

CREATE INDEX idx_creatives_company ON ad_creatives(company_id, platform);
CREATE INDEX idx_creatives_active ON ad_creatives(is_active, last_seen_at DESC);

ALTER TABLE ad_creatives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ad creatives are viewable by everyone" ON ad_creatives FOR SELECT USING (true);

-- ============================================================
-- REVIEW SNAPSHOTS
-- Weekly ratings/review counts
-- Sources: Trustpilot HTML JSON-LD (free), Rainforest free tier
-- ============================================================
CREATE TABLE review_snapshots (
  id              SERIAL PRIMARY KEY,
  company_id      INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  platform        TEXT NOT NULL CHECK (platform IN ('trustpilot','amazon','g2','capterra','app_store','play_store')),
  external_id     TEXT,
  rating          NUMERIC(3,2),
  rating_max      NUMERIC(3,1) DEFAULT 5.0,
  review_count    INT,
  rating_dist     JSONB DEFAULT '{}',
  trust_score     NUMERIC(4,2),
  sentiment_label TEXT,
  snapshot_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, platform, external_id, snapshot_date)
);

CREATE INDEX idx_reviews_company ON review_snapshots(company_id, snapshot_date DESC);
CREATE INDEX idx_reviews_rating ON review_snapshots(rating DESC NULLS LAST);

ALTER TABLE review_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Review snapshots are viewable by everyone" ON review_snapshots FOR SELECT USING (true);

-- ============================================================
-- COMPANY ENRICHMENT
-- Monthly enrichment from Crunchbase (200/mo free), Wappalyzer (50/mo free)
-- ============================================================
CREATE TABLE company_enrichment (
  id                SERIAL PRIMARY KEY,
  company_id        INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  source            TEXT NOT NULL DEFAULT 'crunchbase',
  crunchbase_url    TEXT,
  employee_count_est INT,
  employee_range    TEXT,
  total_funding_usd BIGINT,
  last_funding_date DATE,
  last_funding_type TEXT,
  last_funding_amt  BIGINT,
  tech_stack        JSONB DEFAULT '[]',
  tech_categories   JSONB DEFAULT '{}',
  headquarters      TEXT,
  country_code      TEXT,
  linkedin_url      TEXT,
  investor_names    JSONB DEFAULT '[]',
  enriched_at       TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, source)
);

CREATE INDEX idx_enrichment_company ON company_enrichment(company_id);
CREATE INDEX idx_enrichment_funding ON company_enrichment(total_funding_usd DESC NULLS LAST);

ALTER TABLE company_enrichment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enrichment data is viewable by everyone" ON company_enrichment FOR SELECT USING (true);

-- ============================================================
-- NEWS ARTICLES
-- Daily news mentions per brand
-- Sources: Google News RSS (free, unlimited)
-- ============================================================
CREATE TABLE news_articles (
  id            SERIAL PRIMARY KEY,
  company_id    INT REFERENCES companies(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  source_name   TEXT,
  source_url    TEXT NOT NULL,
  published_at  TIMESTAMPTZ,
  description   TEXT,
  category      TEXT CHECK (category IN ('funding','acquisition','product','partnership','hiring','general')),
  sentiment     TEXT CHECK (sentiment IN ('positive','neutral','negative')),
  is_major      BOOLEAN DEFAULT false,
  fingerprint   TEXT UNIQUE,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_news_company ON news_articles(company_id, published_at DESC);
CREATE INDEX idx_news_published ON news_articles(published_at DESC);
CREATE INDEX idx_news_category ON news_articles(category) WHERE category IS NOT NULL;
CREATE INDEX idx_news_major ON news_articles(published_at DESC) WHERE is_major = true;

ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "News articles are viewable by everyone" ON news_articles FOR SELECT USING (true);

-- ============================================================
-- COMMUNITY MENTIONS
-- Reddit/HN/forum mentions with engagement data
-- Sources: Reddit API (free), HN Algolia (existing)
-- ============================================================
CREATE TABLE community_mentions (
  id              SERIAL PRIMARY KEY,
  company_id      INT REFERENCES companies(id) ON DELETE CASCADE,
  platform        TEXT NOT NULL CHECK (platform IN ('reddit','hackernews','producthunt','twitter')),
  post_id         TEXT NOT NULL,
  subreddit       TEXT,
  title           TEXT,
  body_preview    TEXT,
  author          TEXT,
  score           INT DEFAULT 0,
  num_comments    INT DEFAULT 0,
  url             TEXT,
  sentiment       TEXT CHECK (sentiment IN ('positive','neutral','negative','mixed')),
  posted_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(platform, post_id)
);

CREATE INDEX idx_community_company ON community_mentions(company_id, posted_at DESC);
CREATE INDEX idx_community_platform ON community_mentions(platform, posted_at DESC);
CREATE INDEX idx_community_score ON community_mentions(score DESC);

ALTER TABLE community_mentions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Community mentions are viewable by everyone" ON community_mentions FOR SELECT USING (true);

-- ============================================================
-- COMMUNITY SUMMARIES
-- Weekly AI-generated summaries of community sentiment
-- Source: Claude Haiku (~$5/mo for weekly batch)
-- ============================================================
CREATE TABLE community_summaries (
  id              SERIAL PRIMARY KEY,
  company_id      INT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  period_start    DATE NOT NULL,
  period_end      DATE NOT NULL,
  summary         TEXT NOT NULL,
  pain_points     JSONB DEFAULT '[]',
  praise_points   JSONB DEFAULT '[]',
  trending_topics JSONB DEFAULT '[]',
  overall_sentiment TEXT CHECK (overall_sentiment IN ('positive','neutral','negative','mixed')),
  mention_count   INT DEFAULT 0,
  model           TEXT DEFAULT 'claude-3-5-haiku-20241022',
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, period_start)
);

CREATE INDEX idx_summaries_company ON community_summaries(company_id, period_start DESC);

ALTER TABLE community_summaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Community summaries are viewable by everyone" ON community_summaries FOR SELECT USING (true);

-- ============================================================
-- API TOKEN BUDGETS
-- Enforce daily/monthly call limits per source to control costs
-- ============================================================
CREATE TABLE api_token_budgets (
  id              SERIAL PRIMARY KEY,
  source          TEXT NOT NULL,
  period          TEXT NOT NULL CHECK (period IN ('daily','weekly','monthly')),
  budget_limit    INT NOT NULL,
  used            INT DEFAULT 0,
  period_start    DATE NOT NULL DEFAULT CURRENT_DATE,
  reset_at        TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source, period, period_start)
);

CREATE INDEX idx_budgets_source ON api_token_budgets(source, period_start DESC);

ALTER TABLE api_token_budgets ENABLE ROW LEVEL SECURITY;
-- No public access -- service role only

-- ============================================================
-- Extend existing tables
-- ============================================================
ALTER TABLE ingestion_runs ADD COLUMN IF NOT EXISTS duration_ms INT;
ALTER TABLE ingestion_runs ADD COLUMN IF NOT EXISTS retry_count INT DEFAULT 0;
ALTER TABLE ingestion_runs ADD COLUMN IF NOT EXISTS next_retry_at TIMESTAMPTZ;

ALTER TABLE companies ADD COLUMN IF NOT EXISTS instagram TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS tiktok TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS domain TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS trustpilot_domain TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS meta_page_id TEXT;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS crunchbase_slug TEXT;

-- ============================================================
-- Materialized view for fast frontend queries
-- Pre-joins latest snapshot from each table per company
-- ============================================================
CREATE MATERIALIZED VIEW company_dashboard AS
SELECT
  c.id, c.name, c.slug, c.cat, c.domain, c.website,
  -- Latest traffic
  t.visits_est, t.tranco_rank, t.traffic_sources AS traffic_src, t.snapshot_date AS traffic_date,
  -- Latest social
  si.followers AS ig_followers, si.engagement_rate AS ig_engagement,
  st.followers AS tt_followers, st.engagement_rate AS tt_engagement,
  -- Latest ads
  a.active_ad_count, a.ad_formats,
  -- Latest reviews
  r.rating AS trustpilot_rating, r.review_count AS trustpilot_reviews, r.trust_score,
  -- Latest enrichment
  e.employee_count_est, e.total_funding_usd, e.tech_stack,
  -- Latest summary
  cs.summary AS community_summary, cs.overall_sentiment, cs.pain_points, cs.praise_points
FROM companies c
LEFT JOIN LATERAL (SELECT * FROM traffic_snapshots WHERE company_id = c.id ORDER BY snapshot_date DESC LIMIT 1) t ON true
LEFT JOIN LATERAL (SELECT * FROM social_snapshots WHERE company_id = c.id AND platform = 'instagram' ORDER BY snapshot_date DESC LIMIT 1) si ON true
LEFT JOIN LATERAL (SELECT * FROM social_snapshots WHERE company_id = c.id AND platform = 'tiktok' ORDER BY snapshot_date DESC LIMIT 1) st ON true
LEFT JOIN LATERAL (SELECT * FROM ad_snapshots WHERE company_id = c.id AND platform = 'meta' ORDER BY snapshot_date DESC LIMIT 1) a ON true
LEFT JOIN LATERAL (SELECT * FROM review_snapshots WHERE company_id = c.id AND platform = 'trustpilot' ORDER BY snapshot_date DESC LIMIT 1) r ON true
LEFT JOIN LATERAL (SELECT * FROM company_enrichment WHERE company_id = c.id ORDER BY enriched_at DESC LIMIT 1) e ON true
LEFT JOIN LATERAL (SELECT * FROM community_summaries WHERE company_id = c.id ORDER BY period_start DESC LIMIT 1) cs ON true
WHERE c.status = 'active';

CREATE UNIQUE INDEX idx_dashboard_id ON company_dashboard(id);

-- Enable realtime for high-value tables
ALTER PUBLICATION supabase_realtime ADD TABLE news_articles;
ALTER PUBLICATION supabase_realtime ADD TABLE community_mentions;

-- ============================================================
-- Seed initial API budgets
-- ============================================================
INSERT INTO api_token_budgets (source, period, budget_limit) VALUES
  ('crunchbase', 'monthly', 200),
  ('wappalyzer', 'monthly', 50),
  ('rapidapi_instagram', 'daily', 100),
  ('rapidapi_tiktok', 'daily', 100),
  ('similarweb', 'daily', 50),
  ('google_trends', 'daily', 30),
  ('rainforest', 'monthly', 100),
  ('claude_haiku', 'weekly', 50)
ON CONFLICT DO NOTHING;
