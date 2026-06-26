-- Helper function to increment a value (used by view tracking fallback)
CREATE OR REPLACE FUNCTION increment(x int)
RETURNS int LANGUAGE sql IMMUTABLE AS $$ SELECT x + 1 $$;

-- RPC function to increment article views by slug
CREATE OR REPLACE FUNCTION increment_article_views(article_slug text)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE articles SET views = COALESCE(views, 0) + 1 WHERE slug = article_slug;
END;
$$;
