// Fact Checker Agent
// Cross-references claims against reliable sources

import type {
  AgentInput,
  AgentOutput,
  FactCheckInput,
  FactCheckOutput,
  ClaimVerification,
  SourceReference,
} from '../types';
import { BaseAgent } from './base-agent';

export class FactCheckerAgent extends BaseAgent {
  name = 'Fact Checker';
  version = '1.0.0';
  description = 'Verifies claims and cross-references against reliable sources';
  protected agentType = 'fact_checker' as const;

  async execute(input: AgentInput): Promise<AgentOutput> {
    const startTime = Date.now();
    let tokensUsed = 0;

    try {
      const factCheckInput = input.data as unknown as FactCheckInput;
      const { article, sources = [], knowledgeBase = [] } = factCheckInput;

      if (!article || !article.content) {
        return this.createOutput(
          { verificationStatus: 'unconfirmed', verificationScore: 0, claimVerifications: [], sourcesUsed: [], confidence: 0 },
          0.1,
          'No article content to verify',
          ['no_content'],
          0,
          Date.now() - startTime
        );
      }

      // Extract claims from article
      const claims = await this.extractClaims(article.content);

      // Verify each claim
      const claimVerifications = await Promise.all(
        claims.map((claim) => this.verifyClaim(claim, knowledgeBase))
      );

      // Find additional sources
      const sourcesUsed = await this.findSources(article.title, claims);

      // Calculate overall verification score
      const verificationScore = this.calculateVerificationScore(claimVerifications);
      const verificationStatus = this.determineStatus(verificationScore, claimVerifications);

      tokensUsed = claims.length * 200 + sourcesUsed.length * 50;

      const output = this.createOutput(
        {
          verificationStatus,
          verificationScore,
          claimVerifications,
          sourcesUsed,
        },
        this.calculateConfidence(claimVerifications, sourcesUsed),
        `Verified ${claims.length} claims with ${sourcesUsed.length} sources`,
        this.generateFlags(claimVerifications, verificationStatus),
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
    const result = output.result as unknown as FactCheckOutput;
    return (
      typeof result.verificationScore === 'number' &&
      Array.isArray(result.claimVerifications) &&
      result.verificationScore >= 0 &&
      result.verificationScore <= 100
    );
  }

  private async extractClaims(content: string): Promise<string[]> {
    try {
      const prompt = `Extract the key factual claims from this news article that can be verified.
      
      Article content:
      ${content}
      
      Return a JSON array of factual claims that can be verified:
      [
        "Claim 1 that can be fact-checked",
        "Claim 2 that can be fact-checked"
      ]
      
      Focus on:
      - Statistics and numbers
      - Dates and times
      - Names and titles
      - Locations
      - Events that happened
      - Quotes and statements`;

      const systemPrompt = `You are a fact-checking AI. Extract verifiable factual claims from news articles.
      Only include claims that can be objectively verified.
      Return valid JSON only.`;

      const { content: result } = await this.callOpenAI(prompt, systemPrompt, {
        model: 'gpt-4o-mini',
        temperature: 0.2,
        responseFormat: { type: 'json_object' },
      });

      const parsed = JSON.parse(result);
      return parsed.claims || [];
    } catch (error) {
      // Fallback: simple claim extraction
      return this.extractClaimsSimple(content);
    }
  }

  private extractClaimsSimple(content: string): string[] {
    const claims: string[] = [];
    const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 20);
    
    sentences.forEach((sentence) => {
      const trimmed = sentence.trim();
      // Look for sentences with numbers, dates, or proper nouns
      if (/\d/.test(trimmed) || /[A-Z][a-z]+/.test(trimmed)) {
        claims.push(trimmed);
      }
    });

    return claims.slice(0, 10);
  }

  private async verifyClaim(
    claim: string,
    knowledgeBase: { content: string; title: string }[]
  ): Promise<ClaimVerification> {
    try {
      // First check knowledge base
      const kbMatch = this.checkKnowledgeBase(claim, knowledgeBase);
      if (kbMatch) {
        return kbMatch;
      }

      // Then use AI to verify
      const prompt = `Verify this factual claim: "${claim}"
      
      Consider:
      1. Is this claim likely true based on your knowledge?
      2. What evidence supports or contradicts it?
      3. What is your confidence level?
      
      Return a JSON object:
      {
        "status": "true" | "false" | "partially_true" | "unverified",
        "reasoning": "string explaining your verification",
        "confidence": number (0-1)
      }`;

      const systemPrompt = `You are a fact-checking AI. Verify factual claims accurately.
      Be objective and note uncertainty when appropriate.
      Return valid JSON only.`;

      const { content: result } = await this.callOpenAI(prompt, systemPrompt, {
        model: 'gpt-4o',
        temperature: 0.2,
        responseFormat: { type: 'json_object' },
      });

      const parsed = JSON.parse(result);
      return {
        claim,
        status: parsed.status || 'unverified',
        reasoning: parsed.reasoning || 'Unable to verify',
        sources: [],
        confidence: parsed.confidence || 0.5,
      };
    } catch (error) {
      return {
        claim,
        status: 'unverified',
        reasoning: `Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        sources: [],
        confidence: 0,
      };
    }
  }

  private checkKnowledgeBase(
    claim: string,
    knowledgeBase: { content: string; title: string }[]
  ): ClaimVerification | null {
    // Simple keyword matching (in production, use semantic search)
    const claimWords = claim.toLowerCase().split(/\s+/);
    
    for (const doc of knowledgeBase) {
      const docWords = doc.content.toLowerCase().split(/\s+/);
      const matchCount = claimWords.filter((word) => docWords.includes(word)).length;
      const matchRatio = matchCount / claimWords.length;

      if (matchRatio > 0.6) {
        return {
          claim,
          status: 'true',
          reasoning: `Found supporting evidence in knowledge base document: ${doc.title}`,
          sources: [{
            url: '',
            title: doc.title,
            publisher: 'Knowledge Base',
            publishedAt: new Date().toISOString(),
            credibilityScore: 0.9,
          }],
          confidence: matchRatio,
        };
      }
    }

    return null;
  }

  private async findSources(title: string, claims: string[]): Promise<SourceReference[]> {
    try {
      const prompt = `Find reliable sources to verify these claims about: "${title}"
      
      Claims to verify:
      ${claims.slice(0, 5).map((c, i) => `${i + 1}. ${c}`).join('\n')}
      
      Return a JSON array of sources:
      [
        {
          "url": "string",
          "title": "string",
          "publisher": "string",
          "publishedAt": "ISO date string",
          "credibilityScore": number (0-1)
        }
      ]
      
      Focus on:
      - Major news organizations
      - Official government sources
      - Academic institutions
      - Reputable fact-checking organizations`;

      const systemPrompt = `You are a research AI finding reliable sources for fact-checking.
      Only suggest credible, authoritative sources.
      Return valid JSON only.`;

      const { content: result } = await this.callOpenAI(prompt, systemPrompt, {
        model: 'gpt-4o-mini',
        temperature: 0.3,
        responseFormat: { type: 'json_object' },
      });

      const parsed = JSON.parse(result);
      return parsed.sources || [];
    } catch (error) {
      return [];
    }
  }

  private calculateVerificationScore(verifications: ClaimVerification[]): number {
    if (verifications.length === 0) return 0;

    const scores: number[] = verifications.map((v) => {
      switch (v.status) {
        case 'true': return 100;
        case 'partially_true': return 60;
        case 'unverified': return 30;
        case 'false': return 0;
        default: return 30;
      }
    });

    const weightedSum = scores.reduce<number>((sum, score, i) => 
      sum + score * verifications[i].confidence, 0);
    const totalWeight = verifications.reduce<number>((sum, v) => sum + v.confidence, 0);

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  }

  private determineStatus(
    score: number,
    verifications: ClaimVerification[]
  ): FactCheckOutput['verificationStatus'] {
    if (score >= 80) return 'verified';
    if (score >= 60) return 'developing';
    if (score >= 40) return 'unconfirmed';
    if (verifications.some((v) => v.status === 'false')) return 'opinion';
    return 'analysis';
  }

  private calculateConfidence(
    verifications: ClaimVerification[],
    sources: SourceReference[]
  ): number {
    if (verifications.length === 0) return 0.1;

    const avgClaimConfidence = verifications.reduce((sum, v) => sum + v.confidence, 0) / verifications.length;
    const sourceFactor = Math.min(sources.length / 5, 1);
    
    return avgClaimConfidence * 0.7 + sourceFactor * 0.3;
  }

  private generateFlags(
    verifications: ClaimVerification[],
    status: FactCheckOutput['verificationStatus']
  ): string[] {
    const flags: string[] = [];
    
    if (verifications.some((v) => v.status === 'false')) flags.push('false_claims_detected');
    if (verifications.some((v) => v.confidence < 0.3)) flags.push('low_confidence_claims');
    if (status === 'unconfirmed') flags.push('needs_human_review');
    if (verifications.length > 10) flags.push('complex_article');
    
    return flags;
  }
}
