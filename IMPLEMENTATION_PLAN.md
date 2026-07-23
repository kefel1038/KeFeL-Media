# AI-Powered Digital Newsroom — Implementation Plan v2.0

## Transform Kefel Media from its current basic news website into a world-class AI-powered digital media platform.

The existing codebase is a Next.js 16 app with Supabase, Tailwind CSS v4, basic articles/categories, a simple admin CMS, and cookie-based authentication. This plan builds incrementally on top of that foundation.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Website  │  │ Mobile   │  │ Public   │  │ Partner  │       │
│  │ (Next.js)│  │ Apps     │  │ API      │  │ Feeds    │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    API GATEWAY                                   │
│  Rate Limiting · Auth · Routing · Versioning                    │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    SERVICE LAYER                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ AI       │  │ Trend    │  │ CMS      │  │ Analytics│       │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Social   │  │ Search   │  │ Notif.   │  │ Media    │       │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │PostgreSQL│  │ Supabase │  │ Vector   │  │ Redis    │       │
│  │ (Supabase│  │ Storage  │  │ Store    │  │ Cache    │       │
│  │  + pgvec)│  │          │  │ (pgvec)  │  │          │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

---

## AI Agent Architecture

Each agent is a specialized, independent unit. They communicate via a pipeline:

```
┌─────────────┐
│ News Scout  │ ← RSS feeds, APIs, social media, Google Trends
└──────┬──────┘
       ▼
┌─────────────┐
│ Dedup Agent │ ← Semantic similarity + fingerprinting
└──────┬──────┘
       ▼
┌─────────────┐
│Fact Checker │ ← Cross-reference sources, verify claims
└──────┬──────┘
       ▼
┌─────────────┐
│ Headline    │ ← SEO-optimized, engaging, accurate
│ Writer      │
└──────┬──────┘
       ▼
┌─────────────┐
│ Article     │ ← Full article generation with RAG context
│ Writer      │
└──────┬──────┘
       ▼
┌─────────────┐
│ SEO Agent   │ ← Metadata, schema, internal linking, score
└──────┬──────┘
       ▼
┌─────────────┐
│ Image Agent │ ← DALL-E 3 illustrations, thumbnails, cards
└──────┬──────┘
       ▼
┌─────────────┐
│ Translator  │ ← EN → SW → AR → FR → PT
│ Agent       │
└──────┬──────┘
       ▼
┌─────────────┐
│ Social      │ ← Platform-specific formatting + scheduling
│ Agent       │
└──────┬──────┘
       ▼
┌─────────────┐
│ Publisher   │ ← Final review, compliance, publish
│ Agent       │
└─────────────┘
```

### Agent Interface

```typescript
interface AIAgent {
  name: string;
  version: string;
  input: AgentInput;
  output: AgentOutput;
  execute(input: AgentInput): Promise<AgentOutput>;
  validate(output: AgentOutput): boolean;
}

interface AgentInput {
  data: Record<string, unknown>;
  context: PipelineContext;
  knowledgeBase?: KnowledgeBaseQuery[];
}

interface AgentOutput {
  result: Record<string, unknown>;
  confidence: number;
  reasoning: string;
  flags: string[];
  tokensUsed: number;
  durationMs: number;
}

interface PipelineContext {
  pipelineId: string;
  articleId?: string;
  userId?: string;
  previousOutputs: Map<string, AgentOutput>;
  knowledgeBaseResults: KnowledgeDocument[];
}
```

---

## Knowledge Base (RAG)

### Sources
- Previous KeFeL Media articles (embeddings)
- Editorial style guide
- Fact-checking rules and procedures
- Government reports and public documents
- Newsroom policies and standards
- Regional statistics and data

### Architecture
```
Documents → Chunking → Embedding → pgvector Storage
                                        ↓
Query → Embedding → Vector Search → Top-K Results → Agent Context
```

### Implementation
```sql
CREATE TABLE knowledge_documents (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  document_type TEXT, -- 'article', 'style_guide', 'policy', 'report', 'data'
  source_url TEXT,
  embedding vector(1536),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ON knowledge_documents USING hnsw (embedding vector_cosine_ops);
```

---

## Multi-Region Deployment

```
┌─────────────────────────────────────────────────────┐
│                    CDN (Cloudflare)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ East     │  │ Europe   │  │ Middle   │          │
│  │ Africa   │  │          │  │ East     │          │
│  │ Edge     │  │ Edge     │  │ Edge     │          │
│  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────┐
│              Primary Region (US)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐          │
│  │ App      │  │ AI       │  │ Worker   │          │
│  │ Servers  │  │ Service  │  │ Processes│          │
│  └──────────┘  └──────────┘  └──────────┘          │
└─────────────────────────────────────────────────────┘
```

---

## Current State Summary

| Layer | What Exists |
|-------|-------------|
| Frontend | Homepage with hero, trending, latest feed, sidebar, category pages, article pages, search, newsletter, about/contact/privacy/terms/careers/advertise pages |
| Admin CMS | Dashboard, articles CRUD, categories, tags, media library, comments, newsletter, users, analytics, advertisements, breaking news, trending, settings |
| API Routes | /api/admin/auth, /api/admin/articles, /api/admin/ai, /api/admin/media, /api/admin/newsletter, /api/admin/stats, /api/admin/users, /api/seed, /api/analytics, /api/contact |
| Database | Supabase tables: articles, categories, profiles, subscribers, newsletter_campaigns, contact_messages |
| Auth | Cookie-based HMAC session tokens, roles: super_admin, editor, journalist, photographer, social_manager |
| Styling | Tailwind CSS v4 with @theme block, dark theme default, Inter + Playfair Display fonts, brand color #D32F2F |
| AI | OpenAI integration stub in /api/admin/ai (key not yet configured) |

---

## Open Questions

1. **OpenAI Model Preference:** gpt-4o for article writing, gpt-4o-mini for metadata/translations
2. **Supabase Auth vs Current Auth:** Keep current system + separate reader accounts
3. **RSS Feed Sources:** Free/public RSS feeds first, stub paid integrations
4. **Image Generation:** OpenAI DALL-E 3 (integrated with existing OpenAI setup)
5. **Deployment Target:** Vercel + Cloudflare CDN for global edge caching

---

# Phase 1: Foundation & Design System Overhaul ✅ COMPLETED

**Scope:** Database schema expansion, design system, redesigned UI, expanded categories, SEO system
**Estimated Files:** ~45 new/modified files
**Depends on:** Nothing (first phase)

## Status: COMPLETED

### What Was Implemented

- [x] 1A. Database Schema Expansion (migration-010-full-schema.sql + migration-012-performance-indexes.sql)
- [x] 1B. Design System & UI Redesign (design tokens, CSS, layout, header, footer, homepage)
- [x] 1C. Expanded Categories (16 categories with icons and accent colors)
- [x] 1D. SEO System (JSON-LD, OpenGraph, sitemap, RSS/Atom feeds)
- [x] 1E. Enhanced Article Page (reading progress, reactions, share, TOC)
- [x] 1F. New UI Components (8 new components)

---

# Phase 2: AI Core Engine + Knowledge Base (RAG)

**Scope:** News monitoring, trend detection, fact verification, AI news writer, knowledge base, semantic search
**Estimated Files:** ~50 new/modified files
**Depends on:** Phase 1 (database schema)

## 2A. Knowledge Base (RAG)

### Schema
```sql
-- Knowledge Base for RAG
CREATE TABLE knowledge_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('article', 'style_guide', 'policy', 'report', 'data', 'rule')),
  source_url TEXT,
  embedding vector(1536),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ON knowledge_documents USING hnsw (embedding vector_cosine_ops);

-- Knowledge Base Query Function
CREATE OR REPLACE FUNCTION match_knowledge(
  query_embedding vector(1536),
  match_count INT DEFAULT 5,
  match_threshold FLOAT DEFAULT 0.7
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  document_type TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kd.id,
    kd.title,
    kd.content,
    kd.document_type,
    1 - (kd.embedding <=> query_embedding) AS similarity
  FROM knowledge_documents kd
  WHERE 1 - (kd.embedding <=> query_embedding) > match_threshold
  ORDER BY kd.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

### Services
- `src/lib/ai/knowledge/embedder.ts` — Document chunking and embedding
- `src/lib/ai/knowledge/retriever.ts` — Vector search and retrieval
- `src/lib/ai/knowledge/ingester.ts` — Document ingestion pipeline

## 2B. AI News Monitoring Engine

- `src/lib/ai/monitoring/source-registry.ts` — Registry of monitored sources
- `src/lib/ai/monitoring/rss-fetcher.ts` — RSS feed parser
- `src/lib/ai/monitoring/web-scraper.ts` — Lightweight web scraper
- `src/lib/ai/monitoring/google-trends.ts` — Google Trends integration
- `src/lib/ai/monitoring/social-monitor.ts` — Reddit/YouTube/social monitoring
- `src/lib/ai/monitoring/source-normalizer.ts` — Content normalization
- `src/lib/ai/monitoring/deduplication.ts` — Fingerprint-based duplicate detection

### Cron Endpoint
- `src/app/api/cron/monitor/route.ts` — Runs every 5-10 minutes
- `vercel.json` — Cron job configuration

## 2C. Trend Detection System

- `src/lib/ai/trends/trend-analyzer.ts` — Trending pattern analysis
- `src/lib/ai/trends/scoring.ts` — Viral score, importance, urgency, credibility
- `src/lib/ai/trends/trend-ranker.ts` — Rank and cluster related stories

## 2D. AI Fact Verification

- `src/lib/ai/verification/fact-checker.ts` — Cross-reference claims
- `src/lib/ai/verification/confidence-scorer.ts` — Confidence scores
- `src/lib/ai/verification/source-credibility.ts` — Source credibility ratings

## 2E. AI News Writer (with RAG)

- `src/lib/ai/writer/article-generator.ts` — Full article generation pipeline
- `src/lib/ai/writer/headline-generator.ts` — SEO headline + alternatives
- `src/lib/ai/writer/metadata-generator.ts` — Meta description, keywords, slug
- `src/lib/ai/writer/content-enhancer.ts` — Timeline, background, FAQ
- `src/lib/ai/writer/prompts.ts` — All LLM prompt templates
- `src/lib/ai/writer/style-guide.ts` — Writing style constraints

### Generated Output Structure
```typescript
interface AIDraft {
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
}
```

## 2F. Semantic Duplicate Detection

- `src/lib/ai/deduplication/semantic-similarity.ts` — Embedding-based similarity
- `src/lib/ai/deduplication/fingerprint.ts` — Title + content hashing
- `src/lib/ai/deduplication/cluster.ts` — Group related stories

### Detection Logic
```typescript
// Three-tier detection:
// 1. Exact title match (fingerprint)
// 2. Semantic similarity > 0.85 (embedding)
// 3. Same event detection (entity extraction + clustering)

interface DuplicateCluster {
  id: string;
  primaryStory: NewsItem;
  relatedStories: NewsItem[];
  similarityScore: number;
  mergedSummary: string;
}
```

## 2G. AI Search Service

- `src/lib/ai/search/semantic-search.ts` — Vector-based semantic search
- `src/lib/ai/search/keyword-search.ts` — Traditional keyword search
- `src/lib/ai/search/hybrid-search.ts` — Combined approach

---

# Phase 3: AI Newsroom Dashboard + Editorial Workflow

**Scope:** AI Newsroom command center, editorial dashboard, version history, collaborative editing, role permissions, audit log
**Estimated Files:** ~40 new/modified files
**Depends on:** Phase 2 (AI drafts feed into editorial)

## 3A. AI Newsroom Dashboard

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│  AI NEWSROOM                                              [LIVE] │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ Live     │ │ Breaking │ │ Pending  │ │ AI       │ │ Editor   │ │
│ │ Trends   │ │ News     │ │ Verify   │ │ Drafts   │ │ Queue    │ │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│ │ Scheduled│ │ Published│ │ Social   │ │ Analytics│ │ AI       │ │
│ │ Stories  │ │ Stories  │ │ Queue    │ │          │ │ Agents   │ │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Pages
- `src/app/admin/newsroom/page.tsx` — Main AI Newsroom dashboard
- `src/app/admin/newsroom/trends/page.tsx` — Live trending topics
- `src/app/admin/newsroom/breaking/page.tsx` — Breaking news feed
- `src/app/admin/newsroom/verify/page.tsx` — Pending verification
- `src/app/admin/newsroom/drafts/page.tsx` — AI-generated drafts
- `src/app/admin/newsroom/queue/page.tsx` — Editor review queue
- `src/app/admin/newsroom/scheduled/page.tsx` — Scheduled stories
- `src/app/admin/newsroom/published/page.tsx` — Published stories
- `src/app/admin/newsroom/social/page.tsx` — Social media queue
- `src/app/admin/newsroom/analytics/page.tsx` — AI analytics
- `src/app/admin/newsroom/agents/page.tsx` — AI agent monitoring
- `src/app/admin/newsroom/knowledge/page.tsx` — Knowledge base management

## 3B. Enhanced Editorial Dashboard

### Article Kanban View
```
┌─────────────────────────────────────────────────────────────────┐
│  ARTICLES                                                       │
├─────────┬─────────┬─────────┬─────────┬─────────┬─────────────┤
│ Draft   │ Review  │ Approved│Schedule │Published│ Archived    │
│ (12)    │ (5)     │ (3)     │ (8)     │ (156)   │ (23)        │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────────┤
│ [Card]  │ [Card]  │ [Card]  │ [Card]  │ [Card]  │ [Card]      │
│ [Card]  │ [Card]  │ [Card]  │ [Card]  │ [Card]  │ [Card]      │
│ ...     │ ...     │ ...     │ ...     │ ...     │ ...         │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────────┘
```

### Pages
- `src/app/admin/articles/page.tsx` — Kanban view
- `src/app/admin/articles/[id]/review/page.tsx` — Side-by-side review
- `src/app/admin/articles/[id]/versions/page.tsx` — Version history with diff
- `src/app/admin/articles/[id]/preview/page.tsx` — Public preview mode

## 3C. Article Lifecycle

States: `draft → in_review → approved → scheduled → published → archived`

- High-risk content (elections, health, crime, security, conflict) requires editor approval
- All state transitions logged in audit_log
- Schedule publishing with scheduled_at timestamp
- Cron job to auto-publish scheduled articles

## 3D. Role Permissions

```typescript
type Role = 'super_admin' | 'editor' | 'journalist' | 'photographer' | 'social_manager' | 'publisher';

const permissions = {
  reporter: ['create_draft', 'submit_for_review', 'view_own_drafts'],
  editor: ['approve', 'reject', 'edit', 'schedule', 'publish', 'view_all'],
  administrator: ['*'], // Full access
  publisher: ['publish', 'manage_social'],
};
```

## 3E. Collaborative Editing

- `src/lib/collaborative/editor-presence.ts` — Track who's editing (Supabase Realtime)
- `src/lib/collaborative/editor-notes.ts` — Inline editor notes
- `src/lib/collaborative/ai-suggestions.ts` — AI-powered suggestions panel

---

# Phase 4: Multilingual, Reader Features & AI Enhancements

**Scope:** Translation system, reader accounts, AI reader features, recommendation engine, AI image generation
**Estimated Files:** ~50 new/modified files
**Depends on:** Phase 3 (needs published articles)

## 4A. AI Translation System

- `src/lib/ai/translation/translator.ts` — GPT-4 translation with context
- `src/lib/ai/translation/language-config.ts` — Languages: EN, SW, AR, FR, PT
- `src/lib/ai/translation/rtl-utils.ts` — RTL detection and layout

### Routes
- `src/app/[locale]/(i18n routing)` — Locale-prefixed routes

## 4B. Reader Accounts & Personalization

- `src/app/account/page.tsx` — Profile, preferences, reading history
- `src/app/account/bookmarks/page.tsx` — Saved articles
- `src/app/account/following/page.tsx` — Followed topics/authors
- `src/app/account/settings/page.tsx` — Language, theme, notifications
- `src/lib/supabase-auth.ts` — Supabase Auth for readers

## 4C. AI Reader Features

- `src/components/reader/AISummary.tsx` — 30s / 2min / full summary
- `src/components/reader/ListenToArticle.tsx` — Text-to-Speech
- `src/components/reader/FactCheckPanel.tsx` — Verification status
- `src/components/reader/ArticleTimeline.tsx` — Visual timeline
- `src/components/reader/TopicExplorer.tsx` — Related topics deep-dive
- `src/components/reader/AIChatAssistant.tsx` — Floating chat widget

## 4D. AI Image Generation

- `src/lib/ai/images/image-generator.ts` — DALL-E 3 integration
- `src/lib/ai/images/image-safety.ts` — Policy enforcement
- `src/lib/ai/images/image-labeling.ts` — AI-generated watermark

## 4E. AI Recommendation Engine

- `src/lib/ai/recommendations/recommender.ts` — Multi-factor recommendations:
  - Reading history
  - Location/region
  - Preferred categories
  - Language
  - Trending score
  - Content similarity (embedding-based)

---

# Phase 5: Social Media, Notifications, Monetization & AI Studios

**Scope:** Social media automation, notification system, monetization, AI Video/Podcast studios, analytics
**Estimated Files:** ~60 new/modified files
**Depends on:** Phase 4 (needs translations and images)

## 5A. Social Media Automation

- `src/lib/social/platform-adapters/facebook.ts`
- `src/lib/social/platform-adapters/twitter.ts`
- `src/lib/social/platform-adapters/linkedin.ts`
- `src/lib/social/platform-adapters/threads.ts`
- `src/lib/social/platform-adapters/telegram.ts`
- `src/lib/social/platform-adapters/whatsapp.ts`
- `src/lib/social/platform-adapters/instagram.ts`
- `src/lib/social/content-optimizer.ts` — AI-powered platform optimization
- `src/lib/social/scheduler.ts` — Post scheduling queue

### Pages
- `src/app/admin/social/page.tsx` — Social media dashboard
- `src/app/admin/social/compose/page.tsx` — Compose and preview
- `src/app/admin/social/queue/page.tsx` — Scheduled posts
- `src/app/admin/social/analytics/page.tsx` — Social analytics

## 5B. AI Video Studio

### Capabilities
- YouTube Shorts (60s vertical)
- TikTok videos
- Instagram Reels
- Facebook Reels

### Pipeline
```
Headline + Article + Images → AI Voice → Captions → Background Music → Composite → Publish
```

### Files
- `src/lib/ai/video/script-generator.ts` — Generate video scripts
- `src/lib/ai/video/voice-synthesizer.ts` — Text-to-speech (OpenAI TTS)
- `src/lib/ai/video/caption-generator.ts` — Auto-captions
- `src/lib/ai/video/compositor.ts` — Video assembly
- `src/lib/ai/video/platform-adapter.ts` — Platform-specific formatting

## 5C. AI Podcast Generator

### Pipeline
```
Today's Top Stories → Podcast Script → AI Voices → Music Bed → Mix → Publish
```

### Files
- `src/lib/ai/podcast/script-writer.ts` — Generate podcast scripts
- `src/lib/ai/podcast/voice-selector.ts` — Choose appropriate voices
- `src/lib/ai/podcast/audio-mixer.ts` — Mix voices + music
- `src/lib/ai/podcast/publisher.ts` — Publish to podcast platforms

## 5D. Notification System

- `src/lib/notifications/push.ts` — Web Push Notifications
- `src/lib/notifications/email.ts` — Email newsletter templates
- `src/lib/notifications/telegram-bot.ts` — Telegram channel alerts
- `src/lib/notifications/digest.ts` — Daily/weekly digest generator
- `src/lib/notifications/personalized.ts` — Per-user preferences

## 5E. AI Newsletter Generator

### Types
- Morning Brief (6 AM)
- Evening Brief (6 PM)
- Weekly Digest (Sunday)
- Monthly Review (1st of month)

### Files
- `src/lib/ai/newsletter/brief-generator.ts` — Generate briefs
- `src/lib/ai/newsletter/template-engine.ts` — Email templates
- `src/lib/ai/newsletter/scheduler.ts` — Delivery scheduling

## 5F. Analytics Dashboard

### Enhanced Analytics
- Visitor count, unique visitors, page views
- Average reading time per article
- Bounce rate estimation
- Social shares tracking
- Top stories by views, shares, reading time
- Traffic sources breakdown
- Category performance
- Search terms (internal search)
- Geographic distribution
- Real-time active readers
- SEO performance (CTR estimates)

## 5G. AI Analytics Insights

### Files
- `src/lib/ai/analytics/insight-generator.ts` — Generate natural language insights
- `src/lib/ai/analytics/predictor.ts` — Predict article performance
- `src/lib/ai/analytics/audience-analyzer.ts` — Audience behavior analysis

### Example Insights
```typescript
interface AIInsight {
  type: 'audience' | 'content' | 'performance' | 'trend';
  title: string;
  description: string;
  data: Record<string, unknown>;
  confidence: number;
  actionable: boolean;
  recommendation?: string;
}

// Example:
// "Technology stories have 30% longer reading times than average"
// "Readers who like AI articles often also read business stories"
// "This story performs well among readers aged 25-34 in Uganda"
```

## 5H. Monetization

- `src/components/monetization/AdBanner.tsx` — Configurable ad banner
- `src/components/monetization/PremiumGate.tsx` — Paywall for premium
- `src/components/monetization/DonationWidget.tsx` — Support button
- `src/components/monetization/SponsoredLabel.tsx` — Clear labeling

### AI Advertisement Manager
- `src/lib/ai/ads/targeting.ts` — Topic/interest/location-based targeting
- `src/lib/ai/ads/optimizer.ts` — A/B testing and optimization
- `src/lib/ai/ads/compliance.ts` — Privacy and consent management

### Pages
- `src/app/admin/monetization/page.tsx` — Revenue dashboard
- `src/app/admin/monetization/ads/page.tsx` — Ad management
- `src/app/admin/monetization/memberships/page.tsx` — Membership tiers

---

# Phase 6: Security, Compliance & Performance

**Scope:** Performance optimization, security hardening, compliance, final polish
**Estimated Files:** ~30 new/modified files
**Depends on:** All previous phases

## 6A. Performance Optimization

- Image optimization with next/image and WebP/AVIF
- Lazy loading for below-fold content
- React Server Components for data-heavy pages
- Route-level code splitting
- Supabase query optimization
- Static generation for category landing pages with ISR
- Edge caching headers (Cloudflare)
- Bundle analysis and tree-shaking audit
- Target: 95+ Lighthouse score

## 6B. Security Hardening

- Rate limiting on all API routes
- CSRF protection for mutations
- Input sanitization
- Audit log for all admin actions
- Backup system via Supabase automated backups
- Environment variable validation at startup
- CSP headers enhancement
- OWASP Top 10 compliance checklist

## 6C. Compliance & Editorial Standards

- AI-assisted content labeled internally
- Source attribution in generated articles
- Copyright respect in RSS monitoring
- Human approval required for high-risk topics
- Audit trail for all edits, approvals, publications
- "Report Correction" button on public articles

## 6D. Accessibility

- WCAG 2.1 AA compliance
- Proper heading hierarchy
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader optimization
- Reduced motion preferences
- High contrast mode support

## 6E. Mobile App API

### Design Principles
- RESTful API with versioning (`/api/v1/`)
- JWT authentication for mobile clients
- Pagination with cursor-based navigation
- Rate limiting per API key
- Offline-first data sync support

### Endpoints
```
GET  /api/v1/articles          — List articles
GET  /api/v1/articles/:id      — Get article
GET  /api/v1/categories        — List categories
GET  /api/v1/trending          — Trending stories
GET  /api/v1/search?q=...      — Search articles
POST /api/v1/auth/login        — Mobile login
POST /api/v1/auth/refresh      — Refresh token
GET  /api/v1/user/bookmarks    — User bookmarks
POST /api/v1/user/bookmarks    — Add bookmark
DELETE /api/v1/user/bookmarks/:id — Remove bookmark
```

## 6F. Public API

### For Partners
```
GET  /api/public/v1/latest     — Latest articles
GET  /api/public/v1/categories — All categories
GET  /api/public/v1/breaking   — Breaking news
GET  /api/public/v1/rss        — RSS feed
GET  /api/public/v1/search     — Search articles
```

### API Key Management
- `src/app/admin/api-keys/page.tsx` — Manage partner API keys
- `src/lib/api-keys/validator.ts` — API key validation
- `src/lib/api-keys/rate-limiter.ts` — Per-key rate limiting

---

# Verification Plan

## Automated Tests
```bash
npm run build          # TypeScript compilation + Next.js build
npm run lint           # ESLint checks
npm run test           # Unit tests (when added)
```

## Manual Verification

### Phase 1 ✅
- Homepage redesign with Just In strip, Topic Explorer, Category sections
- Dark/light mode toggle working
- Category navigation with icons
- Article page with breadcrumbs, share toolbar, bookmark, tags
- SEO metadata visible in page source

### Phase 2
- Test AI monitoring cron endpoint
- Verify trending dashboard shows trends
- Test article generation from trending topic
- Verify RAG knowledge base retrieval
- Test semantic duplicate detection

### Phase 3
- Test editorial workflow (draft → review → approve → publish)
- Verify audit log entries
- Test role-based access control
- Test AI Newsroom dashboard

### Phase 4
- Test translation flow (EN → SW → AR)
- Verify Arabic RTL layout
- Test AI summaries (30s / 2min / full)
- Test reader account registration
- Test semantic search

### Phase 5
- Test social media post composition and preview
- Test AI Video generation
- Test AI Podcast generation
- Verify notification delivery
- Test analytics tracking

### Phase 6
- Run Lighthouse audit (target 95+)
- Security audit
- Accessibility audit (WCAG 2.1 AA)
- Mobile API testing
- Public API testing

---

# Summary

## Architecture
- Microservice-ready service layer
- Specialized AI agent pipeline
- RAG knowledge base with pgvector
- Multi-region CDN deployment

## Reader Experience
- Personalized homepage
- AI summaries and chat
- Semantic search
- Multi-language support
- Mobile apps

## Publishing
- AI Newsroom command center
- Automated video/podcast generation
- Social media automation
- Newsletter generation

## Editorial
- Kanban workflow
- Collaborative editing
- Version history
- Audit trail

## AI Engine
- 10 specialized agents
- Knowledge base (RAG)
- Semantic duplicate detection
- Fact verification
- Multi-language translation

## Data Sources
- RSS feeds
- News APIs
- Social media
- Google Trends
- Knowledge base

## Monetization
- Smart ad targeting
- Premium content
- Donations
- Public API partnerships

---

*Last Updated: Phase 1 Completed*
*Next Phase: Phase 2 — AI Core Engine + Knowledge Base (RAG)*
