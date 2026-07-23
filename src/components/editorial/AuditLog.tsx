"use client";

import { useState } from "react";
import {
  History,
  User,
  Clock,
  FileText,
  Eye,
  Edit,
  Trash2,
  Send,
  CheckCircle,
  XCircle,
  Filter,
  Search,
} from "lucide-react";

export interface AuditEntry {
  id: string;
  action: string;
  entityType: "article" | "comment" | "user" | "media";
  entityId: string;
  entityTitle: string;
  performedBy: string;
  performedAt: string;
  details?: string;
  ipAddress?: string;
}

interface AuditLogProps {
  entries: AuditEntry[];
  onFilter?: (filter: string) => void;
}

export default function AuditLog({ entries, onFilter }: AuditLogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const getActionIcon = (action: string) => {
    switch (action) {
      case "create":
        return <FileText size={14} className="text-green-500" />;
      case "update":
        return <Edit size={14} className="text-blue-500" />;
      case "delete":
        return <Trash2 size={14} className="text-red-500" />;
      case "publish":
        return <Send size={14} className="text-purple-500" />;
      case "approve":
        return <CheckCircle size={14} className="text-green-500" />;
      case "reject":
        return <XCircle size={14} className="text-red-500" />;
      case "view":
        return <Eye size={14} className="text-gray-500" />;
      default:
        return <History size={14} className="text-gray-400" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "create":
        return "bg-green-100 text-green-800";
      case "update":
        return "bg-blue-100 text-blue-800";
      case "delete":
        return "bg-red-100 text-red-800";
      case "publish":
        return "bg-purple-100 text-purple-800";
      case "approve":
        return "bg-green-100 text-green-800";
      case "reject":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredEntries = entries
    .filter(
      (entry) =>
        entry.entityTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.performedBy.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((entry) => filter === "all" || entry.action === filter);

  return (
    <div className="bg-zinc-900 border-zinc-800 rounded-lg">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <History size={18} />
            Audit Log
          </h3>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search audit log..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm border rounded"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              onFilter?.(e.target.value);
            }}
            className="px-3 py-1.5 text-sm border rounded"
          >
            <option value="all">All Actions</option>
            <option value="create">Created</option>
            <option value="update">Updated</option>
            <option value="delete">Deleted</option>
            <option value="publish">Published</option>
            <option value="approve">Approved</option>
            <option value="reject">Rejected</option>
          </select>
        </div>
      </div>

      <div className="divide-y max-h-[400px] overflow-y-auto">
        {filteredEntries.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No audit entries found
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div key={entry.id} className="p-3 hover:bg-gray-50">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getActionIcon(entry.action)}</div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${getActionColor(
                        entry.action
                      )}`}
                    >
                      {entry.action}
                    </span>
                    <span className="text-xs text-gray-500">{entry.entityType}</span>
                  </div>

                  <p className="text-sm font-medium">{entry.entityTitle}</p>

                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {entry.performedBy}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(entry.performedAt).toLocaleString()}
                    </span>
                    {entry.ipAddress && <span>{entry.ipAddress}</span>}
                  </div>

                  {entry.details && (
                    <p className="text-xs text-gray-600 mt-1">{entry.details}</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
