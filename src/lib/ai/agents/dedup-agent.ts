// Dedup Agent
// Detects and merges duplicate news stories using semantic similarity

import type {
  AgentInput,
  AgentOutput,
  NewsItem,
  DuplicateCluster,
} from '../types';
import { BaseAgent } from './base-agent';

export class DedupAgent extends BaseAgent {
  name = 'Dedup';
  version = '1.0.0';
  description = 'Detects and merges duplicate news stories';
  protected agentType = 'dedup_agent' as const;

  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();
    let tokensUsed = 0;

    try {
      const items = (input.data.items as NewsItem[]) || [];
      const existingItems = (input.data.existingItems as NewsItem[]) || [];

      if (items.length === 0) {
        return this.createOutput(
          { uniqueItems: [], duplicateClusters: [], mergedSummaries: new Map() },
          0.1,
          'No items to deduplicate',
          ['no_items'],
          0,
          Date.now() - startTime
        );
      }

      // Generate embeddings for all items
      const itemsWithEmbeddings = await Promise.all(
        items.map(async (item) => ({
          item,
          embedding: await this.generateEmbedding(`${item.title} ${item.content}`),
        }))
      );

      // Find duplicates using AI-powered semantic similarity
      const clusters = await this.findDuplicateClusters(itemsWithEmbeddings, existingItems);
      
      // Merge duplicates and create unique list
      const { uniqueItems, mergedSummaries } = this.mergeDuplicates(items, clusters);
      tokensUsed = items.length * 150;

      const output = this.createOutput(
        {
          uniqueItems,
          duplicateClusters: clusters,
          mergedSummaries,
        },
        this.calculateConfidence(clusters, items.length),
        `Found ${clusters.length} duplicate clusters, ${uniqueItems.length} unique items`,
        this.generateFlags(clusters, items.length),
        tokensUsed,
        Date.now() - startTime
      );

      this.updateMetrics(output.confidence, Date.now() - startTime, tokensUsed, true);
      return output;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.updateMetrics(0, duration, tokensUsed, false);
      throw error;
    }
  }

  validate(output: AgentOutput): boolean {
    const result = output.result as {
      uniqueItems: NewsItem[];
      duplicateClusters: DuplicateCluster[];
    };
    return (
      Array.isArray(result.uniqueItems) &&
      Array.isArray(result.duplicateClusters)
    );
  }

  private async findDuplicateClusters(
    itemsWithEmbeddings: { item: NewsItem; embedding: number[] }[],
    existingItems: NewsItem[]
  ): Promise<DuplicateCluster[]> {
    const clusters: DuplicateCluster[] = [];
    const used = new Set<number>();

    for (let i = 0; i < itemsWithEmbeddings.length; i++) {
      if (used.has(i)) continue;

      const cluster: NewsItem[] = [itemsWithEmbeddings[i].item];
      used.add(i);

      for (let j = i + 1; j < itemsWithEmbeddings.length; j++) {
        if (used.has(j)) continue;

        const similarity = this.cosineSimilarity(
          itemsWithEmbeddings[i].embedding,
          itemsWithEmbeddings[j].embedding
        );

        // High similarity threshold for duplicates
        if (similarity > 0.85) {
          cluster.push(itemsWithEmbeddings[j].item);
          used.add(j);
        }
      }

      // Also check against existing items
      if (existingItems.length > 0) {
        for (const existing of existingItems) {
          const existingEmbedding = await this.generateEmbedding(
            `${existing.title} ${existing.content}`
          );
          const similarity = this.cosineSimilarity(
            itemsWithEmbeddings[i].embedding,
            existingEmbedding
          );

          if (similarity > 0.85) {
            cluster.push(existing);
          }
        }
      }

      if (cluster.length > 1) {
        const primaryStory = this.selectPrimaryStory(cluster);
        const mergedSummary = await this.mergeSummaries(cluster);
        const eventEntities = this.extractEntities(cluster);

        clusters.push({
          id: `cluster-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          primaryStory,
          relatedStories: cluster.filter((item) => item.id !== primaryStory.id),
          similarityScore: 0.9,
          mergedSummary,
          eventEntities,
        });
      }
    }

    return clusters;
  }

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

  private selectPrimaryStory(cluster: NewsItem[]): NewsItem {
    // Select the story with highest credibility and earliest publication
    return cluster.reduce((primary, current) => {
      const primaryScore = primary.credibilityScore * 0.6 + (1 - this.getMinutesAgo(primary.publishedAt) / 1440) * 0.4;
      const currentScore = current.credibilityScore * 0.6 + (1 - this.getMinutesAgo(current.publishedAt) / 1440) * 0.4;
      return currentScore > primaryScore ? current : primary;
    });
  }

  private async mergeSummaries(cluster: NewsItem[]): Promise<string> {
    if (cluster.length === 1) return cluster[0].content;

    try {
      const prompt = `Merge these ${cluster.length} news stories about the same event into a single comprehensive summary.
      
      Stories:
      ${cluster.map((item, i) => `${i + 1}. ${item.title} (${item.source})\n${item.content}`).join('\n\n')}
      
      Create a single, accurate summary that combines all verified facts from these sources.
      Focus on facts that appear in multiple sources.`;

      const systemPrompt = `You are a news editor merging duplicate stories.
      Combine facts from multiple sources into one accurate summary.
      Only include facts that appear in multiple sources.
      Return the merged summary as plain text.`;

      const { content } = await this.callOpenAI(prompt, systemPrompt, {
        model: 'gpt-4o-mini',
        temperature: 0.3,
      });

      return content;
    } catch (error) {
      // Fallback: combine content from all items
      return cluster.map((item) => item.content).join(' ');
    }
  }

  private extractEntities(cluster: NewsItem[]): string[] {
    const allText = cluster.map((item) => `${item.title} ${item.content}`).join(' ');
    const words = allText.split(/\s+/);
    
    // Simple entity extraction (in production, use NLP library)
    const entities = new Set<string>();
    const commonWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of', 'with']);
    
    words.forEach((word) => {
      const cleaned = word.replace(/[^a-zA-Z]/g, '');
      if (cleaned.length > 3 && !commonWords.has(cleaned.toLowerCase())) {
        // Capitalized words are likely entities
        if (cleaned[0] === cleaned[0].toUpperCase()) {
          entities.add(cleaned);
        }
      }
    });

    return Array.from(entities).slice(0, 10);
  }

  private mergeDuplicates(
    items: NewsItem[],
    clusters: DuplicateCluster[]
  ): { uniqueItems: NewsItem[]; mergedSummaries: Map<string, string> } {
    const mergedSummaries = new Map<string, string>();
    const clusteredIds = new Set<string>();

    clusters.forEach((cluster) => {
      cluster.relatedStories.forEach((story) => clusteredIds.add(story.id));
      mergedSummaries.set(cluster.primaryStory.id, cluster.mergedSummary);
    });

    const uniqueItems = items.filter((item) => !clusteredIds.has(item.id));
    
    // Add primary stories from clusters
    clusters.forEach((cluster) => {
      uniqueItems.push(cluster.primaryStory);
    });

    return { uniqueItems, mergedSummaries };
  }

  private calculateConfidence(clusters: DuplicateCluster[], totalItems: number): number {
    if (totalItems === 0) return 0.1;
    const duplicateRatio = clusters.reduce((sum, c) => sum + c.relatedStories.length, 0) / totalItems;
    return 0.5 + duplicateRatio * 0.5;
  }

  private generateFlags(clusters: DuplicateCluster[], totalItems: number): string[] {
    const flags: string[] = [];
    if (clusters.length === 0) flags.push('no_duplicates_found');
    if (clusters.some((c) => c.similarityScore > 0.95)) flags.push('exact_duplicates');
    if (totalItems > 100) flags.push('large_batch');
    return flags;
  }

  private getMinutesAgo(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    return (now.getTime() - date.getTime()) / (1000 * 60);
  }
}
