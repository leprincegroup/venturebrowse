-- 007_user_management.sql
-- User management: roles, subscriptions, admin privileges

-- Add subscription and role fields to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'founder'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Index for quick admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_admin ON profiles(is_admin) WHERE is_admin = true;
CREATE INDEX IF NOT EXISTS idx_profiles_tier ON profiles(subscription_tier);

-- RLS: Users can read their own profile, admins can read all
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ));

-- RLS: Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS: Admins can update any profile
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
CREATE POLICY "Admins can update any profile" ON profiles
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true
  ));

-- Admin view: list all users with their subscription status
CREATE OR REPLACE VIEW admin_users AS
SELECT
  p.id,
  p.email,
  p.name,
  p.role,
  p.subscription_tier,
  p.subscription_expires_at,
  p.is_admin,
  p.created_at,
  (SELECT count(*) FROM news_articles) AS total_news,
  (SELECT count(*) FROM companies WHERE status = 'active') AS total_companies
FROM profiles p
ORDER BY p.created_at DESC;

-- Function to set a user as admin by email
CREATE OR REPLACE FUNCTION make_admin(admin_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE profiles SET is_admin = true, role = 'admin', subscription_tier = 'pro'
  WHERE email = admin_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to set subscription tier
CREATE OR REPLACE FUNCTION set_subscription(user_email TEXT, tier TEXT, expires_at TIMESTAMPTZ DEFAULT NULL)
RETURNS void AS $$
BEGIN
  UPDATE profiles SET subscription_tier = tier, subscription_expires_at = expires_at
  WHERE email = user_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user is admin (callable from frontend)
CREATE OR REPLACE FUNCTION is_current_user_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Function to get current user's subscription
CREATE OR REPLACE FUNCTION get_my_subscription()
RETURNS TABLE(tier TEXT, expires_at TIMESTAMPTZ, is_admin BOOLEAN) AS $$
BEGIN
  RETURN QUERY SELECT subscription_tier, subscription_expires_at, profiles.is_admin
  FROM profiles WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
