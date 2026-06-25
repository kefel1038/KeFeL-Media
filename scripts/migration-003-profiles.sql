-- Migration 003: Create profiles table for user roles and permissions
-- Run this in Supabase Dashboard SQL Editor

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'editor', 'journalist', 'photographer', 'social_manager')),
  avatar TEXT DEFAULT '',
  article_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default admin user
INSERT INTO profiles (username, email, display_name, role, status)
VALUES ('admin', 'admin@kefelmedia.com', 'Admin User', 'super_admin', 'active')
ON CONFLICT (username) DO NOTHING;

-- Seed sample team
INSERT INTO profiles (username, email, display_name, role, status) VALUES
  ('sarah', 'sarah@kefelmedia.com', 'Sarah Williams', 'editor', 'active'),
  ('james', 'james@kefelmedia.com', 'James Mukasa', 'journalist', 'active'),
  ('grace', 'grace@kefelmedia.com', 'Grace Nakato', 'journalist', 'active'),
  ('peter', 'peter@kefelmedia.com', 'Peter Okello', 'photographer', 'inactive')
ON CONFLICT (username) DO NOTHING;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for admin API calls)
CREATE POLICY "Service role has full access"
ON profiles FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
