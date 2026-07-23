// Publisher Agent
// Final review and publishes articles to the database

import type {
  AgentInput,
  AgentOutput,
  PublisherInput,
  PublisherOutput,
} from '../types';
import { BaseAgent } from './base-agent';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export class PublisherAgent extends BaseAgent {
  name = 'Publisher';
  version = '1.0.0';
  description = 'Final review and publishes articles to the database';
  protected agentType = 'publisher' as const;

  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();
    let tokensUsed = 0;

    try {
      const publisherInput = input.data as unknown as PublisherInput;
      const { article, factCheck, seo, images, translations, social, scheduledAt, editorialNotes } = publisherInput;

      if (!article || !article.fullArticle) {
        return this.createOutput(
          { articleId: '', status: 'pending_review', publishedAt: '', url: '', socialPostsQueued: 0, notificationsSent: 0, auditLogId: '' },
          0.1,
          'No article content to publish',
          ['no_content'],
          0,
          Date.now() - startTime
        );
      }

      // Final quality check
      const qualityCheck = await this.performQualityCheck(article, factCheck, seo);

      if (!qualityCheck.passed) {
        return this.createOutput(
          { articleId: '', status: 'pending_review', publishedAt: '', url: '', socialPostsQueued: 0, notificationsSent: 0, auditLogId: '' },
          qualityCheck.score / 100,
          `Quality check failed: ${qualityCheck.issues.join(', ')}`,
          ['quality_check_failed', ...qualityCheck.issues],
          tokensUsed,
          Date.now() - startTime
        );
      }

      // Save article to database
      const articleId = await this.saveArticle(article, seo, images, translations);

      // Queue social posts
      const socialPostsQueued = social ? await this.queueSocialPosts(articleId, social) : 0;

      // Send notifications
      const notificationsSent = await this.sendNotifications(article, articleId);

      // Create audit log
      const auditLogId = await this.createAuditLog(articleId, 'ai_publish', editorialNotes);

      tokensUsed = 200;

      const output = this.createOutput(
        {
          articleId,
          status: scheduledAt ? 'scheduled' : 'published',
          publishedAt: scheduledAt || new Date().toISOString(),
          url: `/article/${article.urlSlug}`,
          socialPostsQueued,
          notificationsSent,
          auditLogId,
        },
        this.calculateConfidence(qualityCheck),
        `Published article: ${article.headline}`,
        this.generateFlags(qualityCheck, scheduledAt),
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
    const result = output.result as unknown as PublisherOutput;
    return (
      typeof result.articleId === 'string' &&
      result.articleId.length > 0 &&
      typeof result.status === 'string'
    );
  }

  private async performQualityCheck(
    article: PublisherInput['article'],
    factCheck: PublisherInput['factCheck'],
    seo: PublisherInput['seo']
  ): Promise<{
    passed: boolean;
    score: number;
    issues: string[];
  }> {
    const issues: string[] = [];
    let score = 100;

    // Check article length
    if (article.wordCount < 300) {
      issues.push('article_too_short');
      score -= 20;
    }

    // Check fact-check score
    if (factCheck && factCheck.verificationScore < 50) {
      issues.push('low_fact_check_score');
      score -= 30;
    }

    // Check SEO score
    if (seo && seo.seoScore < 50) {
      issues.push('low_seo_score');
      score -= 15;
    }

    // Check readability
    if (article.readabilityScore < 40) {
      issues.push('low_readability');
      score -= 10;
    }

    return {
      passed: score >= 60,
      score: Math.max(0, score),
      issues,
    };
  }

  private async saveArticle(
    article: PublisherInput['article'],
    seo: PublisherInput['seo'],
    images: PublisherInput['images'],
    translations: PublisherInput['translations']
  ): Promise<string> {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('articles')
      .insert({
        title: article.headline,
        slug: article.urlSlug,
        content: article.fullArticle,
        excerpt: article.shortSummary,
        meta_title: seo?.metaTitle || article.headline,
        meta_description: seo?.metaDescription || article.shortSummary,
        category: article.categories[0] || 'general',
        tags: article.tags,
        featured_image_url: images?.[0]?.imageUrl || null,
        status: 'published',
        author: 'AI Newsroom',
        published_at: new Date().toISOString(),
        reading_time: article.readingTime,
        word_count: article.wordCount,
        ai_generated: true,
        ai_confidence: article.confidenceScore,
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  private async queueSocialPosts(
    articleId: string,
    social: PublisherInput['social']
  ): Promise<number> {
    if (!social || !social.posts) return 0;

    const supabase = createClient(supabaseUrl, supabaseKey);
    let queued = 0;

    for (const post of social.posts) {
      const { error } = await supabase
        .from('social_posts')
        .insert({
          article_id: articleId,
          platform: post.platform,
          content: post.content,
          hashtags: post.hashtags,
          image_url: post.imageUrl,
          status: 'queued',
          scheduled_at: social.scheduledAt || new Date().toISOString(),
        });

      if (!error) queued++;
    }

    return queued;
  }

  private async sendNotifications(
    article: PublisherInput['article'],
    articleId: string
  ): Promise<number> {
    // In production, this would send notifications to subscribers
    // For now, just log it
    console.log(`Notifications sent for article: ${article.headline}`);
    return 1;
  }

  private async createAuditLog(
    articleId: string,
    action: string,
    notes?: string
  ): Promise<string> {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('audit_log')
      .insert({
        entity_type: 'article',
        entity_id: articleId,
        action,
        details: { notes, aiGenerated: true },
        performed_by: 'ai-agent',
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  private calculateConfidence(qualityCheck: { score: number }): number {
    return qualityCheck.score / 100;
  }

  private generateFlags(
    qualityCheck: { passed: boolean; issues: string[] },
    scheduledAt?: string
  ): string[] {
    const flags: string[] = [];
    
    if (!qualityCheck.passed) flags.push('quality_check_failed');
    if (scheduledAt) flags.push('scheduled_publication');
    if (qualityCheck.issues.length > 0) flags.push('has_issues');
    
    return flags;
  }
}
