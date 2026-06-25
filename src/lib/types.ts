export interface Author {
  name: string;
  avatar: string;
  role: string;
  bio?: string;
}

export type ArticleType = "news" | "feature" | "opinion" | "analysis";

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: Author;
  image: string;
  imageCaption?: string;
  imageCredit?: string;
  secondaryImage?: string;
  secondaryImageCaption?: string;
  publishedAt: string;
  readingTime: number;
  featured: boolean;
  trending: boolean;
  status: string;
  tags: string[];
  views?: number;
  highlights?: string[];
  template?: string;
  articleType?: ArticleType;
}

export interface Category {
  slug: string;
  label: string;
  color: string;
  description: string;
}

export interface SearchResult {
  articles: Article[];
  query: string;
  total: number;
}
