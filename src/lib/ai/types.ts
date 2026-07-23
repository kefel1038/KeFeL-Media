// AI Agent Architecture Types
// Each agent is a specialized, independent unit in the pipeline

export interface AIAgent {
  name: string;
  version: string;
  description: string;
  execute(input: AgentInput): Promise<AgentOutput>;
  validate(output: AgentOutput): boolean;
  getMetrics(): AgentMetrics;
}

export interface AgentInput {
  data: Record<string, unknown>;
  context: PipelineContext;
  knowledgeBase?: KnowledgeDocument[];
  previousOutputs?: Map<string, AgentOutput>;
}

export interface AgentOutput {
  result: Record<string, unknown>;
  confidence: number;
  reasoning: string;
  flags: string[];
  tokensUsed: number;
  durationMs: number;
  agentName: string;
  agentVersion: string;
  timestamp: string;
}

export interface AgentMetrics {
  totalRuns: number;
  successRate: number;
  averageConfidence: number;
  averageDurationMs: number;
  totalTokensUsed: number;
  lastRunAt?: string;
  errorRate: number;
}

export interface PipelineContext {
  pipelineId: string;
  articleId?: string;
  userId?: string;
  triggerSource: 'manual' | 'cron' | 'api';
  metadata: Record<string, unknown>;
}

export interface AIPipeline {
  id: string;
  name: string;
  agents: AIAgent[];
  context: PipelineContext;
  status: 'pending' | 'running' | 'completed' | 'failed';
  results: Map<string, AgentOutput>;
  startedAt?: string;
  completedAt?: string;
  error?: string;
}

// Agent Types
export type AgentType =
  | 'news_scout'
  | 'dedup_agent'
  | 'fact_checker'
  | 'headline_writer'
  | 'article_writer'
  | 'seo_agent'
  | 'image_agent'
  | 'translator'
  | 'social_agent'
  | 'publisher';

// News Scout Agent
export interface NewsScoutInput {
  sources: string[];
  topics?: string[];
  region?: string;
  timeRange?: { start: string; end: string };
}

export interface NewsScoutOutput {
  items: NewsItem[];
  trends: Trend[];
  sourcesChecked: number;
  newItemsFound: number;
}

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  content: string;
  author?: string;
  publishedAt: string;
  source: string;
  fingerprint: string;
  topics: string[];
  region?: string;
  relevanceScore: number;
  credibilityScore: number;
}

export interface Trend {
  id: string;
  title: string;
  summary: string;
  viralScore: number;
  importance: number;
  urgency: number;
  region?: string;
  topic?: string;
  relatedItems: string[];
  velocity: number; // How fast it's growing
}

// Dedup Agent
export interface DedupInput {
  items: NewsItem[];
  existingItems?: NewsItem[];
}

export interface DedupOutput {
  uniqueItems: NewsItem[];
  duplicateClusters: DuplicateCluster[];
  mergedSummaries: Map<string, string>;
}

export interface DuplicateCluster {
  id: string;
  primaryStory: NewsItem;
  relatedStories: NewsItem[];
  similarityScore: number;
  mergedSummary: string;
  eventEntities: string[];
}

// Fact Checker Agent
export interface FactCheckInput {
  article: {
    title: string;
    content: string;
    claims: string[];
  };
  sources?: string[];
  knowledgeBase?: KnowledgeDocument[];
}

export interface FactCheckOutput {
  verificationStatus: 'verified' | 'developing' | 'unconfirmed' | 'opinion' | 'analysis';
  verificationScore: number; // 0-100
  claimVerifications: ClaimVerification[];
  sourcesUsed: SourceReference[];
  confidence: number;
}

export interface ClaimVerification {
  claim: string;
  status: 'true' | 'false' | 'partially_true' | 'unverified';
  reasoning: string;
  sources: SourceReference[];
  confidence: number;
}

export interface SourceReference {
  url: string;
  title: string;
  publisher: string;
  publishedAt: string;
  credibilityScore: number;
}

// Headline Writer Agent
export interface HeadlineInput {
  article: {
    title?: string;
    content: string;
    category: string;
    tags: string[];
  };
  alternatives?: number;
  seoOptimized?: boolean;
}

export interface HeadlineOutput {
  primaryHeadline: string;
  alternativeHeadlines: string[];
  seoScore: number;
  clickThroughRate: number; // Estimated
  keywords: string[];
}

// Article Writer Agent
export interface ArticleWriterInput {
  trend?: Trend;
  topic: string;
  category: string;
  targetLength: number; // words
  style: 'breaking' | 'analysis' | 'feature' | 'opinion';
  language?: string;
  knowledgeBase?: KnowledgeDocument[];
}

export interface ArticleWriterOutput {
  headline: string;
  alternativeHeadlines: string[];
  metaDescription: string;
  seoKeywords: string[];
  urlSlug: string;
  featuredImagePrompt: string;
  shortSummary: string;
  fullArticle: string;
  timeline: TimelineEntry[];
  background: string;
  faq: FAQEntry[];
  relatedLaws: string[];
  expertOpinions: ExpertOpinion[];
  suggestedRelated: string[];
  tags: string[];
  categories: string[];
  confidenceScore: number;
  sourcesUsed: string[];
  readabilityScore: number;
  seoScore: number;
  wordCount: number;
  readingTime: number; // minutes
}

export interface TimelineEntry {
  date: string;
  event: string;
  significance: string;
}

export interface FAQEntry {
  question: string;
  answer: string;
}

export interface ExpertOpinion {
  name: string;
  title: string;
  organization: string;
  quote: string;
  topic: string;
}

// SEO Agent
export interface SEOInput {
  article: {
    title: string;
    content: string;
    excerpt: string;
    category: string;
    tags: string[];
  };
  targetKeywords?: string[];
}

export interface SEOOutput {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  seoScore: number;
  readabilityScore: number;
  internalLinkSuggestions: string[];
  schemaMarkup: Record<string, unknown>;
  competitorAnalysis?: CompetitorAnalysis;
}

export interface CompetitorAnalysis {
  topResults: {
    title: string;
    url: string;
    wordCount: number;
    keywords: string[];
  }[];
  keywordDifficulty: number;
  recommendedApproach: string;
}

// Image Agent
export interface ImageInput {
  article: {
    title: string;
    content: string;
    category: string;
  };
  imageType: 'featured' | 'thumbnail' | 'social' | 'quote_card';
  style?: 'photo_realistic' | 'illustration' | 'infographic';
}

export interface ImageOutput {
  imageUrl: string;
  prompt: string;
  revisedPrompt: string;
  size: string;
  style: string;
  safetyRatings: SafetyRating[];
  aiGenerated: boolean;
  watermark: boolean;
}

export interface SafetyRating {
  category: string;
  score: number;
  severity: string;
}

// Translator Agent
export interface TranslatorInput {
  article: {
    title: string;
    content: string;
    excerpt: string;
  };
  targetLanguage: 'sw' | 'ar' | 'fr' | 'pt';
  preserveTone?: boolean;
}

export interface TranslatorOutput {
  title: string;
  content: string;
  excerpt: string;
  language: string;
  confidence: number;
  culturalAdaptations: string[];
  rtlLayout: boolean;
}

// Social Agent
export interface SocialInput {
  article: {
    title: string;
    excerpt: string;
    url: string;
    imageUrl?: string;
    category: string;
    tags: string[];
  };
  platforms: SocialPlatform[];
}

export type SocialPlatform = 'facebook' | 'twitter' | 'linkedin' | 'threads' | 'telegram' | 'whatsapp' | 'instagram';

export interface SocialOutput {
  posts: SocialPost[];
  scheduledAt?: string;
}

export interface SocialPost {
  platform: SocialPlatform;
  content: string;
  hashtags: string[];
  imageUrl?: string;
  characterCount: number;
  withinLimits: boolean;
}

// Publisher Agent
export interface PublisherInput {
  article: ArticleWriterOutput;
  factCheck: FactCheckOutput;
  seo: SEOOutput;
  images: ImageOutput[];
  translations?: TranslatorOutput[];
  social?: SocialOutput;
  scheduledAt?: string;
  editorialNotes?: string;
}

export interface PublisherOutput {
  articleId: string;
  status: 'published' | 'scheduled' | 'pending_review';
  publishedAt: string;
  url: string;
  socialPostsQueued: number;
  notificationsSent: number;
  auditLogId: string;
}

// Knowledge Base Types
export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  documentType: 'article' | 'style_guide' | 'policy' | 'report' | 'data' | 'rule';
  sourceUrl?: string;
  metadata: Record<string, unknown>;
  embedding?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeQuery {
  query: string;
  embedding?: number[];
  documentType?: string;
  matchCount?: number;
  matchThreshold?: number;
}

export interface KnowledgeSearchResult {
  document: KnowledgeDocument;
  similarity: number;
  relevanceScore: number;
}

// Agent Registry
export interface AgentRegistry {
  agents: Map<AgentType, AIAgent>;
  getAgent(type: AgentType): AIAgent | undefined;
  registerAgent(agent: AIAgent): void;
  getAgentMetrics(type: AgentType): AgentMetrics;
}

// Pipeline Orchestrator
export interface PipelineOrchestrator {
  createPipeline(context: PipelineContext): AIPipeline;
  executePipeline(pipeline: AIPipeline): Promise<PipelineResult>;
  getPipelineStatus(pipelineId: string): AIPipeline | undefined;
  getPipelineHistory(): AIPipeline[];
}

export interface PipelineResult {
  pipelineId: string;
  status: 'completed' | 'failed';
  outputs: Map<string, AgentOutput>;
  totalTokensUsed: number;
  totalDurationMs: number;
  error?: string;
  articleId?: string;
}
