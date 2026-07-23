// Knowledge Base (RAG) Service
// Handles document ingestion, embedding, and retrieval for RAG

import { createClient } from '@supabase/supabase-js';
import type { KnowledgeDocument, KnowledgeQuery, KnowledgeSearchResult } from '../types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Document chunking configuration
const CHUNK_CONFIG = {
  maxChunkSize: 1000, // characters
  chunkOverlap: 200, // overlap between chunks
  minChunkSize: 100, // minimum chunk size
};

// Embedding configuration
const EMBEDDING_CONFIG = {
  model: 'text-embedding-3-small',
  dimensions: 1536,
};

export class KnowledgeBase {
  /**
   * Chunk a document into smaller pieces for embedding
   */
  chunkDocument(content: string): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < content.length) {
      let end = start + CHUNK_CONFIG.maxChunkSize;

      // Try to break at a sentence boundary
      if (end < content.length) {
        const lastPeriod = content.lastIndexOf('.', end);
        const lastNewline = content.lastIndexOf('\n', end);
        const breakPoint = Math.max(lastPeriod, lastNewline);

        if (breakPoint > start + CHUNK_CONFIG.minChunkSize) {
          end = breakPoint + 1;
        }
      }

      const chunk = content.slice(start, end).trim();
      if (chunk.length >= CHUNK_CONFIG.minChunkSize) {
        chunks.push(chunk);
      }

      start = end - CHUNK_CONFIG.chunkOverlap;
    }

    return chunks;
  }

  /**
   * Generate embeddings for text using OpenAI
   */
  async generateEmbedding(text: string): Promise<number[]> {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: EMBEDDING_CONFIG.model,
        input: text,
        dimensions: EMBEDDING_CONFIG.dimensions,
      }),
    });

    if (!response.ok) {
      throw new Error(`Embedding generation failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  }

  /**
   * Ingest a document into the knowledge base
   */
  async ingestDocument(doc: Omit<KnowledgeDocument, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    // Chunk the document
    const chunks = this.chunkDocument(doc.content);

    const documentIds: string[] = [];

    for (const chunk of chunks) {
      // Generate embedding
      const embedding = await this.generateEmbedding(chunk);

      // Insert into database
      const { data, error } = await supabase
        .from('knowledge_documents')
        .insert({
          title: doc.title,
          content: chunk,
          document_type: doc.documentType,
          source_url: doc.sourceUrl,
          metadata: {
            ...doc.metadata,
            originalTitle: doc.title,
            chunkIndex: documentIds.length,
            totalChunks: chunks.length,
          },
          embedding: embedding as unknown as string,
        })
        .select('id')
        .single();

      if (error) {
        throw new Error(`Failed to ingest document chunk: ${error.message}`);
      }

      documentIds.push(data.id);
    }

    return documentIds[0]; // Return first chunk ID
  }

  /**
   * Search the knowledge base using semantic similarity
   */
  async search(query: KnowledgeQuery): Promise<KnowledgeSearchResult[]> {
    // Generate query embedding
    const queryEmbedding = query.embedding || await this.generateEmbedding(query.query);

    // Use pgvector similarity search
    const { data, error } = await supabase.rpc('match_knowledge', {
      query_embedding: queryEmbedding,
      match_count: query.matchCount || 5,
      match_threshold: query.matchThreshold || 0.7,
    });

    if (error) {
      throw new Error(`Knowledge search failed: ${error.message}`);
    }

    return data.map((result: any) => ({
      document: {
        id: result.id,
        title: result.title,
        content: result.content,
        documentType: result.document_type,
        metadata: result.metadata || {},
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      },
      similarity: result.similarity,
      relevanceScore: this.calculateRelevanceScore(result.similarity, result.document_type),
    }));
  }

  /**
   * Search with keyword filtering
   */
  async searchWithFilters(
    query: string,
    filters: {
      documentType?: string;
      sourceUrl?: string;
      dateRange?: { start: string; end: string };
    }
  ): Promise<KnowledgeSearchResult[]> {
    let queryBuilder = supabase
      .from('knowledge_documents')
      .select('*');

    if (filters.documentType) {
      queryBuilder = queryBuilder.eq('document_type', filters.documentType);
    }

    if (filters.sourceUrl) {
      queryBuilder = queryBuilder.eq('source_url', filters.sourceUrl);
    }

    if (filters.dateRange) {
      queryBuilder = queryBuilder
        .gte('created_at', filters.dateRange.start)
        .lte('created_at', filters.dateRange.end);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      throw new Error(`Filtered search failed: ${error.message}`);
    }

    // Generate query embedding and compute similarity
    const queryEmbedding = await this.generateEmbedding(query);

    const results = data.map((doc: any) => {
      const similarity = this.cosineSimilarity(queryEmbedding, doc.embedding);
      return {
        document: {
          id: doc.id,
          title: doc.title,
          content: doc.content,
          documentType: doc.document_type,
          sourceUrl: doc.source_url,
          metadata: doc.metadata || {},
          createdAt: doc.created_at,
          updatedAt: doc.updated_at,
        },
        similarity,
        relevanceScore: this.calculateRelevanceScore(similarity, doc.document_type),
      };
    });

    // Sort by relevance score
    return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Get relevant context for an article being written
   */
  async getContextForArticle(
    topic: string,
    category: string,
    content?: string
  ): Promise<KnowledgeSearchResult[]> {
    const queries: KnowledgeQuery[] = [
      { query: topic, matchCount: 3 },
      { query: `${category} ${topic}`, matchCount: 2 },
    ];

    if (content) {
      // Extract key claims from content for fact-checking
      const claims = this.extractClaims(content);
      for (const claim of claims.slice(0, 3)) {
        queries.push({ query: claim, matchCount: 2 });
      }
    }

    const allResults: KnowledgeSearchResult[] = [];

    for (const q of queries) {
      const results = await this.search(q);
      allResults.push(...results);
    }

    // Deduplicate by document ID and sort by relevance
    const seen = new Set<string>();
    return allResults
      .filter(r => {
        if (seen.has(r.document.id)) return false;
        seen.add(r.document.id);
        return true;
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 10);
  }

  /**
   * Extract key claims from content for fact-checking
   */
  private extractClaims(content: string): string[] {
    const sentences = content.replace(/<[^>]*>/g, '').split(/[.!?]+/).filter(Boolean);
    const claimKeywords = ['is', 'are', 'was', 'were', 'has', 'have', 'will', 'announced', 'said', 'reported', 'confirmed'];

    return sentences
      .filter(sentence => claimKeywords.some(keyword => sentence.toLowerCase().includes(keyword)))
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 20 && sentence.length < 200)
      .slice(0, 5);
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Calculate relevance score based on similarity and document type
   */
  private calculateRelevanceScore(similarity: number, documentType: string): number {
    const typeWeights: Record<string, number> = {
      'style_guide': 1.2,
      'policy': 1.1,
      'report': 1.0,
      'article': 0.9,
      'data': 0.8,
      'rule': 1.3,
    };

    const weight = typeWeights[documentType] || 1.0;
    return similarity * weight;
  }

  /**
   * Delete a document from the knowledge base
   */
  async deleteDocument(documentId: string): Promise<void> {
    const { error } = await supabase
      .from('knowledge_documents')
      .delete()
      .eq('id', documentId);

    if (error) {
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  }

  /**
   * Get document count by type
   */
  async getDocumentStats(): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from('knowledge_documents')
      .select('document_type')
      .select('count');

    if (error) {
      throw new Error(`Failed to get document stats: ${error.message}`);
    }

    const stats: Record<string, number> = {};
    data.forEach((row: any) => {
      stats[row.document_type] = (stats[row.document_type] || 0) + 1;
    });

    return stats;
  }
}

// Singleton instance
let knowledgeBaseInstance: KnowledgeBase | null = null;

export function getKnowledgeBase(): KnowledgeBase {
  if (!knowledgeBaseInstance) {
    knowledgeBaseInstance = new KnowledgeBase();
  }
  return knowledgeBaseInstance;
}
