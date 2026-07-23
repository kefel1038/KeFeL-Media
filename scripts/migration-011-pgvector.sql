-- Migration 011: pgvector Setup for AI Newsroom
-- Run this in Supabase Dashboard SQL Editor AFTER migration 010

-- Enable the pgvector extension to work with embedding vectors
CREATE EXTENSION IF NOT EXISTS vector;

-- Create a separate table for knowledge embeddings for semantic search (RAG)
CREATE TABLE IF NOT EXISTS knowledge_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_id UUID REFERENCES knowledge_base(id) ON DELETE CASCADE,
  content TEXT NOT NULL, -- Chunk of text
  embedding vector(1536), -- 1536 dimensions for OpenAI text-embedding-3-small
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE knowledge_embeddings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role has full access" ON knowledge_embeddings;
CREATE POLICY "Service role has full access" ON knowledge_embeddings 
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- Create an index for fast cosine similarity search
CREATE INDEX IF NOT EXISTS knowledge_embeddings_embedding_idx ON knowledge_embeddings 
  USING hnsw (embedding vector_cosine_ops);

-- Add embedding column to articles for semantic dedup / related articles
ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Create an index on articles for fast similarity search
CREATE INDEX IF NOT EXISTS articles_embedding_idx ON articles 
  USING hnsw (embedding vector_cosine_ops);

-- Optional: Create a function to match documents based on similarity (for RAG)
CREATE OR REPLACE FUNCTION match_knowledge_documents (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id UUID,
  knowledge_id UUID,
  content TEXT,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    knowledge_embeddings.id,
    knowledge_embeddings.knowledge_id,
    knowledge_embeddings.content,
    1 - (knowledge_embeddings.embedding <=> query_embedding) AS similarity
  FROM knowledge_embeddings
  WHERE 1 - (knowledge_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY knowledge_embeddings.embedding <=> query_embedding
  LIMIT match_count;
$$;
