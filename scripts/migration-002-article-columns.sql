-- Migration 002: Add article columns for highlights, template, image metadata
-- Run this in Supabase Dashboard SQL Editor

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS article_type TEXT DEFAULT 'news',
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS template TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS image_caption TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS image_credit TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS secondary_image TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS secondary_image_caption TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
