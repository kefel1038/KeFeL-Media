"use client";

import { useState } from "react";
import { BookOpen, Upload, Search, Filter, Trash2, Eye, Plus, FileText, ExternalLink } from "lucide-react";

const documentTypes = [
  { value: "all", label: "All Types" },
  { value: "article", label: "Articles" },
  { value: "style_guide", label: "Style Guides" },
  { value: "policy", label: "Policies" },
  { value: "report", label: "Reports" },
  { value: "data", label: "Data" },
  { value: "rule", label: "Rules" },
];

const sampleDocuments = [
  { id: "1", title: "KeFeL Media Editorial Style Guide", type: "style_guide", chunks: 24, lastUpdated: "2026-06-20", size: "15.2 KB" },
  { id: "2", title: "Uganda Election Coverage Policy", type: "policy", chunks: 12, lastUpdated: "2026-06-18", size: "8.4 KB" },
  { id: "3", title: "Fact-Checking Procedures", type: "rule", chunks: 18, lastUpdated: "2026-06-15", size: "11.3 KB" },
  { id: "4", title: "East African Community Trade Report 2026", type: "report", chunks: 45, lastUpdated: "2026-06-10", size: "28.7 KB" },
  { id: "5", title: "Uganda Digital Economy Statistics Q1 2026", type: "data", chunks: 32, lastUpdated: "2026-06-08", size: "19.5 KB" },
  { id: "6", title: "African Tech Startup Landscape", type: "article", chunks: 28, lastUpdated: "2026-06-05", size: "16.8 KB" },
  { id: "7", title: "AI Journalism Ethics Guidelines", type: "policy", chunks: 15, lastUpdated: "2026-06-01", size: "9.2 KB" },
  { id: "8", title: "Source Credibility Database", type: "data", chunks: 52, lastUpdated: "2026-05-28", size: "32.1 KB" },
];

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filteredDocuments = sampleDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || doc.type === selectedType;
    return matchesSearch && matchesType;
  });

  const totalChunks = sampleDocuments.reduce((acc, doc) => acc + doc.chunks, 0);
  const totalSize = "141.2 KB";

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Knowledge Base</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage documents for RAG-powered AI context</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-dark text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Upload size={14} />
          Add Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <BookOpen size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{sampleDocuments.length}</p>
              <p className="text-zinc-500 text-xs">Documents</p>
            </div>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <FileText size={20} className="text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalChunks}</p>
              <p className="text-zinc-500 text-xs">Chunks</p>
            </div>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Upload size={20} className="text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalSize}</p>
              <p className="text-zinc-500 text-xs">Total Size</p>
            </div>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <FileText size={20} className="text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">5</p>
              <p className="text-zinc-500 text-xs">Types</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-brand-primary transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-zinc-400" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-brand-primary transition-colors"
          >
            {documentTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">Document</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">Type</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">Chunks</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">Size</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">Last Updated</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredDocuments.map((doc) => (
              <tr key={doc.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
                      <FileText size={16} className="text-zinc-400" />
                    </div>
                    <span className="text-white font-medium text-sm">{doc.title}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-zinc-800 text-zinc-300">
                    {doc.type.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-zinc-400">{doc.chunks}</td>
                <td className="px-5 py-4 text-sm text-zinc-400">{doc.size}</td>
                <td className="px-5 py-4 text-sm text-zinc-400">{doc.lastUpdated}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white">
                      <Eye size={14} />
                    </button>
                    <button className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white">
                      <ExternalLink size={14} />
                    </button>
                    <button className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-zinc-400 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl w-full max-w-lg mx-4 p-6">
            <h2 className="text-xl font-bold text-white mb-4">Add Document to Knowledge Base</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Document Title</label>
                <input
                  type="text"
                  placeholder="Enter document title"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Document Type</label>
                <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-primary transition-colors">
                  {documentTypes.filter(t => t.value !== 'all').map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Content</label>
                <textarea
                  rows={6}
                  placeholder="Paste document content or URL..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-brand-primary transition-colors resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Or Upload File</label>
                <div className="border-2 border-dashed border-zinc-700 rounded-lg p-6 text-center hover:border-brand-primary transition-colors cursor-pointer">
                  <Upload size={24} className="mx-auto text-zinc-500 mb-2" />
                  <p className="text-zinc-400 text-sm">Drop file here or click to upload</p>
                  <p className="text-zinc-500 text-xs mt-1">Supports TXT, PDF, MD</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-zinc-400 hover:text-white text-sm transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-brand-primary hover:bg-brand-dark text-white text-sm font-semibold rounded-lg transition-colors">
                Add Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
