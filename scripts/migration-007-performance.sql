-- Migration 007: Performance optimizations

-- Index for fast slug lookups (used on article page and metadata generation)
CREATE INDEX IF NOT EXISTS articles_slug_idx ON articles(slug);

-- Index for category-based queries (used on category pages and related articles)
CREATE INDEX IF NOT EXISTS articles_category_idx ON articles(category);

-- Composite index for published articles sorted by date (used on homepage feeds)
CREATE INDEX IF NOT EXISTS articles_published_feed_idx ON articles(status, published_at DESC)
  WHERE status = 'published';

-- Index for trending/featured queries
CREATE INDEX IF NOT EXISTS articles_trending_idx ON articles(trending, views DESC)
  WHERE trending = true AND status = 'published';
