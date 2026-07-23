// Reader Account Types
// Types for reader accounts and AI reader features

export interface ReaderAccount {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferredLanguage: string;
  createdAt: string;
  lastLoginAt: string;
  preferences: ReaderPreferences;
}

export interface ReaderPreferences {
  categories: string[];
  topics: string[];
  notifications: NotificationPreferences;
  display: DisplayPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  breakingNews: boolean;
  dailyDigest: boolean;
  weeklyDigest: boolean;
  topicAlerts: string[];
}

export interface DisplayPreferences {
  theme: "light" | "dark" | "system";
  fontSize: "small" | "medium" | "large";
  fontFamily: "serif" | "sans-serif";
  compactMode: boolean;
}

export interface ReadingList {
  id: string;
  name: string;
  description?: string;
  articleIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  articleId: string;
  createdAt: string;
  tags?: string[];
  notes?: string;
}

export interface ReadingHistory {
  articleId: string;
  readAt: string;
  readTimeSeconds: number;
  completed: boolean;
  scrollDepth: number;
}

export interface PersonalizedFeed {
  articles: FeedArticle[];
  score: number;
  reason: string;
}

export interface FeedArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl?: string;
  publishedAt: string;
  readingTime: number;
  personalizationScore: number;
  personalizationReasons: string[];
}

export interface ArticleRecommendation {
  articleId: string;
  title: string;
  reason: string;
  score: number;
  type: "similar" | "trending" | "personalized" | "follow_up";
}
