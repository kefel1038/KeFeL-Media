// AI Agents Index
// Exports all agents and provides registration function

export { NewsScoutAgent } from './news-scout';
export { DedupAgent } from './dedup-agent';
export { FactCheckerAgent } from './fact-checker';
export { HeadlineWriterAgent } from './headline-writer';
export { ArticleWriterAgent } from './article-writer';
export { SEOAgent } from './seo-agent';
export { ImageAgent } from './image-agent';
export { TranslatorAgent } from './translator';
export { SocialAgent } from './social-agent';
export { PublisherAgent } from './publisher';

import type { AIAgent } from '../types';
import { getOrchestrator } from '../orchestrator';
import { NewsScoutAgent } from './news-scout';
import { DedupAgent } from './dedup-agent';
import { FactCheckerAgent } from './fact-checker';
import { HeadlineWriterAgent } from './headline-writer';
import { ArticleWriterAgent } from './article-writer';
import { SEOAgent } from './seo-agent';
import { ImageAgent } from './image-agent';
import { TranslatorAgent } from './translator';
import { SocialAgent } from './social-agent';
import { PublisherAgent } from './publisher';

export function registerAllAgents(): void {
  const orchestrator = getOrchestrator();

  const agents: AIAgent[] = [
    new NewsScoutAgent(),
    new DedupAgent(),
    new FactCheckerAgent(),
    new HeadlineWriterAgent(),
    new ArticleWriterAgent(),
    new SEOAgent(),
    new ImageAgent(),
    new TranslatorAgent(),
    new SocialAgent(),
    new PublisherAgent(),
  ];

  agents.forEach((agent) => {
    orchestrator.registerAgent(agent);
    console.log(`Registered agent: ${agent.name} v${agent.version}`);
  });
}

export function getAgentStatus(): {
  registered: string[];
  metrics: Record<string, unknown>;
} {
  const orchestrator = getOrchestrator();
  const agentTypes = [
    'news_scout', 'dedup_agent', 'fact_checker', 'headline_writer',
    'article_writer', 'seo_agent', 'image_agent', 'translator',
    'social_agent', 'publisher'
  ] as const;

  const registered = agentTypes
    .filter((type) => orchestrator.getAgent(type))
    .map((type) => type);

  const metrics: Record<string, unknown> = {};
  agentTypes.forEach((type) => {
    const agent = orchestrator.getAgent(type);
    if (agent) {
      metrics[type] = agent.getMetrics();
    }
  });

  return { registered, metrics };
}
