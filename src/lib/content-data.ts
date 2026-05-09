import { getSupabaseClient } from '@/storage/database/supabase-client';

// 类型定义
export interface Topic {
  id: string;
  slug: string;
  title: string;
  icon: string;
  description: string;
  priority: number;
  content_count: number;
  created_at: string;
  updated_at: string;
}

export interface Content {
  id: string;
  slug: string;
  title: string;
  title_en?: string;
  topic_id: string;
  card_type: 'hot' | 'compare' | 'pitfall' | 'checklist';
  summary: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Glossary {
  id: string;
  term: string;
  term_en: string;
  definition: string;
  related_terms: string[];
  related_content: string[];
  created_at: string;
  updated_at: string;
}

// 专题相关函数
export async function getAllTopics(): Promise<Topic[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('topics')
    .select('*')
    .order('priority', { ascending: true });
  if (error) throw new Error(`查询失败: ${error.message}`);
  return data || [];
}

export async function getTopicBySlug(slug: string): Promise<Topic | null> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('topics')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw new Error(`查询失败: ${error.message}`);
  return data;
}

export async function getTopicById(id: string): Promise<Topic | null> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('topics')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(`查询失败: ${error.message}`);
  return data;
}

// 内容相关函数
export async function getAllContents(): Promise<Content[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('contents')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(`查询失败: ${error.message}`);
  return data || [];
}

export async function getContentBySlug(slug: string): Promise<Content | null> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('contents')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw new Error(`查询失败: ${error.message}`);
  return data;
}

export async function getContentsByTopic(topicId: string): Promise<Content[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('contents')
    .select('*')
    .eq('topic_id', topicId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(`查询失败: ${error.message}`);
  return data || [];
}

export async function getRecentContents(limit: number = 5): Promise<Content[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('contents')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(limit);
  if (error) throw new Error(`查询失败: ${error.message}`);
  return data || [];
}

export async function getHotContents(limit: number = 3): Promise<Content[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('contents')
    .select('*')
    .eq('card_type', 'hot')
    .limit(limit);
  if (error) throw new Error(`查询失败: ${error.message}`);
  return data || [];
}

// 术语相关函数
export async function getAllGlossaries(): Promise<Glossary[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('glossaries')
    .select('*')
    .order('term', { ascending: true });
  if (error) throw new Error(`查询失败: ${error.message}`);
  return data || [];
}

export async function getGlossaryById(id: string): Promise<Glossary | null> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('glossaries')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(`查询失败: ${error.message}`);
  return data;
}

export async function searchGlossaries(query: string): Promise<Glossary[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('glossaries')
    .select('*')
    .or(`term.ilike.%${query}%,term_en.ilike.%${query}%,definition.ilike.%${query}%`)
    .order('term', { ascending: true });
  if (error) throw new Error(`查询失败: ${error.message}`);
  return data || [];
}
