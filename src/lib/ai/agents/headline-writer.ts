// Headline Writer Agent
// Generates SEO-optimized headlines with A/B testing variants

import type {
  AgentInput,
  AgentOutput,
  HeadlineInput,
  HeadlineOutput,
} from '../types';
import { BaseAgent } from './base-agent';

export class HeadlineWriterAgent extends BaseAgent {
  name = 'Headline Writer';
  version = '1.0.0';
  description = 'Generates SEO-optimized headlines with click-through rate predictions';
  protected agentType = 'headline_writer' as const;

  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();
    let tokensUsed = 0;

    try {
      const headlineInput = input.data as unknown as HeadlineInput;
      const { article, alternatives = 5, seoOptimized = true } = headlineInput;

      if (!article || !article.content) {
        return this.createOutput(
          { primaryHeadline: '', alternativeHeadlines: [], seoScore: 0, clickThroughRate: 0, keywords: [] },
          0.1,
          'No article content to generate headlines for',
          ['no_content'],
          0,
          Date.now() - startTime
        );
      }

      // Generate headlines using AI
      const headlines = await this.generateHeadlines(article, alternatives, seoOptimized);

      // Analyze SEO score
      const seoAnalysis = await this.analyzeSEO(headlines.primaryHeadline, article.category);

      // Estimate click-through rate
      const ctr = await this.estimateCTR(headlines.primaryHeadline, article.category);

      tokensUsed = headlines.alternativeHeadlines.length * 100 + 200;

      const output = this.createOutput(
        {
          primaryHeadline: headlines.primaryHeadline,
          alternativeHeadlines: headlines.alternativeHeadlines,
          seoScore: seoAnalysis.score,
          clickThroughRate: ctr,
          keywords: seoAnalysis.keywords,
        },
        this.calculateConfidence(seoAnalysis.score, ctr),
        `Generated ${headlines.alternativeHeadlines.length + 1} headlines with SEO score ${seoAnalysis.score}`,
        this.generateFlags(headlines, seoAnalysis),
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
    const result = output.result as unknown as HeadlineOutput;
    return (
      typeof result.primaryHeadline === 'string' &&
      result.primaryHeadline.length > 0 &&
      result.primaryHeadline.length <= 120 &&
      Array.isArray(result.alternativeHeadlines)
    );
  }

  private async generateHeadlines(
    article: HeadlineInput['article'],
    alternatives: number,
    seoOptimized: boolean
  ): Promise<HeadlineOutput> {
    try {
      const prompt = `Generate ${alternatives + 1} compelling headlines for this news article.
      
      Article content:
      ${article.content.substring(0, 1000)}
      
      Category: ${article.category}
      Tags: ${article.tags.join(', ')}
      ${article.title ? `Current title: ${article.title}` : ''}
      
      Requirements:
      - Primary headline: ${seoOptimized ? 'SEO-optimized with target keywords' : 'Compelling and attention-grabbing'}
      - All headlines must be 60-120 characters
      - Include relevant keywords naturally
      - Avoid clickbait - be accurate and factual
      - Make them shareable on social media
      ${article.category === 'breaking' ? '- Emphasize urgency and timeliness' : ''}
      
      Return a JSON object:
      {
        "primaryHeadline": "string (best overall headline)",
        "alternativeHeadlines": ["string (alternative 1)", "string (alternative 2)", ...]
      }`;

      const systemPrompt = `You are an expert headline writer for a news publication.
      Create headlines that are accurate, engaging, and optimized for search engines.
      Focus on clarity, accuracy, and reader interest.
      Return valid JSON only.`;

      const { content: result } = await this.callOpenAI(prompt, systemPrompt, {
        model: 'gpt-4o',
        temperature: 0.7,
        responseFormat: { type: 'json_object' },
      });

      const parsed = JSON.parse(result);
      return {
        primaryHeadline: parsed.primaryHeadline || article.content.substring(0, 100),
        alternativeHeadlines: parsed.alternativeHeadlines || [],
        seoScore: 0,
        clickThroughRate: 0,
        keywords: [],
      };
    } catch (error) {
      // Fallback: generate simple headlines
      return this.generateFallbackHeadlines(article);
    }
  }

  private generateFallbackHeadlines(article: HeadlineInput['article']): HeadlineOutput {
    const base = article.title || article.content.substring(0, 100);
    const cleanBase = base.replace(/[^\w\s]/g, '').trim();
    
    return {
      primaryHeadline: cleanBase.substring(0, 120),
      alternativeHeadlines: [
        `${cleanBase.substring(0, 100)} - Full Story`,
        `Breaking: ${cleanBase.substring(0, 100)}`,
      ],
      seoScore: 50,
      clickThroughRate: 2.5,
      keywords: article.tags,
    };
  }

  private async analyzeSEO(
    headline: string,
    category: string
  ): Promise<{ score: number; keywords: string[] }> {
    try {
      const prompt = `Analyze this headline for SEO effectiveness:
      
      Headline: "${headline}"
      Category: ${category}
      
      Return a JSON object:
      {
        "score": number (0-100),
        "keywords": ["keyword1", "keyword2", ...],
        "strengths": ["strength1", ...],
        "improvements": ["improvement1", ...]
      }`;

      const systemPrompt = `You are an SEO expert analyzing news headlines.
      Evaluate headline effectiveness for search engines and social media.
      Return valid JSON only.`;

      const { content: result } = await this.callOpenAI(prompt, systemPrompt, {
        model: 'gpt-4o-mini',
        temperature: 0.3,
        responseFormat: { type: 'json_object' },
      });

      const parsed = JSON.parse(result);
      return {
        score: parsed.score || 50,
        keywords: parsed.keywords || [],
      };
    } catch (error) {
      return { score: 50, keywords: [] };
    }
  }

  private async estimateCTR(headline: string, category: string): Promise<number> {
    try {
      const prompt = `Estimate the click-through rate for this news headline:
      
      Headline: "${headline}"
      Category: ${category}
      
      Consider:
      - Emotional appeal
      - Urgency
      - Curiosity gap
      - Clarity
      - Relevance
      
      Return a JSON object:
      {
        "ctr": number (estimated CTR percentage, typically 2-8%)
      }`;

      const systemPrompt = `You are a digital marketing expert estimating headline click-through rates.
      Provide realistic CTR estimates based on headline characteristics.
      Return valid JSON only.`;

      const { content: result } = await this.callOpenAI(prompt, systemPrompt, {
        model: 'gpt-4o-mini',
        temperature: 0.3,
        responseFormat: { type: 'json_object' },
      });

      const parsed = Math.min(8, Math.max(1, parseFloat(result) || 3));
      return parsed;
    } catch (error) {
      return 3.0;
    }
  }

  private calculateConfidence(seoScore: number, ctr: number): number {
    return (seoScore / 100) * 0.6 + (ctr / 8) * 0.4;
  }

  private generateFlags(
    headlines: HeadlineOutput,
    seoAnalysis: { score: number; keywords: string[] }
  ): string[] {
    const flags: string[] = [];
    
    if (headlines.primaryHeadline.length > 70) flags.push('headline_too_long');
    if (headlines.primaryHeadline.length < 30) flags.push('headline_too_short');
    if (seoAnalysis.score < 50) flags.push('low_seo_score');
    if (headlines.alternativeHeadlines.length < 3) flags.push('few_alternatives');
    if (seoAnalysis.keywords.length === 0) flags.push('no_keywords_detected');
    
    return flags;
  }
}
