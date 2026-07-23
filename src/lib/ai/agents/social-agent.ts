// Social Agent
// Generates platform-specific social media posts

import type {
  AgentInput,
  AgentOutput,
  SocialInput,
  SocialOutput,
  SocialPost,
  SocialPlatform,
} from '../types';
import { BaseAgent } from './base-agent';

export class SocialAgent extends BaseAgent {
  name = 'Social';
  version = '1.0.0';
  description = 'Generates platform-specific social media posts';
  protected agentType = 'social_agent' as const;

  private platformLimits: Record<SocialPlatform, number> = {
    facebook: 63206,
    twitter: 280,
    linkedin: 3000,
    threads: 500,
    telegram: 4096,
    whatsapp: 65536,
    instagram: 2200,
  };

  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();
    let tokensUsed = 0;

    try {
      const socialInput = input.data as unknown as SocialInput;
      const { article, platforms } = socialInput;

      if (!article || !article.title) {
        return this.createOutput(
          { posts: [], scheduledAt: undefined },
          0.1,
          'No article content to create social posts for',
          ['no_content'],
          0,
          Date.now() - startTime
        );
      }

      // Generate posts for each platform
      const posts = await Promise.all(
        platforms.map((platform) => this.generatePost(article, platform))
      );

      tokensUsed = platforms.length * 100;

      const output = this.createOutput(
        {
          posts,
          scheduledAt: new Date().toISOString(),
        },
        this.calculateConfidence(posts),
        `Generated ${posts.length} social posts for ${platforms.join(', ')}`,
        this.generateFlags(posts),
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
    const result = output.result as unknown as SocialOutput;
    return Array.isArray(result.posts) && result.posts.length > 0;
  }

  private async generatePost(
    article: SocialInput['article'],
    platform: SocialPlatform
  ): Promise<SocialPost> {
    try {
      const limit = this.platformLimits[platform];
      
      const prompt = `Create a ${platform} post for this news article:
      
      Title: ${article.title}
      Excerpt: ${article.excerpt}
      URL: ${article.url}
      Category: ${article.category}
      Tags: ${article.tags.join(', ')}
      
      Platform: ${platform}
      Character limit: ${limit}
      
      Requirements:
      - Engaging and attention-grabbing
      - Include relevant hashtags
      - Stay within character limit
      - Include call-to-action
      - ${platform === 'twitter' ? 'Use thread format if needed' : ''}
      ${platform === 'linkedin' ? 'Professional tone' : ''}
      ${platform === 'instagram' ? 'Visual-focused, use emojis' : ''}
      
      Return a JSON object:
      {
        "content": "string (post content)",
        "hashtags": ["hashtag1", "hashtag2", ...]
      }`;

      const systemPrompt = `You are a social media expert creating posts for ${platform}.
      Create engaging, platform-optimized content.
      Follow ${platform} best practices.
      Return valid JSON only.`;

      const { content: result } = await this.callOpenAI(prompt, systemPrompt, {
        model: 'gpt-4o-mini',
        temperature: 0.7,
        responseFormat: { type: 'json_object' },
      });

      const parsed = JSON.parse(result);
      const content = parsed.content || '';
      const hashtags = parsed.hashtags || [];

      return {
        platform,
        content: content.substring(0, limit),
        hashtags,
        imageUrl: article.imageUrl,
        characterCount: content.length,
        withinLimits: content.length <= limit,
      };
    } catch (error) {
      // Fallback: generate simple post
      return this.generateFallbackPost(article, platform);
    }
  }

  private generateFallbackPost(
    article: SocialInput['article'],
    platform: SocialPlatform
  ): SocialPost {
    const limit = this.platformLimits[platform];
    let content = `${article.title}\n\n${article.excerpt}\n\nRead more: ${article.url}`;
    
    if (platform === 'twitter' && content.length > limit) {
      content = `${article.title.substring(0, 200)}...\n\nRead more: ${article.url}`;
    }

    const hashtags = article.tags.slice(0, 5).map((tag) => 
      `#${tag.toLowerCase().replace(/\s+/g, '')}`
    );

    return {
      platform,
      content: content.substring(0, limit),
      hashtags,
      imageUrl: article.imageUrl,
      characterCount: content.length,
      withinLimits: content.length <= limit,
    };
  }

  private calculateConfidence(posts: SocialPost[]): number {
    if (posts.length === 0) return 0.1;
    const withinLimitsRatio = posts.filter((p) => p.withinLimits).length / posts.length;
    return 0.5 + withinLimitsRatio * 0.5;
  }

  private generateFlags(posts: SocialPost[]): string[] {
    const flags: string[] = [];
    
    if (posts.some((p) => !p.withinLimits)) flags.push('content_truncated');
    if (posts.length > 5) flags.push('many_platforms');
    if (posts.every((p) => p.hashtags.length > 0)) flags.push('all_have_hashtags');
    
    return flags;
  }
}
