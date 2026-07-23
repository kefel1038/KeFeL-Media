// AI Pipeline Orchestrator
// Manages the execution of specialized AI agents in sequence

import type {
  AIAgent,
  AIPipeline,
  AgentInput,
  AgentOutput,
  AgentType,
  AgentMetrics,
  PipelineContext,
  PipelineResult,
  PipelineOrchestrator as IPipelineOrchestrator,
} from './types';

export class PipelineOrchestrator implements IPipelineOrchestrator {
  private agents: Map<AgentType, AIAgent> = new Map();
  private pipelines: Map<string, AIPipeline> = new Map();
  private metrics: Map<AgentType, AgentMetrics> = new Map();

  constructor() {
    this.initializeDefaultMetrics();
  }

  private initializeDefaultMetrics(): void {
    const agentTypes: AgentType[] = [
      'news_scout', 'dedup_agent', 'fact_checker', 'headline_writer',
      'article_writer', 'seo_agent', 'image_agent', 'translator',
      'social_agent', 'publisher'
    ];

    agentTypes.forEach(type => {
      this.metrics.set(type, {
        totalRuns: 0,
        successRate: 0,
        averageConfidence: 0,
        averageDurationMs: 0,
        totalTokensUsed: 0,
        errorRate: 0,
      });
    });
  }

  registerAgent(agent: AIAgent): void {
    // Extract agent type from name
    const type = this.getAgentTypeFromName(agent.name);
    if (type) {
      this.agents.set(type, agent);
    }
  }

  getAgent(type: AgentType): AIAgent | undefined {
    return this.agents.get(type);
  }

  getAgentMetrics(type: AgentType): AgentMetrics {
    return this.metrics.get(type) || {
      totalRuns: 0,
      successRate: 0,
      averageConfidence: 0,
      averageDurationMs: 0,
      totalTokensUsed: 0,
      errorRate: 0,
    };
  }

  createPipeline(context: PipelineContext): AIPipeline {
    const pipeline: AIPipeline = {
      id: `pipeline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `Pipeline for ${context.triggerSource}`,
      agents: [],
      context,
      status: 'pending',
      results: new Map(),
    };

    this.pipelines.set(pipeline.id, pipeline);
    return pipeline;
  }

  async executePipeline(pipeline: AIPipeline): Promise<PipelineResult> {
    const startTime = Date.now();
    pipeline.status = 'running';
    pipeline.startedAt = new Date().toISOString();

    const agentOrder: AgentType[] = [
      'news_scout',
      'dedup_agent',
      'fact_checker',
      'headline_writer',
      'article_writer',
      'seo_agent',
      'image_agent',
      'translator',
      'social_agent',
      'publisher',
    ];

    let totalTokensUsed = 0;
    const outputs = new Map<string, AgentOutput>();

    try {
      for (const agentType of agentOrder) {
        const agent = this.agents.get(agentType);
        if (!agent) {
          console.warn(`Agent ${agentType} not registered, skipping`);
          continue;
        }

        const agentStartTime = Date.now();
        const input: AgentInput = {
          data: pipeline.context.metadata,
          context: pipeline.context,
          previousOutputs: outputs,
        };

        try {
          const output = await agent.execute(input);
          const agentDuration = Date.now() - agentStartTime;

          // Update metrics
          this.updateAgentMetrics(agentType, output, agentDuration);

          outputs.set(agentType, output);
          pipeline.results.set(agentType, output);
          totalTokensUsed += output.tokensUsed;

          // Validate output
          if (!agent.validate(output)) {
            console.warn(`Agent ${agentType} output validation failed`);
          }
        } catch (error) {
          console.error(`Agent ${agentType} failed:`, error);
          this.updateAgentErrorMetrics(agentType);

          // Continue with pipeline even if one agent fails
          // In production, you might want to handle this differently
        }
      }

      pipeline.status = 'completed';
      pipeline.completedAt = new Date().toISOString();

      return {
        pipelineId: pipeline.id,
        status: 'completed',
        outputs,
        totalTokensUsed,
        totalDurationMs: Date.now() - startTime,
        articleId: pipeline.context.articleId,
      };
    } catch (error) {
      pipeline.status = 'failed';
      pipeline.error = error instanceof Error ? error.message : 'Unknown error';

      return {
        pipelineId: pipeline.id,
        status: 'failed',
        outputs,
        totalTokensUsed,
        totalDurationMs: Date.now() - startTime,
        error: pipeline.error,
      };
    }
  }

  getPipelineStatus(pipelineId: string): AIPipeline | undefined {
    return this.pipelines.get(pipelineId);
  }

  getPipelineHistory(): AIPipeline[] {
    return Array.from(this.pipelines.values())
      .sort((a, b) => {
        const aTime = a.startedAt ? new Date(a.startedAt).getTime() : 0;
        const bTime = b.startedAt ? new Date(b.startedAt).getTime() : 0;
        return bTime - aTime;
      });
  }

  private updateAgentMetrics(type: AgentType, output: AgentOutput, durationMs: number): void {
    const current = this.metrics.get(type) || {
      totalRuns: 0,
      successRate: 0,
      averageConfidence: 0,
      averageDurationMs: 0,
      totalTokensUsed: 0,
      errorRate: 0,
    };

    current.totalRuns += 1;
    current.totalTokensUsed += output.tokensUsed;
    current.averageDurationMs = (current.averageDurationMs * (current.totalRuns - 1) + durationMs) / current.totalRuns;
    current.averageConfidence = (current.averageConfidence * (current.totalRuns - 1) + output.confidence) / current.totalRuns;
    current.successRate = ((current.totalRuns - 1) * current.successRate + 1) / current.totalRuns;
    current.lastRunAt = new Date().toISOString();

    this.metrics.set(type, current);
  }

  private updateAgentErrorMetrics(type: AgentType): void {
    const current = this.metrics.get(type);
    if (current) {
      current.totalRuns += 1;
      current.errorRate = ((current.totalRuns - 1) * current.errorRate + 1) / current.totalRuns;
      this.metrics.set(type, current);
    }
  }

  private getAgentTypeFromName(name: string): AgentType | undefined {
    const mapping: Record<string, AgentType> = {
      'news_scout': 'news_scout',
      'dedup': 'dedup_agent',
      'fact_checker': 'fact_checker',
      'headline_writer': 'headline_writer',
      'article_writer': 'article_writer',
      'seo': 'seo_agent',
      'image': 'image_agent',
      'translator': 'translator',
      'social': 'social_agent',
      'publisher': 'publisher',
    };

    for (const [key, value] of Object.entries(mapping)) {
      if (name.toLowerCase().includes(key)) {
        return value;
      }
    }
    return undefined;
  }
}

// Singleton instance
let orchestratorInstance: PipelineOrchestrator | null = null;

export function getOrchestrator(): PipelineOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new PipelineOrchestrator();
  }
  return orchestratorInstance;
}
