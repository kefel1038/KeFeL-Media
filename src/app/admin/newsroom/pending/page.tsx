"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  ExternalLink,
} from "lucide-react";

interface PendingItem {
  id: string;
  title: string;
  content: string;
  claims: { claim: string; status: string; confidence: number }[];
  submittedBy: string;
  submittedAt: string;
  priority: "high" | "medium" | "low";
}

export default function PendingVerificationPage() {
  const [items, setItems] = useState<PendingItem[]>([
    {
      id: "1",
      title: "Government Announces New Tax Policy",
      content: "The Ministry of Finance has announced a new tax policy affecting small businesses...",
      claims: [
        { claim: "Tax rate increased to 18%", status: "unverified", confidence: 0.3 },
        { claim: "Effective from next month", status: "partially_true", confidence: 0.6 },
      ],
      submittedBy: "AI Fact Checker",
      submittedAt: new Date().toISOString(),
      priority: "high",
    },
  ]);

  const [filter, setFilter] = useState("all");

  const handleApprove = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleReject = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "true":
        return "text-green-600 bg-green-50";
      case "false":
        return "text-red-600 bg-red-50";
      case "partially_true":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle size={24} className="text-yellow-500" />
            Pending Verification
          </h1>
          <p className="text-sm text-gray-500">Claims requiring human review</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search pending items..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Priority</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white border rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.content}</p>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  item.priority === "high"
                    ? "bg-red-100 text-red-800"
                    : item.priority === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {item.priority}
              </span>
            </div>

            <div className="mb-3">
              <h4 className="text-sm font-medium mb-2">Claims to Verify:</h4>
              <div className="space-y-2">
                {item.claims.map((claim, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded ${getStatusColor(claim.status)}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{claim.claim}</span>
                      <span className="text-xs">
                        {Math.round(claim.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t">
              <div className="text-xs text-gray-500">
                Submitted by {item.submittedBy} at{" "}
                {new Date(item.submittedAt).toLocaleString()}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleReject(item.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-red-600 border border-red-200 rounded hover:bg-red-50"
                >
                  <XCircle size={14} />
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(item.id)}
                  className="flex items-center gap-1 px-3 py-1.5 text-green-600 border border-green-200 rounded hover:bg-green-50"
                >
                  <CheckCircle size={14} />
                  Approve
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
