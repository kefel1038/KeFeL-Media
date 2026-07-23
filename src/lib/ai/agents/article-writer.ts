// Article Writer Agent
// Generates full articles with RAG integration for accuracy

import type {
  AgentInput,
  AgentOutput,
  ArticleWriterInput,
  ArticleWriterOutput,
  TimelineEntry,
  FAQEntry,
  ExpertOpinion,
  KnowledgeDocument,
} from '../types';
import { BaseAgent } from './base-agent';

export class ArticleWriterAgent extends BaseAgent {
  name = 'Article Writer';
  version = '1.0.0';
  description = 'Generates comprehensive news articles using RAG for accuracy';
  protected agentType = 'article_writer' as const;

  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();
    let tokensUsed = 0;

    try {
      const articleInput = input.data as unknown as ArticleWriterInput;
      const { topic, category, targetLength = 800, style = 'analysis', knowledgeBase = [] } = articleInput;

      if (!topic) {
        return this.createOutput(
          { headline: '', fullArticle: '', wordCount: 0, confidenceScore: 0 },
          0.1,
          'No topic provided for article generation',
          ['no_topic'],
          0,
          Date.now() - startTime
        );
      }

      // Gather context from knowledge base
      const context = this.buildContext(topic, knowledgeBase);

      // Generate article using AI with RAG context
      const article = await this.generateArticle(topic, category, targetLength, style, context);

      // Generate metadata
      const metadata = await this.generateMetadata(article, category);

      // Generate FAQ
      const faq = await this.generateFAQ(article, topic);

      // Generate timeline if applicable
      const timeline = await this.generateTimeline(article, topic);

      tokensUsed = Math.ceil(article.length / 4) + 500;

      const output = this.createOutput(
        {
          headline: metadata.headline,
          alternativeHeadlines: metadata.alternativeHeadlines,
          metaDescription: metadata.metaDescription,
          seoKeywords: metadata.seoKeywords,
          urlSlug: metadata.urlSlug,
          featuredImagePrompt: metadata.featuredImagePrompt,
          shortSummary: metadata.shortSummary,
          fullArticle: article,
          timeline,
          background: context.background,
          faq,
          relatedLaws: context.relatedLaws,
          expertOpinions: context.expertOpinions,
          suggestedRelated: context.suggestedRelated,
          tags: metadata.tags,
          categories: [category],
          confidenceScore: this.calculateConfidence(article, knowledgeBase),
          sourcesUsed: context.sourcesUsed,
          readabilityScore: await this.analyzeReadability(article),
          seoScore: metadata.seoScore,
          wordCount: this.countWords(article),
          readingTime: Math.ceil(this.countWords(article) / 200),
        },
        this.calculateConfidence(article, knowledgeBase),
        `Generated ${this.countWords(article)} word article on "${topic}"`,
        this.generateFlags(article, knowledgeBase),
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
    const result = output.result as unknown as ArticleWriterOutput;
    return (
      typeof result.fullArticle === 'string' &&
      result.fullArticle.length > 100 &&
      typeof result.headline === 'string' &&
      result.headline.length > 0 &&
      result.wordCount > 0
    );
  }

  private buildContext(
    topic: string,
    knowledgeBase: KnowledgeDocument[]
  ): {
    background: string;
    relatedLaws: string[];
    expertOpinions: ExpertOpinion[];
    suggestedRelated: string[];
    sourcesUsed: string[];
  } {
    const relevantDocs = knowledgeBase.slice(0, 5);
    
    return {
      background: relevantDocs.map((doc) => doc.content).join('\n\n'),
      relatedLaws: [],
      expertOpinions: [],
      suggestedRelated: [],
      sourcesUsed: relevantDocs.map((doc) => doc.title),
    };
  }

  private async generateArticle(
    topic: string,
    category: string,
    targetLength: number,
    style: string,
    context: { background: string; sourcesUsed: string[] }
  ): Promise<string> {
    try {
      const prompt = `Write a comprehensive ${style} article about: ${topic}
      
      Category: ${category}
      Target length: ${targetLength} words
      ${context.background ? `\nBackground context:\n${context.background}` : ''}
      
      Requirements:
      - Use inverted pyramid structure (most important info first)
      - Include relevant quotes and statistics
      - Provide context and background
      - Include expert opinions where relevant
      - Use clear, concise language
      - Follow AP Style guidelines
      - Include proper attribution
      - Make it engaging and shareable
      
      Article structure:
      1. Headline (compelling, SEO-friendly)
      2. Lead paragraph (who, what, when, where, why)
      3. Body paragraphs (details, context, quotes)
      4. Background section
      5. Future implications
      6. Conclusion with call to action
      
      Write the full article in markdown format.`;

      const systemPrompt = `You are an expert news writer for KeFeL Media, a digital news publication based in Kampala, Uganda.
      Write factual, engaging, and well-structured news articles.
      Focus on accuracy, clarity, and reader engagement.
      Use proper journalism style and ethics.
      Return the article in markdown format.`;

      const { content } = await this.callOpenAI(prompt, systemPrompt, {
        model: 'gpt-4o',
        temperature: 0.7,
        maxTokens: Math.ceil(targetLength * 2),
      });

      return content;
    } catch (error) {
      // Fallback: generate basic article structure
      return this.generateFallbackArticle(topic, category, style);
    }
  }

  private generateFallbackArticle(topic: string, category: string, style: string): string {
    return `# ${topic}

## Lead

This is a developing story about ${topic}. We are gathering more information and will update this article as details become available.

## What We Know

${topic} is an important story in the ${category} category. Our team is working to verify all facts and provide comprehensive coverage.

## Background

KeFeL Media is committed to providing accurate and timely news coverage for our readers in Uganda and across East Africa.

## Next Steps

We will continue to update this story as more information becomes available. Check back for the latest updates.

---

*This article is currently being developed. Please check back for the full version.*`;
  }

  private async generateMetadata(
    article: string,
    category: string
  ): Promise<{
    headline: string;
    alternativeHeadlines: string[];
    metaDescription: string;
    seoKeywords: string[];
    urlSlug: string;
    featuredImagePrompt: string;
    shortSummary: string;
    seoScore: number;
    tags: string[];
  }> {
    try {
      const prompt = `Generate SEO metadata for this article:
      
      Article content:
      ${article.substring(0, 2000)}
      
      Category: ${category}
      
      Return a JSON object:
      {
        "headline": "string (SEO-optimized headline, 60-70 chars)",
        "alternativeHeadlines": ["string1", "string2", "string3"],
        "metaDescription": "string (150-160 chars)",
        "seoKeywords": ["keyword1", "keyword2", ...],
        "urlSlug": "string (URL-friendly slug)",
        "featuredImagePrompt": "string (DALL-E prompt for featured image)",
        "shortSummary": "string (2-3 sentence summary)",
        "seoScore": number (0-100),
        "tags": ["tag1", "tag2", ...]
      }`;

      const systemPrompt = `You are an SEO expert generating metadata for news articles.
      Create accurate, engaging metadata that improves search visibility.
      Return valid JSON only.`;

      const { content: result } = await this.callOpenAI(prompt, systemPrompt, {
        model: 'gpt-4o-mini',
        temperature: 0.5,
        responseFormat: { type: 'json_object' },
      });

      return JSON.parse(result);
    } catch (error) {
      const headline = article.split('\n')[0]?.replace(/^#+\s*/, '') || 'News Article';
      return {
        headline,
        alternativeHeadlines: [],
        metaDescription: article.substring(0, 160),
        seoKeywords: [category],
        urlSlug: headline.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 80),
        featuredImagePrompt: `A professional news photo related to ${category}`,
        shortSummary: article.substring(0, 300),
        seoScore: 50,
        tags: [category],
      };
    }
  }

  private async generateFAQ(article: string, topic: string): Promise<FAQEntry[]> {
    try {
      const prompt = `Generate 5 frequently asked questions about: ${topic}
      
      Article context:
      ${article.substring(0, 1500)}
      
      Return a JSON array:
      [
        {
          "question": "string",
          "answer": "string (2-3 sentences)"
        }
      ]`;

      const systemPrompt = `You are creating FAQ content for a news article.
      Generate relevant, informative questions and answers.
      Return valid JSON only.`;

      const { content: result } = await this.callOpenAI(prompt, systemPrompt, {
        model: 'gpt-4o-mini',
        temperature: 0.5,
        responseFormat: { type: 'json_object' },
      });

      const parsed = JSON.parse(result);
      return parsed.faq || [];
    } catch (error) {
      return [];
    }
  }

  private async generateTimeline(article: string, topic: string): Promise<TimelineEntry[]> {
    try {
      const prompt = `Extract or create a timeline of events for: ${topic}
      
      Article context:
      ${article.substring(0, 1500)}
      
      Return a JSON array:
      [
        {
          "date": "string (YYYY-MM-DD or descriptive)",
          "event": "string",
          "significance": "string"
        }
      ]`;

      const systemPrompt = `You are creating a timeline for a news article.
      Extract key events and their dates.
      Return valid JSON only.`;

      const { content: result } = await this.callOpenAI(prompt, systemPrompt, {
        model: 'gpt-4o-mini',
        temperature: 0.3,
        responseFormat: { type: 'json_object' },
      });

      const parsed = JSON.parse(result);
      return parsed.timeline || [];
    } catch (error) {
      return [];
    }
  }

  private async analyzeReadability(article: string): Promise<number> {
    // Simple readability score based on sentence length and word complexity
    const sentences = article.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const words = article.split(/\s+/);
    const avgWordsPerSentence = words.length / sentences.length;
    
    // Simple Flesch-like score (higher is easier to read)
    let score = 100 - (avgWordsPerSentence * 2);
    score = Math.max(0, Math.min(100, score));
    
    return Math.round(score);
  }

  private countWords(text: string): number {
    return text.split(/\s+/).filter((word) => word.length > 0).length;
  }

  private calculateConfidence(article: string, knowledgeBase: KnowledgeDocument[]): number {
    const lengthScore = Math.min(article.length / 2000, 1);
    const kbScore = knowledgeBase.length > 0 ? 0.3 : 0;
    return lengthScore * 0.7 + kbScore;
  }

  private generateFlags(article: string, knowledgeBase: KnowledgeDocument[]): string[] {
    const flags: string[] = [];
    
    if (article.length < 500) flags.push('short_article');
    if (article.length > 5000) flags.push('long_article');
    if (knowledgeBase.length === 0) flags.push('no_kb_context');
    if (article.includes('developing story')) flags.push('developing_story');
    
    return flags;
  }
}
