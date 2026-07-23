// Trending Topics Cron Job
// Runs every 15 minutes to update trending topics

import { NextResponse } from "next/server";
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

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    ensureAgents();
    const orchestrator = getOrchestrator();

    // Create pipeline for trending analysis
    const context = {
      pipelineId: `cron-trending-${Date.now()}`,
      triggerSource: 'cron' as const,
      metadata: {
        sources: [],
        topics: ['trending', 'viral', 'hot-topics'],
        region: 'global',
      },
    };

    const pipeline = orchestrator.createPipeline(context);
    const result = await orchestrator.executePipeline(pipeline);

    console.log(`Trending topics updated: ${result.status}`);

    return NextResponse.json({
      success: true,
      pipelineId: result.pipelineId,
      status: result.status,
      durationMs: result.totalDurationMs,
    });
  } catch (error) {
    console.error("Trending topics cron failed:", error);
    return NextResponse.json(
      { success: false, error: "Cron job failed" },
      { status: 500 }
    );
  }
}
