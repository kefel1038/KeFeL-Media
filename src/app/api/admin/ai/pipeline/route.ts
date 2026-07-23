// AI Pipeline API Routes
// POST /api/admin/ai/pipeline - Run a new pipeline
// GET /api/admin/ai/pipeline - Get pipeline history

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getOrchestrator } from "@/lib/ai/orchestrator";
import { registerAllAgents } from "@/lib/ai/agents";

// Ensure agents are registered
let agentsRegistered = false;
function ensureAgents() {
  if (!agentsRegistered) {
    registerAllAgents();
    agentsRegistered = true;
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    ensureAgents();
    const orchestrator = getOrchestrator();
    
    const { topic, category, style, targetLength, sources, translateTo, publish } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { success: false, error: "Topic is required" },
        { status: 400 }
      );
    }

    // Create pipeline context
    const context = {
      pipelineId: `pipeline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      triggerSource: 'manual' as const,
      metadata: {
        topic,
        category: category || 'general',
        style: style || 'analysis',
        targetLength: targetLength || 800,
        sources: sources || [],
        translateTo: translateTo || [],
        publish: publish || false,
      },
    };

    // Create and execute pipeline
    const pipeline = orchestrator.createPipeline(context);
    const result = await orchestrator.executePipeline(pipeline);

    return NextResponse.json({
      success: true,
      pipeline: {
        id: result.pipelineId,
        status: result.status,
        totalTokensUsed: result.totalTokensUsed,
        totalDurationMs: result.totalDurationMs,
        articleId: result.articleId,
        outputs: Object.fromEntries(result.outputs),
      },
    });
  } catch (error) {
    console.error("Pipeline execution failed:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Pipeline failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    ensureAgents();
    const orchestrator = getOrchestrator();
    const history = orchestrator.getPipelineHistory();

    return NextResponse.json({
      success: true,
      pipelines: history.slice(0, 50).map((p) => ({
        id: p.id,
        name: p.name,
        status: p.status,
        startedAt: p.startedAt,
        completedAt: p.completedAt,
        error: p.error,
        resultsCount: p.results.size,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch pipeline history" },
      { status: 500 }
    );
  }
}
