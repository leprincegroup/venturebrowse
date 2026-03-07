-- Phase 2: Add GitHub org slugs to existing companies + add Vercel & Linear
-- ============================================================

-- Update existing companies with GitHub org names for ingestion
UPDATE companies SET github = 'supabase', website = 'https://supabase.com' WHERE slug = 'supabase';
UPDATE companies SET github = 'dratamobile', website = 'https://drata.com' WHERE slug = 'drata';
UPDATE companies SET github = 'attio', website = 'https://attio.com' WHERE slug = 'attio';
UPDATE companies SET github = 'causal-app', website = 'https://causal.app' WHERE slug = 'causal';
UPDATE companies SET github = 'nicepkg', website = 'https://perplexity.ai' WHERE slug = 'perplexity';
UPDATE companies SET github = 'coda', website = 'https://coda.io' WHERE slug = 'coda';

-- ============================================================
-- ADD VERCEL
-- ============================================================
INSERT INTO companies (id, slug, name, tag, logo, category_id, cat, hq, founded, employees, raised, description, website, github, momentum, momentum_color, status)
VALUES (7, 'vercel', 'Vercel', 'Frontend cloud platform powering the modern web', 'VC', 1, 'Dev Tools', 'San Francisco', 2015, '~500', '$563M',
  'Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.',
  'https://vercel.com', 'vercel', 89, '#1a7a52', 'active');

INSERT INTO company_tags (company_id, tag_id) VALUES (7, 1), (7, 2);

INSERT INTO company_metrics (company_id, label, value, css_class, sort_value) VALUES
  (7, 'Hiring Δ', '+160%', 'g', 160),
  (7, 'Traffic Δ', '+78%', 'g', 78),
  (7, 'Stage', 'Series E', NULL, 0);

INSERT INTO company_scores (company_id, name, score, css_class) VALUES
  (7, 'Hiring Signal', 8.8, 'sf-g'),
  (7, 'Traffic Growth', 8.2, 'sf-g'),
  (7, 'Funding Proximity', 7.5, 'sf-a'),
  (7, 'Category Strength', 9.0, 'sf-g'),
  (7, 'Team Quality', 9.2, 'sf-g');

INSERT INTO spark_data (company_id, month_idx, value) VALUES
  (7,0,50),(7,1,55),(7,2,58),(7,3,62),(7,4,65),(7,5,70),(7,6,74),(7,7,78),(7,8,82),(7,9,85),(7,10,87),(7,11,89);

INSERT INTO funding_rounds (company_id, round_type, amount, date, lead, sort_order) VALUES
  (7, 'Series E', '$150M', '2024', 'GIC', 0),
  (7, 'Series D', '$150M', '2021', 'GIC', 1),
  (7, 'Series C', '$102M', '2021', 'Bedrock Capital', 2);

INSERT INTO competitors (company_id, name) VALUES
  (7, 'Netlify'), (7, 'Cloudflare Pages'), (7, 'AWS Amplify');

-- ============================================================
-- ADD LINEAR
-- ============================================================
INSERT INTO companies (id, slug, name, tag, logo, category_id, cat, hq, founded, employees, raised, description, website, github, momentum, momentum_color, status)
VALUES (8, 'linear', 'Linear', 'Issue tracking tool built for speed and developer-first workflows', 'LN', 2, 'B2B SaaS', 'San Francisco', 2019, '~80', '$52M',
  'Linear is the issue tracking tool you will enjoy using. Built for high-performance teams.',
  'https://linear.app', 'linear', 84, '#1a7a52', 'active');

INSERT INTO company_tags (company_id, tag_id) VALUES (8, 5), (8, 2);

INSERT INTO company_metrics (company_id, label, value, css_class, sort_value) VALUES
  (8, 'Hiring Δ', '+95%', 'g', 95),
  (8, 'Traffic Δ', '+55%', 'g', 55),
  (8, 'Stage', 'Series C', NULL, 0);

INSERT INTO company_scores (company_id, name, score, css_class) VALUES
  (8, 'Hiring Signal', 7.8, 'sf-a'),
  (8, 'Traffic Growth', 7.5, 'sf-a'),
  (8, 'Funding Proximity', 7.0, 'sf-a'),
  (8, 'Category Strength', 8.5, 'sf-g'),
  (8, 'Team Quality', 9.0, 'sf-g');

INSERT INTO spark_data (company_id, month_idx, value) VALUES
  (8,0,42),(8,1,48),(8,2,52),(8,3,56),(8,4,60),(8,5,64),(8,6,68),(8,7,72),(8,8,76),(8,9,79),(8,10,82),(8,11,84);

INSERT INTO funding_rounds (company_id, round_type, amount, date, lead, sort_order) VALUES
  (8, 'Series C', '$35M', '2022', 'Spark Capital', 0),
  (8, 'Series B', '$35M', '2021', 'Accel', 1),
  (8, 'Series A', '$13M', '2020', 'Sequoia Capital', 2);

INSERT INTO competitors (company_id, name) VALUES
  (8, 'Jira'), (8, 'Shortcut'), (8, 'Height');

-- Update sequences
SELECT setval('companies_id_seq', 8);

-- Update category counts
UPDATE categories SET count = count + 1 WHERE slug = 'ai';
UPDATE categories SET count = count + 1 WHERE slug = 'b2b-saas';

-- Add initial signals for new companies
INSERT INTO signals (company_id, co_name, type, text, severity, time_label, created_at) VALUES
  (7, 'Vercel', 'product', 'Released v0 AI code generation to general availability', 'high', '3d ago', now() - interval '3 days'),
  (7, 'Vercel', 'hiring', 'Hired new VP of Platform Engineering from AWS', 'medium', '1w ago', now() - interval '7 days'),
  (8, 'Linear', 'product', 'Launched Linear Insights analytics dashboard', 'medium', '2d ago', now() - interval '2 days'),
  (8, 'Linear', 'traffic', 'Monthly active users surpassed 10,000 teams', 'high', '1w ago', now() - interval '7 days');
