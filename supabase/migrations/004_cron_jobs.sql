-- Phase 2: pg_cron scheduling for automated data ingestion
-- ============================================================
-- Prerequisites: pg_cron and pg_net extensions (enabled via Supabase dashboard)
-- The service_role_key must be stored in vault before running cron jobs.
--
-- To store the key, run this in the SQL editor (replace YOUR_SERVICE_ROLE_KEY):
--   SELECT vault.create_secret('YOUR_SERVICE_ROLE_KEY', 'service_role_key', 'Supabase service role key for Edge Function auth');
--
-- To enable pg_net, go to Database > Extensions in the Supabase dashboard.
-- ============================================================

-- Enable extensions (pg_cron is already enabled on Supabase)
CREATE EXTENSION IF NOT EXISTS pg_net SCHEMA extensions;

-- Add unique constraint on ticker_data.name for upsert support
ALTER TABLE ticker_data ADD CONSTRAINT ticker_data_name_key UNIQUE (name);

-- ============================================================
-- Helper function to invoke Edge Functions via pg_net
-- ============================================================
CREATE OR REPLACE FUNCTION invoke_edge_function(function_name TEXT)
RETURNS void AS $$
DECLARE
  service_key TEXT;
  base_url TEXT := 'https://rpbwayhyrbiinsqwgbaq.supabase.co';
BEGIN
  -- Get service role key from vault
  SELECT decrypted_secret INTO service_key
  FROM vault.decrypted_secrets
  WHERE name = 'service_role_key'
  LIMIT 1;

  IF service_key IS NULL THEN
    RAISE WARNING 'service_role_key not found in vault — skipping %', function_name;
    RETURN;
  END IF;

  PERFORM net.http_post(
    url := base_url || '/functions/v1/' || function_name,
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || service_key,
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- CRON JOBS (staggered to avoid simultaneous invocations)
-- ============================================================

-- Hacker News ingestion: every 2 hours at :10
SELECT cron.schedule(
  'ingest-hn',
  '10 */2 * * *',
  $$SELECT invoke_edge_function('ingest-hn')$$
);

-- GitHub ingestion: every 6 hours at :20
SELECT cron.schedule(
  'ingest-github',
  '20 */6 * * *',
  $$SELECT invoke_edge_function('ingest-github')$$
);

-- Compute scores: every 2 hours at :30 (after ingestion)
SELECT cron.schedule(
  'compute-scores',
  '30 */2 * * *',
  $$SELECT invoke_edge_function('compute-scores')$$
);

-- Signal of the Day: daily at 6:00 AM
SELECT cron.schedule(
  'select-sotd',
  '0 6 * * *',
  $$SELECT invoke_edge_function('select-sotd')$$
);
