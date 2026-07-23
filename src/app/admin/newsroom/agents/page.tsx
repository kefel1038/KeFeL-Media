"use client";

import { useState } from "react";
import { Bot, Activity, Clock, Zap, CheckCircle, AlertTriangle, RefreshCw } from "lucide-react";

const agents = [
  {
    name: "News Scout",
    description: "Monitors RSS feeds, APIs, and social media for breaking news",
    status: "active",
    lastRun: "2 min ago",
    totalRuns: 1247,
    successRate: 98.5,
    avgDuration: "3.2s",
    tokensUsed: "12.4K",
    lastError: null,
  },
  {
    name: "Dedup Agent",
    description: "Detects and merges duplicate stories using semantic similarity",
    status: "active",
    lastRun: "5 min ago",
    totalRuns: 892,
    successRate: 95.2,
    avgDuration: "1.8s",
    tokensUsed: "8.7K",
    lastError: null,
  },
  {
    name: "Fact Checker",
    description: "Verifies claims against multiple sources and knowledge base",
    status: "active",
    lastRun: "8 min ago",
    totalRuns: 654,
    successRate: 92.1,
    avgDuration: "5.4s",
    tokensUsed: "18.9K",
    lastError: null,
  },
  {
    name: "Headline Writer",
    description: "Generates SEO-optimized, engaging headlines",
    status: "active",
    lastRun: "10 min ago",
    totalRuns: 1102,
    successRate: 97.8,
    avgDuration: "2.1s",
    tokensUsed: "6.3K",
    lastError: null,
  },
  {
    name: "Article Writer",
    description: "Generates full articles with RAG context",
    status: "active",
    lastRun: "12 min ago",
    totalRuns: 423,
    successRate: 96.5,
    avgDuration: "15.2s",
    tokensUsed: "45.6K",
    lastError: null,
  },
  {
    name: "SEO Agent",
    description: "Optimizes metadata, schema markup, and internal linking",
    status: "active",
    lastRun: "15 min ago",
    totalRuns: 1089,
    successRate: 99.1,
    avgDuration: "1.5s",
    tokensUsed: "4.2K",
    lastError: null,
  },
  {
    name: "Image Agent",
    description: "Generates featured images, thumbnails, and social cards",
    status: "idle",
    lastRun: "1 hour ago",
    totalRuns: 312,
    successRate: 94.3,
    avgDuration: "8.7s",
    tokensUsed: "2.1K",
    lastError: null,
  },
  {
    name: "Translator",
    description: "Translates articles to Swahili, Arabic, French, Portuguese",
    status: "active",
    lastRun: "30 min ago",
    totalRuns: 234,
    successRate: 96.8,
    avgDuration: "6.3s",
    tokensUsed: "22.4K",
    lastError: null,
  },
  {
    name: "Social Agent",
    description: "Formats and queues posts for all social platforms",
    status: "active",
    lastRun: "20 min ago",
    totalRuns: 876,
    successRate: 98.2,
    avgDuration: "1.2s",
    tokensUsed: "3.8K",
    lastError: null,
  },
  {
    name: "Publisher",
    description: "Final review, compliance check, and publishing",
    status: "active",
    lastRun: "25 min ago",
    totalRuns: 412,
    successRate: 99.5,
    avgDuration: "0.8s",
    tokensUsed: "1.2K",
    lastError: null,
  },
];

const pipelineHistory = [
  { id: "pipe-001", topic: "Uganda's Digital Economy Bill", status: "completed", duration: "45s", agents: 10, tokens: "89.2K" },
  { id: "pipe-002", topic: "East African Trade Agreement", status: "completed", duration: "52s", agents: 10, tokens: "92.1K" },
  { id: "pipe-003", topic: "AI Regulation Framework", status: "completed", duration: "38s", agents: 10, tokens: "78.5K" },
  { id: "pipe-004", topic: "Nile Basin Water Sharing", status: "failed", duration: "12s", agents: 3, tokens: "15.2K", error: "Fact Checker timeout" },
  { id: "pipe-005", topic: "African Startup Funding Q2", status: "completed", duration: "41s", agents: 10, tokens: "84.3K" },
];

export default function AIAgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Agents</h1>
          <p className="text-zinc-400 text-sm mt-1">Monitor and manage specialized AI agents</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm rounded-lg transition-colors">
          <RefreshCw size={14} />
          Refresh Status
        </button>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {agents.map((agent) => (
          <div
            key={agent.name}
            className={`bg-zinc-900 border rounded-xl p-4 cursor-pointer transition-all ${
              selectedAgent === agent.name
                ? "border-brand-primary shadow-lg"
                : "border-zinc-800 hover:border-zinc-700"
            }`}
            onClick={() => setSelectedAgent(agent.name)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <Bot size={20} className="text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">{agent.name}</h3>
                  <p className="text-zinc-500 text-xs mt-0.5">{agent.description}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                agent.status === 'active'
                  ? 'bg-green-500/10 text-green-500'
                  : 'bg-zinc-700 text-zinc-400'
              }`}>
                {agent.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-zinc-800/50 rounded-lg p-2">
                <p className="text-zinc-500 text-[10px] uppercase">Runs</p>
                <p className="text-white font-bold text-sm">{agent.totalRuns.toLocaleString()}</p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-2">
                <p className="text-zinc-500 text-[10px] uppercase">Success</p>
                <p className="text-green-500 font-bold text-sm">{agent.successRate}%</p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-2">
                <p className="text-zinc-500 text-[10px] uppercase">Avg Time</p>
                <p className="text-white font-bold text-sm">{agent.avgDuration}</p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-2">
                <p className="text-zinc-500 text-[10px] uppercase">Tokens</p>
                <p className="text-orange-500 font-bold text-sm">{agent.tokensUsed}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-zinc-500">Last run: {agent.lastRun}</span>
              {agent.lastError && (
                <span className="text-red-500 flex items-center gap-1">
                  <AlertTriangle size={10} />
                  Error
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline History */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold text-white">Pipeline History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">Pipeline ID</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">Topic</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">Duration</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">Agents</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">Tokens</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {pipelineHistory.map((pipeline) => (
                <tr key={pipeline.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="px-5 py-3 text-sm text-zinc-400 font-mono">{pipeline.id}</td>
                  <td className="px-5 py-3 text-sm text-white font-medium">{pipeline.topic}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      pipeline.status === 'completed'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      {pipeline.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-zinc-400">{pipeline.duration}</td>
                  <td className="px-5 py-3 text-sm text-zinc-400">{pipeline.agents}</td>
                  <td className="px-5 py-3 text-sm text-orange-500 font-medium">{pipeline.tokens}</td>
                  <td className="px-5 py-3 text-sm text-red-500">{pipeline.error || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
