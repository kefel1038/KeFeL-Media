-- Migration 012: Performance Indexes for AI Newsroom Schema
-- Run this AFTER migration-010-full-schema.sql

-- 1. Indexes for articles table enhancements
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_scheduled_at ON articles(scheduled_at) WHERE scheduled_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_articles_language ON articles(language);
CREATE INDEX IF NOT EXISTS idx_articles_verification_status ON articles(verification_status);
CREATE INDEX IF NOT EXISTS idx_articles_is_premium ON articles(is_premium);
CREATE INDEX IF NOT EXISTS idx_articles_word_count ON articles(word_count);

-- Composite index for feed queries (status + published_at)
CREATE INDEX IF NOT EXISTS idx_articles_status_published ON articles(status, published_at DESC);

-- 2. Indexes for categories
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_categories_is_visible ON categories(is_visible);

-- 3. Indexes for news sources
CREATE INDEX IF NOT EXISTS idx_news_sources_is_active ON news_sources(is_active);
CREATE INDEX IF NOT EXISTS idx_news_sources_health ON news_sources(health_status);

-- 4. Indexes for news source items
CREATE INDEX IF NOT EXISTS idx_news_source_items_fingerprint ON news_source_items(fingerprint);
CREATE INDEX IF NOT EXISTS idx_news_source_items_is_processed ON news_source_items(is_processed);
CREATE INDEX IF NOT EXISTS idx_news_source_items_published ON news_source_items(published_at DESC);

-- 5. Indexes for trending topics
CREATE INDEX IF NOT EXISTS idx_trending_topics_viral_score ON trending_topics(viral_score DESC);
CREATE INDEX IF NOT EXISTS idx_trending_topics_is_active ON trending_topics(is_active);
CREATE INDEX IF NOT EXISTS idx_trending_topics_region ON trending_topics(region);
CREATE INDEX IF NOT EXISTS idx_trending_topics_topic ON trending_topics(topic);

-- 6. Indexes for verification records
CREATE INDEX IF NOT EXISTS idx_verification_records_article_id ON verification_records(article_id);
CREATE INDEX IF NOT EXISTS idx_verification_records_status ON verification_records(status);

-- 7. Indexes for translations
CREATE INDEX IF NOT EXISTS idx_translations_article_id ON translations(article_id);
CREATE INDEX IF NOT EXISTS idx_translations_language ON translations(language_code);
CREATE INDEX IF NOT EXISTS idx_translations_status ON translations(status);

-- 8. Indexes for social posts
CREATE INDEX IF NOT EXISTS idx_social_posts_article_id ON social_posts(article_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON social_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_posts(status);
CREATE INDEX IF NOT EXISTS idx_social_posts_scheduled_at ON social_posts(scheduled_at) WHERE scheduled_at IS NOT NULL;

-- 9. Indexes for bookmarks
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_article_id ON bookmarks(article_id);

-- 10. Indexes for user preferences
CREATE INDEX IF NOT EXISTS idx_user_preferences_language ON user_preferences(language);

-- 11. Indexes for comments_v2
CREATE INDEX IF NOT EXISTS idx_comments_v2_article_id ON comments_v2(article_id);
CREATE INDEX IF NOT EXISTS idx_comments_v2_user_id ON comments_v2(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_v2_parent_id ON comments_v2(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_comments_v2_status ON comments_v2(status);

-- 12. Indexes for article reactions
CREATE INDEX IF NOT EXISTS idx_article_reactions_article_id ON article_reactions(article_id);
CREATE INDEX IF NOT EXISTS idx_article_reactions_user_id ON article_reactions(user_id);

-- 13. Indexes for audit log
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_created ON audit_log(created_at DESC);

-- 14. Indexes for article versions
CREATE INDEX IF NOT EXISTS idx_article_versions_article_id ON article_versions(article_id);
CREATE INDEX IF NOT EXISTS idx_article_versions_created ON article_versions(created_at DESC);

-- 15. Indexes for media assets
CREATE INDEX IF NOT EXISTS idx_media_assets_file_type ON media_assets(file_type);
CREATE INDEX IF NOT EXISTS idx_media_assets_ai_generated ON media_assets(ai_generated);
CREATE INDEX IF NOT EXISTS idx_media_assets_uploaded_by ON media_assets(uploaded_by);

-- 16. Indexes for ad placements
CREATE INDEX IF NOT EXISTS idx_ad_placements_is_active ON ad_placements(is_active);
CREATE INDEX IF NOT EXISTS idx_ad_placements_position ON ad_placements(position);

-- 17. Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_target_user ON notifications(target_user_id) WHERE target_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled_at ON notifications(scheduled_at) WHERE scheduled_at IS NOT NULL;

-- 18. Indexes for analytics events
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_article ON analytics_events(article_id) WHERE article_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at DESC);

-- 19. Indexes for knowledge base
CREATE INDEX IF NOT EXISTS idx_knowledge_base_type ON knowledge_base(document_type);

-- 20. Indexes for AI agent logs
CREATE INDEX IF NOT EXISTS idx_ai_agent_logs_agent ON ai_agent_logs(agent_name);
CREATE INDEX IF NOT EXISTS idx_ai_agent_logs_success ON ai_agent_logs(success);
CREATE INDEX IF NOT EXISTS idx_ai_agent_logs_flagged ON ai_agent_logs(flagged_for_review) WHERE flagged_for_review = true;
CREATE INDEX IF NOT EXISTS idx_ai_agent_logs_created ON ai_agent_logs(created_at DESC);

-- 21. Indexes for investigation workspace
CREATE INDEX IF NOT EXISTS idx_investigation_ws_status ON investigation_workspaces(status);
CREATE INDEX IF NOT EXISTS idx_investigation_docs_ws ON investigation_documents(workspace_id);

-- 22. Indexes for podcast episodes
CREATE INDEX IF NOT EXISTS idx_podcast_published ON podcast_episodes(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_podcast_article ON podcast_episodes(article_id) WHERE article_id IS NOT NULL;

-- 23. Indexes for video assets
CREATE INDEX IF NOT EXISTS idx_video_status ON video_assets(status);
CREATE INDEX IF NOT EXISTS idx_video_article ON video_assets(article_id) WHERE article_id IS NOT NULL;

-- 24. Indexes for public API keys
CREATE INDEX IF NOT EXISTS idx_api_keys_key ON public_api_keys(api_key);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON public_api_keys(is_active);

-- 25. Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_articles_title_gin ON articles USING gin(to_tsvector('english', coalesce(title, '')));
CREATE INDEX IF NOT EXISTS idx_articles_excerpt_gin ON articles USING gin(to_tsvector('english', coalesce(excerpt, '')));
CREATE INDEX IF NOT EXISTS idx_news_source_items_title_gin ON news_source_items USING gin(to_tsvector('english', coalesce(title, '')));
