-- Migration 008: Add alt_text column for article images
-- Run this in Supabase Dashboard SQL Editor

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS alt_text TEXT DEFAULT '';
