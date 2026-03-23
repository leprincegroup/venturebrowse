-- 006_data_cron_schedule.sql
-- Cron jobs for data collection Edge Functions
-- Uses pg_cron + pg_net to invoke Supabase Edge Functions

-- Helper: RPC to increment budget counter
CREATE OR REPLACE FUNCTION increment_budget(p_source TEXT, p_period TEXT, p_date TEXT, p_amount INT DEFAULT 1)
RETURNS void AS $$
BEGIN
  UPDATE api_token_budgets
  SET used = used + p_amount
  WHERE source = p_source AND period = p_period AND period_start = p_date::DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper: RPC to refresh company_dashboard materialized view
CREATE OR REPLACE FUNCTION refresh_dashboard()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY company_dashboard;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper: Reset daily budgets at midnight
CREATE OR REPLACE FUNCTION reset_daily_budgets()
RETURNS void AS $$
BEGIN
  INSERT INTO api_token_budgets (source, period, budget_limit, used, period_start)
  SELECT source, period, budget_limit, 0, CURRENT_DATE
  FROM api_token_budgets
  WHERE period = 'daily'
    AND period_start = CURRENT_DATE - 1
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- CRON SCHEDULE
-- All times in UTC, staggered to avoid concurrent execution
-- ============================================================

-- Daily: Reset budget counters at midnight
SELECT cron.schedule('reset-daily-budgets', '0 0 * * *',
  $$SELECT reset_daily_budgets()$$
);

-- Daily 7AM UTC: Social media (Instagram + TikTok via RapidAPI)
SELECT cron.schedule('ingest-social', '0 7 * * *',
  $$SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/ingest-social',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.service_role_key'))
  )$$
);

-- Daily 8AM UTC: Reddit mentions
SELECT cron.schedule('ingest-reddit', '0 8 * * *',
  $$SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/ingest-reddit',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.service_role_key'))
  )$$
);

-- Daily 9AM UTC: Google News RSS
SELECT cron.schedule('ingest-news', '0 9 * * *',
  $$SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/ingest-news',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.service_role_key'))
  )$$
);

-- Weekly Monday 3AM UTC: Traffic data (Tranco + SimilarWeb)
SELECT cron.schedule('ingest-traffic', '0 3 * * 1',
  $$SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/ingest-traffic',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.service_role_key'))
  )$$
);

-- Weekly Tuesday 3AM UTC: Meta Ad Library
SELECT cron.schedule('ingest-ads', '0 3 * * 2',
  $$SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/ingest-ads',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.service_role_key'))
  )$$
);

-- Weekly Wednesday 3AM UTC: Trustpilot reviews
SELECT cron.schedule('ingest-reviews', '0 3 * * 3',
  $$SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/ingest-reviews',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.service_role_key'))
  )$$
);

-- Weekly Thursday 3AM UTC: Google Trends
SELECT cron.schedule('ingest-trends', '0 3 * * 4',
  $$SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/ingest-trends',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.service_role_key'))
  )$$
);

-- Weekly Friday 3AM UTC: AI community summaries
SELECT cron.schedule('compute-summaries', '0 3 * * 5',
  $$SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/compute-summaries',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.service_role_key'))
  )$$
);

-- Monthly 1st at 2AM UTC: Company enrichment (Crunchbase + Wappalyzer)
SELECT cron.schedule('ingest-company', '0 2 1 * *',
  $$SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/ingest-company',
    headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.service_role_key'))
  )$$
);
