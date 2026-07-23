// Image Agent
// Generates images using DALL-E 3

import type {
  AgentInput,
  AgentOutput,
  ImageInput,
  ImageOutput,
} from '../types';
import { BaseAgent } from './base-agent';

export class ImageAgent extends BaseAgent {
  name = 'Image';
  version = '1.0.0';
  description = 'Generates images using DALL-E 3 for articles';
  protected agentType = 'image_agent' as const;

  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();
    let tokensUsed = 0;

    try {
      const imageInput = input.data as unknown as ImageInput;
      const { article, imageType = 'featured', style = 'photo_realistic' } = imageInput;

      if (!article || !article.title) {
        return this.createOutput(
          { imageUrl: '', prompt: '', revisedPrompt: '', size: '', style: '', safetyRatings: [], aiGenerated: false, watermark: false },
          0.1,
          'No article content to generate image for',
          ['no_content'],
          0,
          Date.now() - startTime
        );
      }

      // Generate image prompt
      const imagePrompt = await this.generateImagePrompt(article, imageType, style);

      // Generate image using DALL-E 3
      const imageResult = await this.generateImage(imagePrompt.prompt, imageType);

      tokensUsed = 150;

      const output = this.createOutput(
        {
          imageUrl: imageResult.url,
          prompt: imagePrompt.prompt,
          revisedPrompt: imageResult.revisedPrompt,
          size: this.getImageSize(imageType),
          style,
          safetyRatings: imageResult.safetyRatings,
          aiGenerated: true,
          watermark: true,
        },
        this.calculateConfidence(imageResult),
        `Generated ${imageType} image with style: ${style}`,
        this.generateFlags(imageResult, imageType),
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
    const result = output.result as unknown as ImageOutput;
    return (
      typeof result.imageUrl === 'string' &&
      result.imageUrl.length > 0 &&
      typeof result.prompt === 'string'
    );
  }

  private async generateImagePrompt(
    article: ImageInput['article'],
    imageType: ImageInput['imageType'],
    style: ImageInput['style']
  ): Promise<{ prompt: string }> {
    try {
      const prompt = `Generate a DALL-E prompt for a ${imageType} image for this article:
      
      Title: ${article.title}
      Content: ${article.content.substring(0, 500)}
      Category: ${article.category}
      
      Style: ${style}
      Image type: ${imageType}
      
      Requirements:
      - Professional and editorial quality
      - Appropriate for news publication
      - Culturally relevant to Uganda/East Africa when applicable
      - No text in the image
      - High quality and detailed
      
      Return a JSON object:
      {
        "prompt": "string (detailed DALL-E prompt)"
      }`;

      const systemPrompt = `You are an expert at creating DALL-E prompts for news images.
      Create detailed, appropriate prompts for editorial photography.
      Return valid JSON only.`;

      const { content: result } = await this.callOpenAI(prompt, systemPrompt, {
        model: 'gpt-4o-mini',
        temperature: 0.7,
        responseFormat: { type: 'json_object' },
      });

      return JSON.parse(result);
    } catch (error) {
      return {
        prompt: `Professional news photo related to ${article.category}, ${style} style, editorial quality`,
      };
    }
  }

  private async generateImage(
    prompt: string,
    imageType: ImageInput['imageType']
  ): Promise<{
    url: string;
    revisedPrompt: string;
    safetyRatings: { category: string; score: number; severity: string }[];
  }> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const size = this.getImageSize(imageType);

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size,
        quality: 'hd',
        response_format: 'url',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`DALL-E API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const image = data.data[0];

    return {
      url: image.url,
      revisedPrompt: image.revised_prompt || prompt,
      safetyRatings: image.safety_ratings || [],
    };
  }

  private getImageSize(imageType: ImageInput['imageType']): string {
    switch (imageType) {
      case 'featured':
        return '1792x1024';
      case 'thumbnail':
        return '1024x1024';
      case 'social':
        return '1024x1024';
      case 'quote_card':
        return '1024x1024';
      default:
        return '1792x1024';
    }
  }

  private calculateConfidence(imageResult: { url: string }): number {
    return imageResult.url ? 0.9 : 0.1;
  }

  private generateFlags(
    imageResult: { url: string; safetyRatings: { severity: string }[] },
    imageType: ImageInput['imageType']
  ): string[] {
    const flags: string[] = [];
    
    if (!imageResult.url) flags.push('generation_failed');
    if (imageResult.safetyRatings?.some((r) => r.severity === 'high')) flags.push('safety_concern');
    if (imageType === 'featured') flags.push('featured_image');
    
    return flags;
  }
}
