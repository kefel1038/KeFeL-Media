"use client";

import { useState } from "react";
import {
  LayoutGrid,
  History,
  Users,
  Settings,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import KanbanBoard, {
  type KanbanColumn,
  type KanbanCard,
} from "@/components/editorial/KanbanBoard";
import VersionHistory, {
  type ArticleVersion,
} from "@/components/editorial/VersionHistory";
import AuditLog, {
  type AuditEntry,
} from "@/components/editorial/AuditLog";

type Tab = "kanban" | "versions" | "audit";

export default function EditorialWorkflowPage() {
  const [activeTab, setActiveTab] = useState<Tab>("kanban");

  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: "inbox",
      title: "Inbox",
      color: "bg-gray-600",
      cards: [
        {
          id: "1",
          title: "New Education Policy Analysis",
          category: "Politics",
          author: "AI Writer",
          priority: "high",
          tags: ["education", "policy"],
          createdAt: new Date().toISOString(),
          aiGenerated: true,
        },
      ],
    },
    {
      id: "writing",
      title: "Writing",
      color: "bg-blue-600",
      cards: [
        {
          id: "2",
          title: "Kampala Traffic Survey Results",
          category: "Transport",
          author: "Amara Okonkwo",
          priority: "normal",
          tags: ["kampala", "transport"],
          dueDate: new Date(Date.now() + 86400000).toISOString(),
          createdAt: new Date().toISOString(),
          aiGenerated: false,
        },
      ],
    },
    {
      id: "review",
      title: "Review",
      color: "bg-yellow-600",
      cards: [
        {
          id: "3",
          title: "Tech Startup Funding Report",
          category: "Technology",
          author: "AI Writer",
          priority: "normal",
          tags: ["tech", "funding"],
          createdAt: new Date().toISOString(),
          aiGenerated: true,
        },
      ],
    },
    {
      id: "ready",
      title: "Ready to Publish",
      color: "bg-green-600",
      cards: [],
    },
  ]);

  const [versions] = useState<ArticleVersion[]>([
    {
      id: "v3",
      versionNumber: 3,
      title: "Uganda Cranes AFCON Qualification",
      content: "Full article content...",
      excerpt: "Updated with latest match details",
      author: "Editor Admin",
      createdAt: new Date().toISOString(),
      changes: ["Updated match score", "Added coach quotes"],
      status: "published",
      wordCount: 1200,
    },
    {
      id: "v2",
      versionNumber: 2,
      title: "Uganda Cranes AFCON Qualification",
      content: "Previous version...",
      excerpt: "Added player interviews",
      author: "Amara Okonkwo",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      changes: ["Added player interviews", "Fixed statistics"],
      status: "review",
      wordCount: 1100,
    },
    {
      id: "v1",
      versionNumber: 1,
      title: "Uganda Cranes Qualify for AFCON",
      content: "Original draft...",
      excerpt: "Initial AI-generated draft",
      author: "AI Writer",
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      changes: ["Initial draft created by AI"],
      status: "draft",
      wordCount: 800,
    },
  ]);

  const [auditEntries] = useState<AuditEntry[]>([
    {
      id: "1",
      action: "publish",
      entityType: "article",
      entityId: "art-1",
      entityTitle: "Uganda Cranes AFCON Qualification",
      performedBy: "Editor Admin",
      performedAt: new Date().toISOString(),
      details: "Published to homepage and sports category",
    },
    {
      id: "2",
      action: "update",
      entityType: "article",
      entityId: "art-1",
      entityTitle: "Uganda Cranes AFCON Qualification",
      performedBy: "Amara Okonkwo",
      performedAt: new Date(Date.now() - 3600000).toISOString(),
      details: "Added player interviews and quotes",
    },
    {
      id: "3",
      action: "create",
      entityType: "article",
      entityId: "art-2",
      entityTitle: "New Education Policy Analysis",
      performedBy: "AI Writer",
      performedAt: new Date(Date.now() - 7200000).toISOString(),
      details: "AI-generated draft created",
    },
    {
      id: "4",
      action: "approve",
      entityType: "article",
      entityId: "art-3",
      entityTitle: "Tech Startup Funding Report",
      performedBy: "Editor Admin",
      performedAt: new Date(Date.now() - 10800000).toISOString(),
      details: "Approved for publication",
    },
  ]);

  const handleMoveCard = (cardId: string, fromColumn: string, toColumn: string) => {
    setColumns((prev) => {
      const newColumns = [...prev];
      const fromCol = newColumns.find((c) => c.id === fromColumn);
      const toCol = newColumns.find((c) => c.id === toColumn);

      if (fromCol && toCol) {
        const cardIndex = fromCol.cards.findIndex((c) => c.id === cardId);
        if (cardIndex !== -1) {
          const [card] = fromCol.cards.splice(cardIndex, 1);
          toCol.cards.push(card);
        }
      }

      return newColumns;
    });
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "kanban", label: "Kanban Board", icon: LayoutGrid },
    { id: "versions", label: "Version History", icon: History },
    { id: "audit", label: "Audit Log", icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Editorial Workflow</h1>
          <p className="text-sm text-gray-500">Manage content through the editorial pipeline</p>
        </div>
      </div>

      <div className="flex gap-1 border-b">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-brand text-brand"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "kanban" && (
        <KanbanBoard
          columns={columns}
          onMoveCard={handleMoveCard}
          onEditCard={(card) => console.log("Edit:", card)}
          onDeleteCard={(id) => console.log("Delete:", id)}
        />
      )}

      {activeTab === "versions" && (
        <VersionHistory
          versions={versions}
          currentVersionId="v3"
          onRestore={(id) => console.log("Restore:", id)}
          onCompare={(id1, id2) => console.log("Compare:", id1, id2)}
        />
      )}

      {activeTab === "audit" && <AuditLog entries={auditEntries} />}
    </div>
  );
}
