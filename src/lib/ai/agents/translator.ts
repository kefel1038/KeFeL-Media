// Translator Agent
// Translates articles into multiple languages with cultural adaptation

import type {
  AgentInput,
  AgentOutput,
  TranslatorInput,
  TranslatorOutput,
} from '../types';
import { BaseAgent } from './base-agent';

export class TranslatorAgent extends BaseAgent {
  name = 'Translator';
  version = '1.0.0';
  description = 'Translates articles into multiple languages with cultural adaptation';
  protected agentType = 'translator' as const;

  private languageNames: Record<string, string> = {
    sw: 'Swahili',
    ar: 'Arabic',
    fr: 'French',
    pt: 'Portuguese',
  };

  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();
    let tokensUsed = 0;

    try {
      const translatorInput = input.data as unknown as TranslatorInput;
      const { article, targetLanguage, preserveTone = true } = translatorInput;

      if (!article || !article.content) {
        return this.createOutput(
          { title: '', content: '', excerpt: '', language: targetLanguage, confidence: 0, culturalAdaptations: [], rtlLayout: false },
          0.1,
          'No article content to translate',
          ['no_content'],
          0,
          Date.now() - startTime
        );
      }

      // Translate article
      const translation = await this.translateArticle(article, targetLanguage, preserveTone);

      // Check for RTL layout
      const rtlLayout = targetLanguage === 'ar';

      tokensUsed = Math.ceil(article.content.length / 4) + 200;

      const output = this.createOutput(
        {
          title: translation.title,
          content: translation.content,
          excerpt: translation.excerpt,
          language: targetLanguage,
          confidence: translation.confidence,
          culturalAdaptations: translation.culturalAdaptations,
          rtlLayout,
        },
        this.calculateConfidence(translation),
        `Translated to ${this.languageNames[targetLanguage] || targetLanguage}`,
        this.generateFlags(translation, targetLanguage),
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
    const result = output.result as unknown as TranslatorOutput;
    return (
      typeof result.title === 'string' &&
      typeof result.content === 'string' &&
      result.content.length > 0 &&
      typeof result.language === 'string'
    );
  }

  private async translateArticle(
    article: TranslatorInput['article'],
    targetLanguage: string,
    preserveTone: boolean
  ): Promise<{
    title: string;
    content: string;
    excerpt: string;
    confidence: number;
    culturalAdaptations: string[];
  }> {
    try {
      const languageName = this.languageNames[targetLanguage] || targetLanguage;
      
      const prompt = `Translate this news article from English to ${languageName}.
      
      Title: ${article.title}
      Content: ${article.content}
      Excerpt: ${article.excerpt}
      
      Requirements:
      - Maintain journalistic tone and accuracy
      - Preserve meaning and context
      - Adapt cultural references appropriately
      - Use proper ${languageName} grammar and syntax
      - Keep proper nouns (names, places) unchanged
      - Maintain paragraph structure
      ${preserveTone ? '- Preserve the original tone and style' : ''}
      
      Return a JSON object:
      {
        "title": "string (translated title)",
        "content": "string (translated content)",
        "excerpt": "string (translated excerpt)",
        "confidence": number (0-1),
        "culturalAdaptations": ["adaptation1", "adaptation2", ...]
      }`;

      const systemPrompt = `You are an expert news translator specializing in ${languageName}.
      Translate news articles accurately while maintaining journalistic integrity.
      Adapt cultural references appropriately for ${languageName}-speaking audiences.
      Return valid JSON only.`;

      const { content: result } = await this.callOpenAI(prompt, systemPrompt, {
        model: 'gpt-4o',
        temperature: 0.3,
        responseFormat: { type: 'json_object' },
      });

      return JSON.parse(result);
    } catch (error) {
      // Fallback: return original with note
      return {
        title: `[${this.languageNames[targetLanguage]}] ${article.title}`,
        content: `[Translation to ${this.languageNames[targetLanguage]} pending]\n\n${article.content}`,
        excerpt: article.excerpt,
        confidence: 0.1,
        culturalAdaptations: ['Translation pending'],
      };
    }
  }

  private calculateConfidence(translation: { confidence: number }): number {
    return translation.confidence || 0.5;
  }

  private generateFlags(
    translation: { culturalAdaptations: string[]; confidence?: number },
    targetLanguage: string
  ): string[] {
    const flags: string[] = [];
    
    if (translation.culturalAdaptations.length > 3) flags.push('heavy_cultural_adaptation');
    if (targetLanguage === 'ar') flags.push('rtl_language');
    if (translation.confidence !== undefined && translation.confidence < 0.7) flags.push('low_confidence');
    
    return flags;
  }
}
