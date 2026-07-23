"use client";

import { useState } from "react";
import {
  Share2,
  MessageCircle,
  AtSign,
  Briefcase,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  ExternalLink,
} from "lucide-react";

interface SocialPost {
  id: string;
  platform: string;
  content: string;
  articleTitle: string;
  status: "queued" | "posting" | "posted" | "failed";
  scheduledAt?: string;
  postedAt?: string;
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
  };
}

export default function SocialQueuePage() {
  const [posts, setPosts] = useState<SocialPost[]>([
    {
      id: "1",
      platform: "twitter",
      content: "Breaking: Uganda Cranes qualify for AFCON 2027! 🏆⚽ Read more: https://kefelmedia.com/article/uganda-cranes-afcon",
      articleTitle: "Uganda Cranes Qualify for Africa Cup of Nations",
      status: "posted",
      postedAt: new Date(Date.now() - 3600000).toISOString(),
      engagement: { likes: 234, shares: 89, comments: 45 },
    },
    {
      id: "2",
      platform: "facebook",
      content: "New mobile money regulations announced by Bank of Uganda. What it means for you...",
      articleTitle: "New Mobile Money Regulations Announced",
      status: "queued",
      scheduledAt: new Date(Date.now() + 1800000).toISOString(),
    },
    {
      id: "3",
      platform: "linkedin",
      content: "Exciting developments in East Africa's tech ecosystem. Our latest analysis...",
      articleTitle: "Tech Startups Raise Record Funding",
      status: "queued",
      scheduledAt: new Date(Date.now() + 3600000).toISOString(),
    },
  ]);

  const [filter, setFilter] = useState("all");

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return <AtSign size={16} className="text-blue-400" />;
      case "facebook":
        return <MessageCircle size={16} className="text-blue-600" />;
      case "linkedin":
        return <Briefcase size={16} className="text-blue-700" />;
      default:
        return <Share2 size={16} className="text-gray-400" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "posted":
        return <CheckCircle size={16} className="text-green-500" />;
      case "posting":
        return <Send size={16} className="text-blue-500 animate-pulse" />;
      case "failed":
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "posted":
        return "bg-green-100 text-green-800";
      case "posting":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const filteredPosts =
    filter === "all"
      ? posts
      : posts.filter((post) => post.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Share2 size={24} className="text-cyan-500" />
            Social Queue
          </h1>
          <p className="text-sm text-gray-500">Manage social media posts queue</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="queued">Queued</option>
          <option value="posting">Posting</option>
          <option value="posted">Posted</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getPlatformIcon(post.platform)}
                  <span className="font-medium capitalize">{post.platform}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(
                      post.status
                    )}`}
                  >
                    {post.status}
                  </span>
                  {getStatusIcon(post.status)}
                </div>
                <p className="text-sm text-gray-700 mb-2">{post.content}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Article: {post.articleTitle}</span>
                  {post.scheduledAt && (
                    <span>Scheduled: {new Date(post.scheduledAt).toLocaleString()}</span>
                  )}
                  {post.postedAt && (
                    <span>Posted: {new Date(post.postedAt).toLocaleString()}</span>
                  )}
                </div>
              </div>
              {post.engagement && (
                <div className="flex gap-4 text-center">
                  <div>
                    <div className="text-xs text-gray-500">Likes</div>
                    <div className="font-semibold">{post.engagement.likes}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Shares</div>
                    <div className="font-semibold">{post.engagement.shares}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Comments</div>
                    <div className="font-semibold">{post.engagement.comments}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
