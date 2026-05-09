// 内容类型定义

export type CardType = 'hot' | 'compare' | 'pitfall' | 'checklist';
export type ContentType = 'card' | 'article' | 'guide';

export interface Topic {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  icon: string;
  priority: number;
  contentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Content {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  summary: string;
  content: string;
  topicId: string;
  cardType?: CardType;
  type: ContentType;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Glossary {
  id: string;
  term: string;
  termEn: string;
  definition: string;
  relatedTerms?: string[];
  relatedContent?: string[];
}

export interface Author {
  name: string;
  title: string;
  bio: string;
  avatar?: string;
}
