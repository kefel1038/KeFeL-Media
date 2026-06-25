-- Migration 004: Create newsletter subscribers and campaigns tables
-- Run this in Supabase Dashboard SQL Editor

CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT DEFAULT '',
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  source TEXT DEFAULT 'website'
);

CREATE TABLE IF NOT EXISTS newsletter_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'scheduled')),
  recipient_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed sample subscribers
INSERT INTO subscribers (email, name, source) VALUES
  ('reader1@example.com', 'John Doe', 'website'),
  ('reader2@example.com', 'Jane Smith', 'website'),
  ('reader3@example.com', 'Bob Johnson', 'referral')
ON CONFLICT (email) DO NOTHING;

-- Seed sample campaigns
INSERT INTO newsletter_campaigns (subject, content, status, sent_at, recipient_count, opened_count, clicked_count) VALUES
  ('Weekly Digest: Top Stories This Week', '<h2>This Week in Review</h2><p>Top stories from KeFeL Media.</p>', 'sent', NOW() - INTERVAL '2 days', 452, 234, 89),
  ('Breaking: Uganda''s New Policy Changes', '<h2>Policy Update</h2><p>Key policy changes announced.</p>', 'sent', NOW() - INTERVAL '7 days', 448, 312, 145),
  ('Special Report: Technology in Africa', '<h2>Tech Africa</h2><p>Technology transforming the continent.</p>', 'sent', NOW() - INTERVAL '14 days', 440, 198, 67)
ON CONFLICT DO NOTHING;

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access to subscribers"
ON subscribers FOR ALL TO authenticated
USING (true) WITH CHECK (true);

CREATE POLICY "Service role has full access to campaigns"
ON newsletter_campaigns FOR ALL TO authenticated
USING (true) WITH CHECK (true);
