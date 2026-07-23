"use client";

import { useState } from "react";
import {
  Languages,
  Globe,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Eye,
  Edit,
  Filter,
  Search,
} from "lucide-react";
import { LANGUAGE_CONFIG, type SupportedLanguage } from "@/lib/translation";

interface TranslationItem {
  id: string;
  articleTitle: string;
  language: SupportedLanguage;
  status: "draft" | "review" | "published";
  translator: "ai" | "human";
  confidence: number;
  createdAt: string;
  updatedAt: string;
}

export default function TranslationsPage() {
  const [translations, setTranslations] = useState<TranslationItem[]>([
    {
      id: "1",
      articleTitle: "Uganda Cranes Qualify for AFCON",
      language: "sw",
      status: "published",
      translator: "ai",
      confidence: 0.92,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      articleTitle: "Uganda Cranes Qualify for AFCON",
      language: "ar",
      status: "review",
      translator: "ai",
      confidence: 0.85,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      articleTitle: "New Mobile Money Regulations",
      language: "sw",
      status: "draft",
      translator: "ai",
      confidence: 0.78,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "published":
        return <CheckCircle size={16} className="text-green-500" />;
      case "review":
        return <Clock size={16} className="text-yellow-500" />;
      default:
        return <Edit size={16} className="text-gray-400" />;
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

  const filteredTranslations = translations
    .filter((t) =>
      t.articleTitle.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((t) => filter === "all" || t.language === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Languages size={24} className="text-indigo-500" />
            Translations
          </h1>
          <p className="text-sm text-gray-500">Manage multi-language translations</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark">
          <RefreshCw size={16} />
          Auto-Translate All
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {Object.entries(LANGUAGE_CONFIG).map(([code, config]) => (
          <div
            key={code}
            className="bg-zinc-900 border-zinc-800 rounded-lg p-3 text-center"
          >
            <div className="text-2xl mb-1">{config.flag}</div>
            <div className="font-medium text-sm">{config.name}</div>
            <div className="text-xs text-gray-500">{config.nativeName}</div>
            <div className="text-xs text-gray-400 mt-1">
              {translations.filter((t) => t.language === code).length} articles
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search translations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Languages</option>
          {Object.entries(LANGUAGE_CONFIG).map(([code, config]) => (
            <option key={code} value={code}>
              {config.flag} {config.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-zinc-900 border-zinc-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Article
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Language
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Translator
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Confidence
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredTranslations.map((translation) => (
              <tr key={translation.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className="font-medium">{translation.articleTitle}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span>
                      {LANGUAGE_CONFIG[translation.language].flag}
                    </span>
                    <span className="text-sm">
                      {LANGUAGE_CONFIG[translation.language].name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(translation.status)}
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${getStatusBadge(
                        translation.status
                      )}`}
                    >
                      {translation.status}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      translation.translator === "ai"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {translation.translator === "ai" ? "AI" : "Human"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${translation.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {Math.round(translation.confidence * 100)}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button className="p-1 text-gray-400 hover:text-blue-500">
                      <Eye size={16} />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-green-500">
                      <CheckCircle size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
