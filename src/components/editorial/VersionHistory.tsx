"use client";

import { useState } from "react";
import {
  Clock,
  User,
  GitBranch,
  Eye,
  RotateCcw,
  Diff,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export interface ArticleVersion {
  id: string;
  versionNumber: number;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  createdAt: string;
  changes: string[];
  status: "draft" | "review" | "published";
  wordCount: number;
}

interface VersionHistoryProps {
  versions: ArticleVersion[];
  currentVersionId: string;
  onRestore: (versionId: string) => void;
  onCompare: (versionId1: string, versionId2: string) => void;
}

export default function VersionHistory({
  versions,
  currentVersionId,
  onRestore,
  onCompare,
}: VersionHistoryProps) {
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  const handleSelectVersion = (versionId: string) => {
    if (selectedVersions.includes(versionId)) {
      setSelectedVersions(selectedVersions.filter((id) => id !== versionId));
    } else if (selectedVersions.length < 2) {
      setSelectedVersions([...selectedVersions, versionId]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-zinc-900 border-zinc-800 rounded-lg">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <GitBranch size={18} />
            Version History
          </h3>
          {selectedVersions.length === 2 && (
            <button
              onClick={() => onCompare(selectedVersions[0], selectedVersions[1])}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-brand text-white rounded hover:bg-brand-dark"
            >
              <Diff size={14} />
              Compare Selected
            </button>
          )}
        </div>
      </div>

      <div className="divide-y max-h-[500px] overflow-y-auto">
        {versions.map((version) => (
          <div
            key={version.id}
            className={`p-4 hover:bg-gray-50 ${
              selectedVersions.includes(version.id) ? "bg-blue-50" : ""
            } ${version.id === currentVersionId ? "border-l-4 border-brand" : ""}`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selectedVersions.includes(version.id)}
                onChange={() => handleSelectVersion(version.id)}
                className="mt-1"
              />

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">v{version.versionNumber}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${getStatusBadge(version.status)}`}>
                    {version.status}
                  </span>
                  {version.id === currentVersionId && (
                    <span className="text-xs text-brand font-medium">Current</span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <span className="flex items-center gap-1">
                    <User size={12} />
                    {version.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(version.createdAt).toLocaleString()}
                  </span>
                  <span>{version.wordCount} words</span>
                </div>

                {version.changes.length > 0 && (
                  <div className="text-xs text-gray-600">
                    <button
                      onClick={() =>
                        setExpandedVersion(
                          expandedVersion === version.id ? null : version.id
                        )
                      }
                      className="flex items-center gap-1 hover:text-brand"
                    >
                      {expandedVersion === version.id ? (
                        <ChevronDown size={12} />
                      ) : (
                        <ChevronRight size={12} />
                      )}
                      {version.changes.length} change{version.changes.length > 1 ? "s" : ""}
                    </button>

                    {expandedVersion === version.id && (
                      <ul className="mt-2 space-y-1 pl-4">
                        {version.changes.map((change, i) => (
                          <li key={i} className="text-gray-600">
                            {change}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {version.id !== currentVersionId && (
                <button
                  onClick={() => onRestore(version.id)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 border rounded hover:bg-gray-100"
                >
                  <RotateCcw size={12} />
                  Restore
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
