// Pipeline Monitor Cron Job
// Runs every 5 minutes to monitor pipeline health

import { NextResponse } from "next/server";
import { getOrchestrator } from "@/lib/ai/orchestrator";

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orchestrator = getOrchestrator();
    const history = orchestrator.getPipelineHistory();

    // Check for stuck pipelines
    const stuckPipelines = history.filter((p) => {
      if (p.status !== 'running') return false;
      if (!p.startedAt) return false;
      const startedAt = new Date(p.startedAt).getTime();
      const now = Date.now();
      return now - startedAt > 5 * 60 * 1000; // 5 minutes
    });

    // Get recent stats
    const recentPipelines = history.slice(0, 100);
    const successCount = recentPipelines.filter((p) => p.status === 'completed').length;
    const failedCount = recentPipelines.filter((p) => p.status === 'failed').length;
    const runningCount = recentPipelines.filter((p) => p.status === 'running').length;

    console.log(`Pipeline monitor: ${successCount} success, ${failedCount} failed, ${runningCount} running`);

    return NextResponse.json({
      success: true,
      stats: {
        total: recentPipelines.length,
        success: successCount,
        failed: failedCount,
        running: runningCount,
        stuck: stuckPipelines.length,
      },
      stuckPipelines: stuckPipelines.map((p) => ({
        id: p.id,
        startedAt: p.startedAt,
        error: p.error,
      })),
    });
  } catch (error) {
    console.error("Pipeline monitor failed:", error);
    return NextResponse.json(
      { success: false, error: "Monitor failed" },
      { status: 500 }
    );
  }
}
