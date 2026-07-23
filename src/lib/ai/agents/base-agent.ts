// Base Agent Class
// Provides common functionality for all AI agents

import type {
  AIAgent,
  AgentInput,
  AgentOutput,
  AgentMetrics,
  AgentType,
} from '../types';

export abstract class BaseAgent implements AIAgent {
  abstract name: string;
  abstract version: string;
  abstract description: string;
  protected abstract agentType: AgentType;

  private metrics: AgentMetrics = {
    totalRuns: 0,
    successRate: 0,
    averageConfidence: 0,
    averageDurationMs: 0,
    totalTokensUsed: 0,
    errorRate: 0,
  };

  abstract execute(input: AgentInput): Promise<AgentOutput>;
  abstract validate(output: AgentOutput): boolean;

  getMetrics(): AgentMetrics {
    return { ...this.metrics };
  }

  protected updateMetrics(
    confidence: number,
    durationMs: number,
    tokensUsed: number,
    success: boolean
  ): void {
    this.metrics.totalRuns += 1;
    this.metrics.totalTokensUsed += tokensUsed;
    this.metrics.averageDurationMs =
      (this.metrics.averageDurationMs * (this.metrics.totalRuns - 1) + durationMs) /
      this.metrics.totalRuns;
    this.metrics.averageConfidence =
      (this.metrics.averageConfidence * (this.metrics.totalRuns - 1) + confidence) /
      this.metrics.totalRuns;
    this.metrics.successRate =
      ((this.metrics.totalRuns - 1) * this.metrics.successRate + (success ? 1 : 0)) /
      this.metrics.totalRuns;
    this.metrics.lastRunAt = new Date().toISOString();
    if (!success) {
      this.metrics.errorRate =
        ((this.metrics.totalRuns - 1) * this.metrics.errorRate + 1) /
        this.metrics.totalRuns;
    }
  }

  protected createOutput(
    result: Record<string, unknown>,
    confidence: number,
    reasoning: string,
    flags: string[],
    tokensUsed: number,
    durationMs: number
  ): AgentOutput {
    return {
      result,
      confidence,
      reasoning,
      flags,
      tokensUsed,
      durationMs,
      agentName: this.name,
      agentVersion: this.version,
      timestamp: new Date().toISOString(),
    };
  }

  protected async callOpenAI(
    prompt: string,
    systemPrompt: string,
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      responseFormat?: { type: string };
    } = {}
  ): Promise<{ content: string; tokensUsed: number }> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const model = options.model || 'gpt-4o';
    const temperature = options.temperature ?? 0.7;
    const maxTokens = options.maxTokens ?? 4096;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature,
        max_tokens: maxTokens,
        ...(options.responseFormat && { response_format: options.responseFormat }),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const tokensUsed = data.usage?.total_tokens || 0;

    return {
      content: data.choices[0].message.content,
      tokensUsed,
    };
  }

  protected async generateEmbedding(text: string): Promise<number[]> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate embedding');
    }

    const data = await response.json();
    return data.data[0].embedding;
  }
}
