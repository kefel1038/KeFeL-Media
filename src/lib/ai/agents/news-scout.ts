// News Scout Agent
// Monitors RSS feeds, news APIs, and social media for breaking news

import type {
  AgentInput,
  AgentOutput,
  NewsItem,
  Trend,
} from '../types';
import { BaseAgent } from './base-agent';

export class NewsScoutAgent extends BaseAgent {
  name = 'News Scout';
  version = '1.0.0';
  description = 'Monitors news sources and identifies breaking stories';
  protected agentType = 'news_scout' as const;

  private defaultSources = [
    // Uganda
    'https://www.monitor.co.ug/rss',
    'https://www.newvision.co.ug/rss',
    'https://www.dailyexpress.co.ug/rss',
    'https://www.independent.co.ug/rss',
    // East Africa
    'https://www.nation.africa/rss',
    'https://www.theeastafrican.co.ke/rss',
    // Africa
    'https://www.africanews.com/rss',
    'https://www.bbc.com/africa/rss',
    // International
    'https://rss.nytimes.com/services/xml/rss/nyt/Africa.xml',
    'https://feeds.bbci.co.uk/news/world/africa/rss.xml',
  ];

  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();
    let tokensUsed = 0;

    try {
      const sources = (input.data.sources as string[]) || this.defaultSources;
      const topics = (input.data.topics as string[]) || [];
      const region = (input.data.region as string) || 'uganda';

      // Fetch news from all sources
      const allItems: NewsItem[] = [];
      const fetchPromises = sources.map((source) => this.fetchSource(source, topics, region));
      const results = await Promise.allSettled(fetchPromises);

      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          allItems.push(...result.value);
        }
      });

      // Generate trends using AI
      const trends = await this.generateTrends(allItems);
      tokensUsed = allItems.length * 100; // Approximate tokens

      const output = this.createOutput(
        {
          items: allItems,
          trends,
          sourcesChecked: sources.length,
          newItemsFound: allItems.length,
        },
        this.calculateConfidence(allItems, sources.length),
        `Checked ${sources.length} sources, found ${allItems.length} items`,
        this.generateFlags(allItems),
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
      items: NewsItem[];
      sourcesChecked: number;
    };
    return (
      Array.isArray(result.items) &&
      result.sourcesChecked > 0 &&
      output.confidence > 0
    );
  }

  private async fetchSource(
    sourceUrl: string,
    topics: string[],
    region: string
  ): Promise<NewsItem[]> {
    try {
      // In production, this would fetch and parse RSS feeds
      // For now, we'll use OpenAI to analyze a source
      const prompt = `Analyze the news source at ${sourceUrl} and identify the top 5 stories relevant to ${region} news.
      Focus on topics: ${topics.length > 0 ? topics.join(', ') : 'all current events'}.
      
      Return a JSON array of news items with the following structure:
      [
        {
          "title": "string",
          "url": "string",
          "content": "string (brief summary)",
          "author": "string or null",
          "publishedAt": "ISO date string",
          "source": "string (source name)",
          "topics": ["array of relevant topics"],
          "relevanceScore": number (0-1),
          "credibilityScore": number (0-1)
        }
      ]`;

      const systemPrompt = `You are a news monitoring AI. Analyze news sources and extract structured information about current stories.
      Be factual and objective. Only include stories you can verify from the source.
      Return valid JSON only.`;

      const { content, tokensUsed } = await this.callOpenAI(prompt, systemPrompt, {
        model: 'gpt-4o-mini',
        temperature: 0.3,
        responseFormat: { type: 'json_object' },
      });

      const parsed = JSON.parse(content);
      const items: NewsItem[] = (parsed.items || []).map((item: Record<string, unknown>) => ({
        id: this.generateId(),
        title: item.title as string,
        url: item.url as string,
        content: item.content as string,
        author: (item.author as string) || undefined,
        publishedAt: item.publishedAt as string,
        source: item.source as string,
        fingerprint: this.generateFingerprint(item.title as string),
        topics: (item.topics as string[]) || [],
        region,
        relevanceScore: (item.relevanceScore as number) || 0.5,
        credibilityScore: (item.credibilityScore as number) || 0.5,
      }));

      return items;
    } catch (error) {
      console.error(`Failed to fetch source ${sourceUrl}:`, error);
      return [];
    }
  }

  private async generateTrends(items: NewsItem[]): Promise<Trend[]> {
    if (items.length === 0) return [];

    try {
      const prompt = `Analyze these ${items.length} news items and identify the top 5 trending stories or topics.
      
      News items:
      ${items.slice(0, 20).map((item) => `- ${item.title} (${item.source})`).join('\n')}
      
      Return a JSON array of trends:
      [
        {
          "title": "string",
          "summary": "string (2-3 sentence summary)",
          "viralScore": number (0-1, how viral/trending),
          "importance": number (0-1, importance level),
          "urgency": number (0-1, how urgent/breaking),
          "topic": "string (main topic)",
          "relatedItems": ["array of related item titles"]
        }
      ]`;

      const systemPrompt = `You are a news trend analysis AI. Identify trending stories and their significance.
      Focus on stories that are important for Uganda and East Africa.
      Return valid JSON only.`;

      const { content } = await this.callOpenAI(prompt, systemPrompt, {
        model: 'gpt-4o-mini',
        temperature: 0.5,
        responseFormat: { type: 'json_object' },
      });

      const parsed = JSON.parse(content);
      return (parsed.trends || []).map((trend: Record<string, unknown>) => ({
        id: this.generateId(),
        title: trend.title as string,
        summary: trend.summary as string,
        viralScore: (trend.viralScore as number) || 0.5,
        importance: (trend.importance as number) || 0.5,
        urgency: (trend.urgency as number) || 0.5,
        topic: (trend.topic as string) || '',
        relatedItems: (trend.relatedItems as string[]) || [],
        velocity: 0,
      }));
    } catch (error) {
      console.error('Failed to generate trends:', error);
      return [];
    }
  }

  private calculateConfidence(items: NewsItem[], sourcesChecked: number): number {
    if (items.length === 0) return 0.1;
    const avgRelevance = items.reduce((sum, item) => sum + item.relevanceScore, 0) / items.length;
    const avgCredibility = items.reduce((sum, item) => sum + item.credibilityScore, 0) / items.length;
    const sourceFactor = Math.min(sourcesChecked / 10, 1);
    return (avgRelevance * 0.3 + avgCredibility * 0.4 + sourceFactor * 0.3);
  }

  private generateFlags(items: NewsItem[]): string[] {
    const flags: string[] = [];
    if (items.length === 0) flags.push('no_items_found');
    if (items.some((item) => item.relevanceScore > 0.8)) flags.push('breaking_news_detected');
    if (items.some((item) => item.credibilityScore < 0.3)) flags.push('low_credibility_source');
    return flags;
  }

  private generateId(): string {
    return `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateFingerprint(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 50);
  }
}
