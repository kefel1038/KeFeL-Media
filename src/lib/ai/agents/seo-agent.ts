// SEO Agent
// Optimizes articles for search engines with schema markup

import type {
  AgentInput,
  AgentOutput,
  SEOInput,
  SEOOutput,
} from '../types';
import { BaseAgent } from './base-agent';

export class SEOAgent extends BaseAgent {
  name = 'SEO';
  version = '1.0.0';
  description = 'Optimizes articles for search engines with schema markup';
  protected agentType = 'seo_agent' as const;

  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();
    let tokensUsed = 0;

    try {
      const seoInput = input.data as unknown as SEOInput;
      const { article, targetKeywords = [] } = seoInput;

      if (!article || !article.content) {
        return this.createOutput(
          { metaTitle: '', metaDescription: '', keywords: [], seoScore: 0, readabilityScore: 0, internalLinkSuggestions: [], schemaMarkup: {} },
          0.1,
          'No article content to optimize',
          ['no_content'],
          0,
          Date.now() - startTime
        );
      }

      // Analyze article for SEO
      const analysis = await this.analyzeArticle(article, targetKeywords);

      // Generate schema markup
      const schemaMarkup = this.generateSchemaMarkup(article, analysis);

      // Generate internal link suggestions
      const internalLinks = await this.suggestInternalLinks(article, analysis.keywords);

      tokensUsed = 300;

      const output = this.createOutput(
        {
          metaTitle: analysis.metaTitle,
          metaDescription: analysis.metaDescription,
          keywords: analysis.keywords,
          seoScore: analysis.seoScore,
          readabilityScore: analysis.readabilityScore,
          internalLinkSuggestions: internalLinks,
          schemaMarkup,
        },
        this.calculateConfidence(analysis.seoScore, analysis.readabilityScore),
        `SEO score: ${analysis.seoScore}, Readability: ${analysis.readabilityScore}`,
        this.generateFlags(analysis),
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
    const result = output.result as unknown as SEOOutput;
    return (
      typeof result.metaTitle === 'string' &&
      typeof result.metaDescription === 'string' &&
      typeof result.seoScore === 'number' &&
      result.seoScore >= 0 &&
      result.seoScore <= 100
    );
  }

  private async analyzeArticle(
    article: SEOInput['article'],
    targetKeywords: string[]
  ): Promise<{
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    seoScore: number;
    readabilityScore: number;
  }> {
    try {
      const prompt = `Analyze this article for SEO and generate optimized metadata:
      
      Title: ${article.title}
      Content: ${article.content.substring(0, 2000)}
      Excerpt: ${article.excerpt}
      Category: ${article.category}
      Tags: ${article.tags.join(', ')}
      Target Keywords: ${targetKeywords.join(', ')}
      
      Return a JSON object:
      {
        "metaTitle": "string (50-60 chars, includes primary keyword)",
        "metaDescription": "string (150-160 chars, compelling)",
        "keywords": ["primary keyword", "secondary keyword", ...],
        "seoScore": number (0-100),
        "readabilityScore": number (0-100),
        "issues": ["issue1", "issue2", ...],
        "recommendations": ["rec1", "rec2", ...]
      }`;

      const systemPrompt = `You are an SEO expert analyzing news articles.
      Generate optimized metadata and evaluate SEO effectiveness.
      Focus on user intent and search engine best practices.
      Return valid JSON only.`;

      const { content: result } = await this.callOpenAI(prompt, systemPrompt, {
        model: 'gpt-4o-mini',
        temperature: 0.3,
        responseFormat: { type: 'json_object' },
      });

      return JSON.parse(result);
    } catch (error) {
      return {
        metaTitle: article.title.substring(0, 60),
        metaDescription: article.excerpt.substring(0, 160),
        keywords: [...targetKeywords, ...article.tags],
        seoScore: 50,
        readabilityScore: 60,
      };
    }
  }

  private generateSchemaMarkup(
    article: SEOInput['article'],
    analysis: { keywords: string[] }
  ): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: article.title,
      description: article.excerpt,
      keywords: analysis.keywords.join(', '),
      articleSection: article.category,
      datePublished: new Date().toISOString(),
      author: {
        '@type': 'Organization',
        name: 'KeFeL Media',
        url: 'https://kefelmedia.com',
      },
      publisher: {
        '@type': 'Organization',
        name: 'KeFeL Media',
        logo: {
          '@type': 'ImageObject',
          url: 'https://kefelmedia.com/logo.png',
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://kefelmedia.com',
      },
    };
  }

  private async suggestInternalLinks(
    article: SEOInput['article'],
    keywords: string[]
  ): Promise<string[]> {
    try {
      const prompt = `Suggest 5 internal link opportunities for this article:
      
      Title: ${article.title}
      Category: ${article.category}
      Keywords: ${keywords.join(', ')}
      
      Return a JSON array of URL slugs that would be relevant:
      [
        "slug-1",
        "slug-2",
        ...
      ]`;

      const systemPrompt = `You are an SEO expert suggesting internal linking opportunities.
      Suggest relevant articles that would improve site navigation and SEO.
      Return valid JSON only.`;

      const { content: result } = await this.callOpenAI(prompt, systemPrompt, {
        model: 'gpt-4o-mini',
        temperature: 0.3,
        responseFormat: { type: 'json_object' },
      });

      const parsed = JSON.parse(result);
      return parsed.links || [];
    } catch (error) {
      return [];
    }
  }

  private calculateConfidence(seoScore: number, readabilityScore: number): number {
    return (seoScore / 100) * 0.6 + (readabilityScore / 100) * 0.4;
  }

  private generateFlags(analysis: {
    seoScore: number;
    readabilityScore: number;
    keywords: string[];
  }): string[] {
    const flags: string[] = [];
    
    if (analysis.seoScore < 50) flags.push('low_seo_score');
    if (analysis.readabilityScore < 50) flags.push('low_readability');
    if (analysis.keywords.length < 3) flags.push('few_keywords');
    if (analysis.seoScore > 80) flags.push('high_seo_score');
    
    return flags;
  }
}
