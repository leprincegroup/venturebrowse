-- VentureBrowse Seed Data
-- Populates tables with current mock data from constants.js

-- ============================================================
-- CATEGORIES
-- ============================================================
INSERT INTO categories (id, slug, name, icon, sub, count, growth) VALUES
  (1, 'ai', 'AI Infrastructure', '◈', 'Model serving, vector DBs, AI ops platforms', 847, '+124%'),
  (2, 'b2b-saas', 'B2B SaaS', '◇', 'Enterprise workflow, CRM, vertical software', 2341, '+38%'),
  (3, 'dtc', 'DTC / Consumer', '○', 'Direct brands, subscription, CPG plays', 1204, '+22%'),
  (4, 'cybersecurity', 'Cybersecurity', '△', 'Identity, compliance, threat intelligence', 412, '+91%'),
  (5, 'health', 'Health & Wellness', '□', 'Digital health, diagnostics, longevity', 623, '+67%'),
  (6, 'climate', 'Climate Tech', '⬡', 'Energy, carbon markets, grid infrastructure', 389, '+145%');

SELECT setval('categories_id_seq', 6);

-- ============================================================
-- TAGS
-- ============================================================
INSERT INTO tags (id, label, css_class) VALUES
  (1, 'Pre-Raise', 'tg'),
  (2, 'Dev Tools', 'tm'),
  (3, 'Security', 'tm'),
  (4, 'CRM', 'tm'),
  (5, 'Growing', 'ta'),
  (6, 'Fintech', 'tm'),
  (7, 'Viral', 'tr'),
  (8, 'AI', 'tb'),
  (9, 'Steady', 'ta'),
  (10, 'Productivity', 'tm');

SELECT setval('tags_id_seq', 10);

-- ============================================================
-- COMPANIES
-- ============================================================
INSERT INTO companies (id, slug, name, tag, logo, cat, hq, founded, employees, raised, momentum, momentum_color, status) VALUES
  (1, 'supabase', 'Supabase', 'Open-source Firebase alternative gaining enterprise momentum fast', 'SB', 'Dev Tools', 'Singapore', 2020, '~180', '$116M', 91, '#1a7a52', 'active'),
  (2, 'drata', 'Drata', 'Compliance automation riding the SOC2 demand surge in the SMB market', 'DR', 'Security', 'San Diego', 2020, '~300', '$328M', 88, '#1a7a52', 'active'),
  (3, 'attio', 'Attio', 'Modern CRM built for VC funds and fast-moving operator teams globally', 'AT', 'CRM', 'London', 2019, '~75', '$31M', 85, '#1a7a52', 'active'),
  (4, 'causal', 'Causal', 'Financial modeling platform replacing Excel for modern finance teams', 'CA', 'Fintech', 'London', 2019, '~40', '$20M', 78, '#8a5e0a', 'active'),
  (5, 'perplexity', 'Perplexity', 'Answer engine scaling beyond search into enterprise knowledge layers', 'PX', 'AI', 'San Francisco', 2022, '~200', '$500M+', 96, '#9b2c2c', 'active'),
  (6, 'coda', 'Coda', 'Doc-database hybrid gaining traction from enterprise Notion migration', 'CO', 'Productivity', 'Mountain View', 2014, '~400', '$636M', 72, '#8a5e0a', 'active');

SELECT setval('companies_id_seq', 6);

-- ============================================================
-- COMPANY TAGS
-- ============================================================
-- Supabase: Pre-Raise, Dev Tools
INSERT INTO company_tags (company_id, tag_id) VALUES (1, 1), (1, 2);
-- Drata: Pre-Raise, Security
INSERT INTO company_tags (company_id, tag_id) VALUES (2, 1), (2, 3);
-- Attio: Pre-Raise, CRM
INSERT INTO company_tags (company_id, tag_id) VALUES (3, 1), (3, 4);
-- Causal: Growing, Fintech
INSERT INTO company_tags (company_id, tag_id) VALUES (4, 5), (4, 6);
-- Perplexity: Viral, AI
INSERT INTO company_tags (company_id, tag_id) VALUES (5, 7), (5, 8);
-- Coda: Steady, Productivity
INSERT INTO company_tags (company_id, tag_id) VALUES (6, 9), (6, 10);

-- ============================================================
-- COMPANY METRICS
-- ============================================================
INSERT INTO company_metrics (company_id, label, value, css_class, sort_value) VALUES
  -- Supabase
  (1, 'Hiring Δ', '+220%', 'g', 220), (1, 'Traffic Δ', '+94%', 'g', 94), (1, 'Stage', 'Series C', NULL, 0),
  -- Drata
  (2, 'Hiring Δ', '+180%', 'g', 180), (2, 'Traffic Δ', '+120%', 'g', 120), (2, 'Stage', 'Series B', NULL, 0),
  -- Attio
  (3, 'Hiring Δ', '+145%', 'g', 145), (3, 'Traffic Δ', '+88%', 'g', 88), (3, 'Stage', 'Series A', NULL, 0),
  -- Causal
  (4, 'Hiring Δ', '+85%', 'g', 85), (4, 'Traffic Δ', '+40%', 'g', 40), (4, 'Stage', 'Series A', NULL, 0),
  -- Perplexity
  (5, 'Hiring Δ', '+410%', 'g', 410), (5, 'Traffic Δ', '+320%', 'g', 320), (5, 'Stage', 'Series C', NULL, 0),
  -- Coda
  (6, 'Hiring Δ', '+62%', 'g', 62), (6, 'Traffic Δ', '+28%', 'g', 28), (6, 'Stage', 'Series D', NULL, 0);

-- ============================================================
-- COMPANY SCORES
-- ============================================================
INSERT INTO company_scores (company_id, name, score, css_class) VALUES
  -- Supabase
  (1, 'Hiring Signal', 9.2, 'sf-g'), (1, 'Traffic Growth', 8.8, 'sf-g'), (1, 'Funding Proximity', 8.5, 'sf-g'), (1, 'Category Strength', 7.8, 'sf-a'), (1, 'Team Quality', 8.6, 'sf-g'),
  -- Drata
  (2, 'Hiring Signal', 8.5, 'sf-g'), (2, 'Traffic Growth', 8.8, 'sf-g'), (2, 'Funding Proximity', 9.0, 'sf-g'), (2, 'Category Strength', 8.2, 'sf-g'), (2, 'Team Quality', 7.8, 'sf-a'),
  -- Attio
  (3, 'Hiring Signal', 8.0, 'sf-g'), (3, 'Traffic Growth', 7.8, 'sf-a'), (3, 'Funding Proximity', 8.5, 'sf-g'), (3, 'Category Strength', 7.0, 'sf-a'), (3, 'Team Quality', 8.8, 'sf-g'),
  -- Causal
  (4, 'Hiring Signal', 7.2, 'sf-a'), (4, 'Traffic Growth', 6.5, 'sf-a'), (4, 'Funding Proximity', 7.8, 'sf-a'), (4, 'Category Strength', 7.5, 'sf-a'), (4, 'Team Quality', 8.0, 'sf-g'),
  -- Perplexity
  (5, 'Hiring Signal', 9.8, 'sf-g'), (5, 'Traffic Growth', 9.6, 'sf-g'), (5, 'Funding Proximity', 7.5, 'sf-a'), (5, 'Category Strength', 9.2, 'sf-g'), (5, 'Team Quality', 9.4, 'sf-g'),
  -- Coda
  (6, 'Hiring Signal', 6.8, 'sf-a'), (6, 'Traffic Growth', 5.5, 'sf-a'), (6, 'Funding Proximity', 6.0, 'sf-a'), (6, 'Category Strength', 7.2, 'sf-a'), (6, 'Team Quality', 7.5, 'sf-a');

-- ============================================================
-- SPARK DATA (12-month momentum trend)
-- ============================================================
-- Supabase
INSERT INTO spark_data (company_id, month_idx, value) VALUES
  (1,0,45),(1,1,52),(1,2,48),(1,3,55),(1,4,60),(1,5,58),(1,6,65),(1,7,72),(1,8,75),(1,9,80),(1,10,85),(1,11,91);
-- Drata
INSERT INTO spark_data (company_id, month_idx, value) VALUES
  (2,0,40),(2,1,45),(2,2,50),(2,3,55),(2,4,60),(2,5,65),(2,6,68),(2,7,72),(2,8,78),(2,9,82),(2,10,85),(2,11,88);
-- Attio
INSERT INTO spark_data (company_id, month_idx, value) VALUES
  (3,0,30),(3,1,35),(3,2,38),(3,3,42),(3,4,48),(3,5,55),(3,6,60),(3,7,65),(3,8,70),(3,9,75),(3,10,80),(3,11,85);
-- Causal
INSERT INTO spark_data (company_id, month_idx, value) VALUES
  (4,0,35),(4,1,38),(4,2,40),(4,3,42),(4,4,45),(4,5,50),(4,6,55),(4,7,58),(4,8,62),(4,9,68),(4,10,72),(4,11,78);
-- Perplexity
INSERT INTO spark_data (company_id, month_idx, value) VALUES
  (5,0,20),(5,1,30),(5,2,40),(5,3,55),(5,4,65),(5,5,72),(5,6,78),(5,7,82),(5,8,88),(5,9,92),(5,10,94),(5,11,96);
-- Coda
INSERT INTO spark_data (company_id, month_idx, value) VALUES
  (6,0,55),(6,1,58),(6,2,55),(6,3,60),(6,4,58),(6,5,62),(6,6,60),(6,7,64),(6,8,65),(6,9,68),(6,10,70),(6,11,72);

-- ============================================================
-- FUNDING ROUNDS
-- ============================================================
INSERT INTO funding_rounds (company_id, round_type, amount, date, lead, sort_order) VALUES
  -- Supabase
  (1, 'Series C', '$80M', '2023', 'Felicis Ventures', 0),
  (1, 'Series B', '$30M', '2022', 'Coatue Management', 1),
  (1, 'Seed', '$6M', '2020', 'Y Combinator', 2),
  -- Drata
  (2, 'Series B', '$200M', '2022', 'ICONIQ Growth', 0),
  (2, 'Series A', '$25M', '2021', 'GGV Capital', 1),
  (2, 'Seed', '$3.2M', '2020', 'Cowboy Ventures', 2),
  -- Attio
  (3, 'Series A', '$23.5M', '2023', 'Redpoint Ventures', 0),
  (3, 'Seed', '$7.5M', '2021', 'Balderton Capital', 1),
  -- Causal
  (4, 'Series A', '$16M', '2022', 'Coatue Management', 0),
  (4, 'Seed', '$4.2M', '2020', 'Passion Capital', 1),
  -- Perplexity
  (5, 'Series C', '$250M', '2024', 'IVP', 0),
  (5, 'Series B', '$73.6M', '2024', 'IVP', 1),
  (5, 'Series A', '$25.6M', '2023', 'NEA', 2),
  (5, 'Seed', '$3.1M', '2022', 'Elad Gil', 3),
  -- Coda
  (6, 'Series D', '$100M', '2021', 'General Catalyst', 0),
  (6, 'Series C', '$80M', '2019', 'IVP', 1),
  (6, 'Series B', '$60M', '2018', 'Greylock', 2);

-- ============================================================
-- COMPETITORS
-- ============================================================
INSERT INTO competitors (company_id, name) VALUES
  (1,'Firebase'),(1,'PlanetScale'),(1,'Neon'),
  (2,'Vanta'),(2,'Secureframe'),(2,'Thoropass'),
  (3,'Affinity'),(3,'HubSpot'),(3,'Folk'),
  (4,'Runway'),(4,'Mosaic'),(4,'Pigment'),
  (5,'Google Search'),(5,'OpenAI'),(5,'You.com'),
  (6,'Notion'),(6,'Airtable'),(6,'Monday.com');

-- ============================================================
-- SIGNALS
-- ============================================================
INSERT INTO signals (company_id, co_name, type, text, severity, time_label, created_at) VALUES
  -- Supabase signals
  (1, 'Supabase', 'product', 'Added 8 enterprise security features to dashboard', 'medium', '4h ago', now() - interval '4 hours'),
  (1, 'Supabase', 'hiring', 'VP Engineering from Stripe started this week', 'high', '2d ago', now() - interval '2 days'),
  (1, 'Supabase', 'traffic', 'Database connections API traffic up 3x', 'high', '5d ago', now() - interval '5 days'),
  (1, 'Supabase', 'product', 'Launched SOC2 compliance documentation page', 'medium', '1w ago', now() - interval '7 days'),
  -- Drata signals
  (2, 'Drata', 'funding', 'CEO engaged with 3 Series C fundraising posts', 'medium', '6h ago', now() - interval '6 hours'),
  (2, 'Drata', 'signal', 'Removed ''Series B'' from careers page header', 'high', '1d ago', now() - interval '1 day'),
  (2, 'Drata', 'hiring', '14 new compliance roles posted on LinkedIn', 'medium', '3d ago', now() - interval '3 days'),
  (2, 'Drata', 'product', 'Partnership with AWS Marketplace announced', 'medium', '1w ago', now() - interval '7 days'),
  -- Attio signals
  (3, 'Attio', 'product', 'Added Enterprise pricing tier to website', 'medium', '8h ago', now() - interval '8 hours'),
  (3, 'Attio', 'hiring', 'Hired Head of Revenue from Notion', 'high', '3d ago', now() - interval '3 days'),
  (3, 'Attio', 'traffic', 'API docs page views up 240%', 'medium', '5d ago', now() - interval '5 days'),
  (3, 'Attio', 'product', 'Launched Salesforce migration tool', 'medium', '2w ago', now() - interval '14 days'),
  -- Causal signals
  (4, 'Causal', 'event', 'CTO confirmed as speaker at CFO Summit 2026', 'low', '2d ago', now() - interval '2 days'),
  (4, 'Causal', 'product', 'Launched integrations with NetSuite and Xero', 'medium', '5d ago', now() - interval '5 days'),
  (4, 'Causal', 'hiring', '4 senior finance hires from Stripe and Brex', 'medium', '1w ago', now() - interval '7 days'),
  -- Perplexity signals
  (5, 'Perplexity', 'hiring', 'Posted 12 ML engineering roles in 48 hours', 'high', '2h ago', now() - interval '2 hours'),
  (5, 'Perplexity', 'product', 'Shipped 6 new API endpoints to developer docs', 'medium', '1d ago', now() - interval '1 day'),
  (5, 'Perplexity', 'traffic', 'Enterprise plan page views up 5x this week', 'high', '3d ago', now() - interval '3 days'),
  (5, 'Perplexity', 'product', 'Mobile app hit #1 in Productivity on App Store', 'high', '1w ago', now() - interval '7 days'),
  -- Coda signals
  (6, 'Coda', 'product', 'Launched AI doc assistant in beta', 'medium', '3d ago', now() - interval '3 days'),
  (6, 'Coda', 'traffic', 'Enterprise customer count crossed 2,500', 'medium', '1w ago', now() - interval '7 days'),
  (6, 'Coda', 'hiring', 'Hired VP of AI from Google DeepMind', 'high', '2w ago', now() - interval '14 days');

-- Activity feed signals (investor-related, no company_id)
INSERT INTO signals (company_id, co_name, type, text, severity, time_label, created_at) VALUES
  (NULL, 'Benchmark', 'investor', 'Partner visited Supabase Singapore office (LinkedIn check-in)', 'low', '12h ago', now() - interval '12 hours');

-- ============================================================
-- INVESTORS
-- ============================================================
INSERT INTO investors (id, name, type, initials, badge_label, badge_class) VALUES
  (1, 'Benchmark', 'Tier 1 VC · San Francisco', 'BM', 'Actively Deploying', 'tg'),
  (2, 'a16z Growth', 'Multi-stage · Menlo Park', 'A6', 'High Velocity', 'tg'),
  (3, 'Slow Ventures', 'Micro VC · Remote-first', 'SV', 'Selective', 'ta'),
  (4, 'General Catalyst', 'Multi-stage · Cambridge', 'GC', 'Active', 'tg');

SELECT setval('investors_id_seq', 4);

-- Investor stats
INSERT INTO investor_stats (investor_id, label, value) VALUES
  (1, 'Active Deals', '3'), (1, 'Avg Check', '$8M'), (1, 'Last Deal', '14d'),
  (2, 'Active Deals', '6'), (2, 'Avg Check', '$25M'), (2, 'Last Deal', '3d'),
  (3, 'Active Deals', '1'), (3, 'Avg Check', '$250K'), (3, 'Last Deal', '42d'),
  (4, 'Active Deals', '4'), (4, 'Avg Check', '$15M'), (4, 'Last Deal', '8d');

-- Investor focus
INSERT INTO investor_focus (investor_id, label, css_class) VALUES
  (1, 'Dev Tools', 'tm'), (1, 'AI', 'tm'),
  (2, 'AI', 'tm'), (2, 'Enterprise', 'tm'),
  (3, 'Consumer', 'tm'), (3, 'DTC', 'tm'),
  (4, 'Health', 'tm'), (4, 'Climate', 'tm');

-- Investor activity (12-month)
INSERT INTO investor_activity (investor_id, month_idx, value) VALUES
  (1,0,3),(1,1,5),(1,2,4),(1,3,7),(1,4,6),(1,5,8),(1,6,9),(1,7,7),(1,8,8),(1,9,10),(1,10,9),(1,11,8),
  (2,0,6),(2,1,8),(2,2,9),(2,3,8),(2,4,10),(2,5,9),(2,6,8),(2,7,10),(2,8,9),(2,9,10),(2,10,9),(2,11,10),
  (3,0,7),(3,1,4),(3,2,3),(3,3,2),(3,4,5),(3,5,3),(3,6,2),(3,7,1),(3,8,4),(3,9,2),(3,10,3),(3,11,1),
  (4,0,5),(4,1,6),(4,2,7),(4,3,8),(4,4,6),(4,5,7),(4,6,8),(4,7,9),(4,8,7),(4,9,8),(4,10,9),(4,11,8);

-- ============================================================
-- TICKER DATA
-- ============================================================
INSERT INTO ticker_data (name, value, delta, is_up, sort_order) VALUES
  ('Deel', '$12.4B', '+4.2%', true, 0),
  ('Harvey AI', '$1.5B', '+31%', true, 1),
  ('Rippling', '$13.5B', '+2.8%', true, 2),
  ('Supabase', '$200M', '+18%', true, 3),
  ('Anduril', '$8.5B', '-1.2%', false, 4),
  ('Figma', '$20B', '+5.7%', true, 5),
  ('Linear', '$800M', '+12%', true, 6),
  ('Scale AI', '$13.8B', '+8.6%', true, 7),
  ('Vercel', '$3.25B', '+7.4%', true, 8),
  ('Perplexity', '$9B', '+22%', true, 9);

-- ============================================================
-- SIGNAL OF THE DAY
-- ============================================================
INSERT INTO signal_of_the_day (company_id, name, italic, description, tags, sigs, scores) VALUES
  (1, 'Amplemarket', 'pre-raise',
   'AI-native sales platform replacing legacy outbound stacks. Hiring velocity up 340% in 60 days — 11 senior AEs and 4 ML engineers added. Web traffic surged 180% in Q1. Three enterprise contract wins surfaced in public LinkedIn activity.',
   '[{"l":"Pre-Raise Signal","t":"tg"},{"l":"Hiring +340%","t":"ta"},{"l":"Traffic +180%","t":"tb"}]'::jsonb,
   '[{"l":"Momentum","v":"94/100","c":"sv-i"},{"l":"Hiring Δ","v":"+340%","c":"sv-g"},{"l":"Traffic Δ","v":"+180%","c":"sv-g"},{"l":"Raise ETA","v":"~60d","c":"sv-a"}]'::jsonb,
   '[{"n":"Hiring Signal","s":9.4,"c":"sf-g"},{"n":"Traffic Growth","s":8.1,"c":"sf-g"},{"n":"Funding Proximity","s":8.8,"c":"sf-g"},{"n":"Category Strength","s":7.2,"c":"sf-a"},{"n":"Team Quality","s":9.0,"c":"sf-g"}]'::jsonb
  );
