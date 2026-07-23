// AI Agents Status API Route
// GET /api/admin/ai/agents - Get agent status and metrics

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { getOrchestrator } from "@/lib/ai/orchestrator";
import { registerAllAgents, getAgentStatus } from "@/lib/ai/agents";
import type { AgentType } from "@/lib/ai/types";

// Ensure agents are registered
let agentsRegistered = false;
function ensureAgents() {
  if (!agentsRegistered) {
    registerAllAgents();
    agentsRegistered = true;
  }
}

export async function GET() {
  try {
    ensureAgents();
    const { registered, metrics } = getAgentStatus();
    const orchestrator = getOrchestrator();

    const agents = registered.map((type) => {
      const agent = orchestrator.getAgent(type as AgentType);
      const agentMetrics = metrics[type] || {};

      return {
        type,
        name: agent?.name || type,
        version: agent?.version || '1.0.0',
        description: agent?.description || '',
        metrics: {
          totalRuns: (agentMetrics as Record<string, unknown>).totalRuns || 0,
          successRate: (agentMetrics as Record<string, unknown>).successRate || 0,
          averageConfidence: (agentMetrics as Record<string, unknown>).averageConfidence || 0,
          averageDurationMs: (agentMetrics as Record<string, unknown>).averageDurationMs || 0,
          totalTokensUsed: (agentMetrics as Record<string, unknown>).totalTokensUsed || 0,
          errorRate: (agentMetrics as Record<string, unknown>).errorRate || 0,
          lastRunAt: (agentMetrics as Record<string, unknown>).lastRunAt || null,
        },
      };
    });

    return NextResponse.json({
      success: true,
      agents,
      totalRegistered: agents.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch agent status" },
      { status: 500 }
    );
  }
}
