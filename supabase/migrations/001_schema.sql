-- VentureBrowse Schema Migration
-- Phase 1: Core tables for companies, signals, investors, and user features

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE categories (
  id         SERIAL PRIMARY KEY,
  slug       TEXT UNIQUE NOT NULL,
  name       TEXT NOT NULL,
  icon       TEXT DEFAULT '◇',
  sub        TEXT,
  count      INT DEFAULT 0,
  growth     TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- COMPANIES
-- ============================================================
CREATE TABLE companies (
  id           SERIAL PRIMARY KEY,
  slug         TEXT UNIQUE NOT NULL,
  name         TEXT NOT NULL,
  tag          TEXT,
  logo         TEXT DEFAULT '',
  category_id  INT REFERENCES categories(id),
  cat          TEXT,
  hq           TEXT,
  founded      INT,
  employees    TEXT,
  raised       TEXT,
  description  TEXT,
  website      TEXT,
  linkedin     TEXT,
  twitter      TEXT,
  github       TEXT,
  momentum     NUMERIC(5,1) DEFAULT 0,
  momentum_color TEXT DEFAULT '#8a5e0a',
  status       TEXT DEFAULT 'active' CHECK (status IN ('active','pending','archived')),
  is_verified  BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_companies_cat ON companies(cat);
CREATE INDEX idx_companies_momentum ON companies(momentum DESC);
CREATE INDEX idx_companies_status ON companies(status);

-- ============================================================
-- COMPANY METRICS (hiring, traffic, stage, etc.)
-- ============================================================
CREATE TABLE company_metrics (
  id         SERIAL PRIMARY KEY,
  company_id INT REFERENCES companies(id) ON DELETE CASCADE,
  label      TEXT NOT NULL,
  value      TEXT NOT NULL,
  css_class  TEXT,
  sort_value NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, label)
);

CREATE INDEX idx_metrics_company ON company_metrics(company_id);

-- ============================================================
-- COMPANY SCORES (hiring signal, traffic growth, etc.)
-- ============================================================
CREATE TABLE company_scores (
  id         SERIAL PRIMARY KEY,
  company_id INT REFERENCES companies(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  score      NUMERIC(4,1) NOT NULL,
  css_class  TEXT DEFAULT 'sf-a',
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, name)
);

CREATE INDEX idx_scores_company ON company_scores(company_id);

-- ============================================================
-- SPARK DATA (12-month momentum trend)
-- ============================================================
CREATE TABLE spark_data (
  id         SERIAL PRIMARY KEY,
  company_id INT REFERENCES companies(id) ON DELETE CASCADE,
  month_idx  INT NOT NULL CHECK (month_idx BETWEEN 0 AND 11),
  value      NUMERIC(5,1) NOT NULL,
  UNIQUE(company_id, month_idx)
);

CREATE INDEX idx_spark_company ON spark_data(company_id);

-- ============================================================
-- FUNDING ROUNDS
-- ============================================================
CREATE TABLE funding_rounds (
  id         SERIAL PRIMARY KEY,
  company_id INT REFERENCES companies(id) ON DELETE CASCADE,
  round_type TEXT NOT NULL,
  amount     TEXT,
  date       TEXT,
  lead       TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_rounds_company ON funding_rounds(company_id);

-- ============================================================
-- COMPETITORS
-- ============================================================
CREATE TABLE competitors (
  id         SERIAL PRIMARY KEY,
  company_id INT REFERENCES companies(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  UNIQUE(company_id, name)
);

-- ============================================================
-- TAGS (reusable labels)
-- ============================================================
CREATE TABLE tags (
  id   SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  css_class TEXT DEFAULT 'tm',
  UNIQUE(label, css_class)
);

-- ============================================================
-- COMPANY <-> TAG junction
-- ============================================================
CREATE TABLE company_tags (
  company_id INT REFERENCES companies(id) ON DELETE CASCADE,
  tag_id     INT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (company_id, tag_id)
);

-- ============================================================
-- SIGNALS (activity feed items)
-- ============================================================
CREATE TABLE signals (
  id         SERIAL PRIMARY KEY,
  company_id INT REFERENCES companies(id) ON DELETE CASCADE,
  co_name    TEXT,
  type       TEXT CHECK (type IN ('hiring','traffic','funding','product','investor','signal','event')),
  text       TEXT NOT NULL,
  severity   TEXT DEFAULT 'low' CHECK (severity IN ('high','medium','low')),
  source     TEXT,
  source_url TEXT,
  time_label TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_signals_company ON signals(company_id);
CREATE INDEX idx_signals_created ON signals(created_at DESC);
CREATE INDEX idx_signals_type ON signals(type);

-- ============================================================
-- INVESTORS
-- ============================================================
CREATE TABLE investors (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  type       TEXT,
  initials   TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INVESTOR STATS
-- ============================================================
CREATE TABLE investor_stats (
  id          SERIAL PRIMARY KEY,
  investor_id INT REFERENCES investors(id) ON DELETE CASCADE,
  label       TEXT NOT NULL,
  value       TEXT NOT NULL,
  UNIQUE(investor_id, label)
);

-- ============================================================
-- INVESTOR FOCUS TAGS
-- ============================================================
CREATE TABLE investor_focus (
  id          SERIAL PRIMARY KEY,
  investor_id INT REFERENCES investors(id) ON DELETE CASCADE,
  label       TEXT NOT NULL,
  css_class   TEXT DEFAULT 'tm'
);

-- ============================================================
-- INVESTOR BADGE
-- ============================================================
-- stored inline on investors table
ALTER TABLE investors ADD COLUMN badge_label TEXT;
ALTER TABLE investors ADD COLUMN badge_class TEXT DEFAULT 'tg';

-- ============================================================
-- INVESTOR ACTIVITY (12-month bar chart)
-- ============================================================
CREATE TABLE investor_activity (
  id          SERIAL PRIMARY KEY,
  investor_id INT REFERENCES investors(id) ON DELETE CASCADE,
  month_idx   INT NOT NULL CHECK (month_idx BETWEEN 0 AND 11),
  value       INT DEFAULT 0,
  UNIQUE(investor_id, month_idx)
);

-- ============================================================
-- SIGNAL OF THE DAY
-- ============================================================
CREATE TABLE signal_of_the_day (
  id         SERIAL PRIMARY KEY,
  company_id INT REFERENCES companies(id),
  name       TEXT NOT NULL,
  italic     TEXT,
  description TEXT,
  selected_at DATE DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(selected_at)
);

-- SOTD tags, sigs, scores stored as JSONB for simplicity
ALTER TABLE signal_of_the_day ADD COLUMN tags JSONB DEFAULT '[]';
ALTER TABLE signal_of_the_day ADD COLUMN sigs JSONB DEFAULT '[]';
ALTER TABLE signal_of_the_day ADD COLUMN scores JSONB DEFAULT '[]';

-- ============================================================
-- TICKER DATA
-- ============================================================
CREATE TABLE ticker_data (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  delta TEXT,
  is_up BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- USER PROFILES (linked to Supabase Auth)
-- ============================================================
CREATE TABLE profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT,
  name       TEXT,
  avatar_url TEXT,
  role       TEXT DEFAULT 'user' CHECK (role IN ('user','admin','founder')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- WATCHLIST
-- ============================================================
CREATE TABLE watchlist_items (
  id         SERIAL PRIMARY KEY,
  user_id    UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_id INT REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, company_id)
);

CREATE INDEX idx_watchlist_user ON watchlist_items(user_id);

-- ============================================================
-- AI BRIEFS (cached, 7-day TTL)
-- ============================================================
CREATE TABLE ai_briefs (
  id         SERIAL PRIMARY KEY,
  company_id INT REFERENCES companies(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  model      TEXT DEFAULT 'claude-sonnet-4-20250514',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_briefs_company ON ai_briefs(company_id);
CREATE INDEX idx_briefs_created ON ai_briefs(created_at DESC);

-- ============================================================
-- SUBMISSIONS (startup self-submit)
-- ============================================================
CREATE TABLE submissions (
  id              SERIAL PRIMARY KEY,
  submitted_by    UUID REFERENCES profiles(id),
  company_name    TEXT NOT NULL,
  website         TEXT,
  description     TEXT,
  category        TEXT,
  hq              TEXT,
  founded         INT,
  employees       TEXT,
  raised          TEXT,
  mrr             NUMERIC,
  mrr_verified    BOOLEAN DEFAULT false,
  stripe_account  TEXT,
  linkedin        TEXT,
  twitter         TEXT,
  github          TEXT,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewed_by     UUID REFERENCES profiles(id),
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_submissions_status ON submissions(status);

-- ============================================================
-- INGESTION RUNS (track last cursor per source)
-- ============================================================
CREATE TABLE ingestion_runs (
  id          SERIAL PRIMARY KEY,
  source      TEXT NOT NULL,
  last_cursor TEXT,
  last_run_at TIMESTAMPTZ DEFAULT now(),
  items_found INT DEFAULT 0,
  status      TEXT DEFAULT 'success',
  error       TEXT,
  UNIQUE(source)
);

-- ============================================================
-- HELPER: auto-update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- HELPER: auto-create profile on auth signup
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Public read for most tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Companies are viewable by everyone" ON companies FOR SELECT USING (status = 'active');

ALTER TABLE company_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Metrics are viewable by everyone" ON company_metrics FOR SELECT USING (true);

ALTER TABLE company_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Scores are viewable by everyone" ON company_scores FOR SELECT USING (true);

ALTER TABLE spark_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Spark data is viewable by everyone" ON spark_data FOR SELECT USING (true);

ALTER TABLE funding_rounds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Rounds are viewable by everyone" ON funding_rounds FOR SELECT USING (true);

ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Competitors are viewable by everyone" ON competitors FOR SELECT USING (true);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tags are viewable by everyone" ON tags FOR SELECT USING (true);

ALTER TABLE company_tags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Company tags are viewable by everyone" ON company_tags FOR SELECT USING (true);

ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signals are viewable by everyone" ON signals FOR SELECT USING (true);

ALTER TABLE investors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Investors are viewable by everyone" ON investors FOR SELECT USING (true);

ALTER TABLE investor_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Investor stats are viewable by everyone" ON investor_stats FOR SELECT USING (true);

ALTER TABLE investor_focus ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Investor focus are viewable by everyone" ON investor_focus FOR SELECT USING (true);

ALTER TABLE investor_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Investor activity is viewable by everyone" ON investor_activity FOR SELECT USING (true);

ALTER TABLE signal_of_the_day ENABLE ROW LEVEL SECURITY;
CREATE POLICY "SOTD is viewable by everyone" ON signal_of_the_day FOR SELECT USING (true);

ALTER TABLE ticker_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ticker is viewable by everyone" ON ticker_data FOR SELECT USING (true);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);

ALTER TABLE ai_briefs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Briefs are viewable by everyone" ON ai_briefs FOR SELECT USING (true);

-- Watchlist: users can only see/manage their own
ALTER TABLE watchlist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own watchlist" ON watchlist_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own watchlist" ON watchlist_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own watchlist" ON watchlist_items FOR DELETE USING (auth.uid() = user_id);

-- Profiles: users can view all, edit own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Submissions: users can view/create own, admins can view all
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own submissions" ON submissions FOR SELECT USING (auth.uid() = submitted_by);
CREATE POLICY "Users can create submissions" ON submissions FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Admins can view all submissions" ON submissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update submissions" ON submissions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Ingestion runs: no public access (service role only)
ALTER TABLE ingestion_runs ENABLE ROW LEVEL SECURITY;

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE signals;
ALTER PUBLICATION supabase_realtime ADD TABLE companies;
ALTER PUBLICATION supabase_realtime ADD TABLE signal_of_the_day;
