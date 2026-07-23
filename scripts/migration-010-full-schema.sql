-- Migration 010: Full Schema Expansion for AI Newsroom
-- Run this in Supabase Dashboard SQL Editor

-- 1. Modify Existing Tables

-- Articles Table Enhancements
ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS meta_description TEXT,
  ADD COLUMN IF NOT EXISTS seo_keywords TEXT[],
  ADD COLUMN IF NOT EXISTS og_image TEXT,
  ADD COLUMN IF NOT EXISTS json_ld JSONB,
  ADD COLUMN IF NOT EXISTS ai_draft_id UUID,
  ADD COLUMN IF NOT EXISTS ai_confidence INTEGER,
  ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'unconfirmed' CHECK (verification_status IN ('verified', 'developing', 'unconfirmed', 'opinion', 'analysis')),
  ADD COLUMN IF NOT EXISTS verification_score INTEGER,
  ADD COLUMN IF NOT EXISTS editor_notes TEXT,
  ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS original_article_id BIGINT REFERENCES articles(id),
  ADD COLUMN IF NOT EXISTS reading_level TEXT,
  ADD COLUMN IF NOT EXISTS summary_short TEXT,
  ADD COLUMN IF NOT EXISTS summary_medium TEXT,
  ADD COLUMN IF NOT EXISTS summary_full TEXT,
  ADD COLUMN IF NOT EXISTS timeline JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS source_urls TEXT[],
  ADD COLUMN IF NOT EXISTS background TEXT,
  ADD COLUMN IF NOT EXISTS related_laws JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS expert_opinions JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS seo_score INTEGER,
  ADD COLUMN IF NOT EXISTS readability_score INTEGER,
  ADD COLUMN IF NOT EXISTS internal_links TEXT[],
  ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_sponsored BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS sponsor_name TEXT,
  ADD COLUMN IF NOT EXISTS word_count INTEGER;

-- Categories Table Enhancements
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS icon TEXT,
  ADD COLUMN IF NOT EXISTS accent_color TEXT,
  ADD COLUMN IF NOT EXISTS parent_id BIGINT REFERENCES categories(id),
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true;

-- Profiles Table Enhancements (Admin users)
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS byline_name TEXT,
  ADD COLUMN IF NOT EXISTS expertise_areas TEXT[];

-- 2. New Tables

-- News Sources
CREATE TABLE IF NOT EXISTS news_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('rss', 'api', 'social', 'web')),
  region TEXT,
  topic TEXT,
  is_active BOOLEAN DEFAULT true,
  health_status TEXT DEFAULT 'healthy',
  last_fetched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- News Source Items (Raw Fetched Items)
CREATE TABLE IF NOT EXISTS news_source_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES news_sources(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  content TEXT,
  author TEXT,
  published_at TIMESTAMPTZ,
  fingerprint TEXT, -- For deduplication
  is_processed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trending Topics
CREATE TABLE IF NOT EXISTS trending_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT,
  viral_score INTEGER DEFAULT 0,
  importance INTEGER DEFAULT 0,
  urgency INTEGER DEFAULT 0,
  region TEXT,
  topic TEXT,
  source_item_ids UUID[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verification Records
CREATE TABLE IF NOT EXISTS verification_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id BIGINT REFERENCES articles(id) ON DELETE CASCADE,
  claim TEXT NOT NULL,
  status TEXT CHECK (status IN ('true', 'false', 'partially_true', 'unverified')),
  sources JSONB DEFAULT '[]'::jsonb,
  reasoning TEXT,
  verified_by TEXT, -- agent name or user ID
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Translations
CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id BIGINT REFERENCES articles(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(article_id, language_code)
);

-- Social Posts
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id BIGINT REFERENCES articles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'twitter', 'linkedin', 'threads', 'telegram', 'whatsapp', 'instagram')),
  content TEXT NOT NULL,
  hashtags TEXT[],
  image_url TEXT,
  preview_url TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reader Accounts (Backed by Supabase Auth)
CREATE TABLE IF NOT EXISTS reader_accounts (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reader Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES reader_accounts(id) ON DELETE CASCADE,
  language TEXT DEFAULT 'en',
  theme TEXT DEFAULT 'system',
  preferred_categories TEXT[],
  region TEXT,
  notification_settings JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES reader_accounts(id) ON DELETE CASCADE,
  article_id BIGINT REFERENCES articles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

-- Comments V2
CREATE TABLE IF NOT EXISTS comments_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id BIGINT REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES reader_accounts(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES comments_v2(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')),
  toxicity_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Article Reactions
CREATE TABLE IF NOT EXISTS article_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id BIGINT REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES reader_accounts(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL, -- e.g., 'like', 'love', 'fire', 'sad', 'wow'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(article_id, user_id, reaction_type)
);

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, -- Can be from profiles or null for AI/System
  user_type TEXT, -- 'admin', 'ai', 'system'
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Article Versions
CREATE TABLE IF NOT EXISTS article_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id BIGINT REFERENCES articles(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT,
  excerpt TEXT,
  modified_by UUID, -- Profile ID
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media Assets
CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'image', 'video', 'audio', 'document'
  mime_type TEXT,
  size_bytes BIGINT,
  alt_text TEXT,
  caption TEXT,
  credit TEXT,
  ai_generated BOOLEAN DEFAULT false,
  ai_prompt TEXT,
  uploaded_by UUID, -- Profile ID
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ad Placements
CREATE TABLE IF NOT EXISTS ad_placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  target_url TEXT NOT NULL,
  position TEXT NOT NULL, -- 'header', 'sidebar', 'in_article'
  categories TEXT[],
  regions TEXT[],
  is_active BOOLEAN DEFAULT true,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'push', 'email', 'telegram'
  title TEXT,
  message TEXT NOT NULL,
  target_url TEXT,
  target_user_id UUID REFERENCES reader_accounts(id), -- Null for broadcast
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics Events
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- 'page_view', 'article_read', 'share', 'click'
  article_id BIGINT REFERENCES articles(id),
  user_id UUID REFERENCES reader_accounts(id),
  session_id TEXT,
  device_type TEXT,
  location TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge Base (RAG)
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  document_type TEXT NOT NULL, -- 'article', 'style_guide', 'policy', 'report'
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Agent Logs
CREATE TABLE IF NOT EXISTS ai_agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  input_data JSONB,
  output_data JSONB,
  success BOOLEAN,
  confidence INTEGER,
  flagged_for_review BOOLEAN DEFAULT false,
  reasoning TEXT,
  tokens_used INTEGER,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investigation Workspaces
CREATE TABLE IF NOT EXISTS investigation_workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'published')),
  lead_reporter UUID, -- Profile ID
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investigation Documents
CREATE TABLE IF NOT EXISTS investigation_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES investigation_workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  file_url TEXT,
  document_type TEXT, -- 'note', 'pdf', 'image', 'link', 'audio'
  created_by UUID, -- Profile ID
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Podcast Episodes
CREATE TABLE IF NOT EXISTS podcast_episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT NOT NULL,
  duration_seconds INTEGER,
  article_id BIGINT REFERENCES articles(id),
  is_ai_generated BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Video Assets
CREATE TABLE IF NOT EXISTS video_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  platform_format TEXT, -- 'youtube_shorts', 'tiktok', 'instagram_reels'
  article_id BIGINT REFERENCES articles(id),
  is_ai_generated BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'processing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter Templates
CREATE TABLE IF NOT EXISTS newsletter_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject_template TEXT NOT NULL,
  html_template TEXT NOT NULL,
  frequency TEXT, -- 'daily_morning', 'weekly', etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Public API Keys
CREATE TABLE IF NOT EXISTS public_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_name TEXT NOT NULL,
  api_key TEXT UNIQUE NOT NULL,
  rate_limit_per_minute INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

-- Helper to enable RLS and add service role policy
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN (
            'news_sources', 'news_source_items', 'trending_topics', 'verification_records',
            'translations', 'social_posts', 'reader_accounts', 'user_preferences', 'bookmarks',
            'comments_v2', 'article_reactions', 'audit_log', 'article_versions', 'media_assets',
            'ad_placements', 'notifications', 'analytics_events', 'knowledge_base', 'ai_agent_logs',
            'investigation_workspaces', 'investigation_documents', 'podcast_episodes', 'video_assets',
            'newsletter_templates', 'public_api_keys'
        )
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
        EXECUTE format('DROP POLICY IF EXISTS "Service role has full access" ON %I;', t);
        EXECUTE format('CREATE POLICY "Service role has full access" ON %I FOR ALL USING (auth.role() = ''service_role'') WITH CHECK (auth.role() = ''service_role'');', t);
    END LOOP;
END $$;
