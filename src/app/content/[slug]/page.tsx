"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Content {
  id: string;
  slug: string;
  title: string;
  title_en?: string;
  summary: string;
  content: string;
  card_type: string;
  tags: string[];
  created_at: string;
  topic_id: string;
}

interface RelatedContent {
  id: string;
  slug: string;
  title: string;
  summary: string;
  card_type: string;
}

const CARD_TYPES = [
  { value: 'hot', label: '热点', color: 'bg-red-100 text-red-800' },
  { value: 'compare', label: '对比', color: 'bg-blue-100 text-blue-800' },
  { value: 'pitfall', label: '避坑', color: 'bg-amber-100 text-amber-800' },
  { value: 'checklist', label: '实操', color: 'bg-green-100 text-green-800' },
];

export default function ContentPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [content, setContent] = useState<Content | null>(null);
  const [relatedContent, setRelatedContent] = useState<RelatedContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, [slug]);

  const fetchContent = async () => {
    try {
      const res = await fetch(`/api/content/${slug}`);
      const data = await res.json();
      if (data.success) {
        setContent(data.data);
        setRelatedContent(data.data.relatedContent || []);
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
    }
    setLoading(false);
  };

  const getCardTypeStyle = (type: string) => {
    return CARD_TYPES.find((t) => t.value === type)?.color.split(' ')[0] || 'bg-gray-100';
  };

  const getCardTypeLabel = (type: string) => {
    return CARD_TYPES.find((t) => t.value === type)?.label || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container py-12 text-center">加载中...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container py-12 text-center">内容未找到</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">📋</span>
              <span className="font-serif text-xl font-bold tracking-tight">美元基金实务札记</span>
            </Link>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/topics" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              专题
            </Link>
            <Link href="/glossary" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              术语词典
            </Link>
            <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              关于
            </Link>
          </nav>
        </div>
      </header>

      <main className="container py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={getCardTypeStyle(content.card_type)}>
                {getCardTypeLabel(content.card_type)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {new Date(content.created_at).toLocaleDateString('zh-CN')}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{content.title}</h1>
            {content.title_en && (
              <p className="text-lg text-muted-foreground mb-4">{content.title_en}</p>
            )}
            <p className="text-muted-foreground">{content.summary}</p>
            
            {content.tags && content.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {content.tags.map((tag, i) => (
                  <span key={i} className="text-sm bg-slate-100 px-3 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Article Content */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content.content}
                </ReactMarkdown>
              </div>
            </CardContent>
          </Card>

          {/* Related Content */}
          {relatedContent.length > 0 && (
            <div className="border-t pt-8">
              <h2 className="text-xl font-bold mb-4">相关阅读</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {relatedContent.map((item) => (
                  <Link key={item.id} href={`/content/${item.slug}`}>
                    <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader>
                        <Badge className="w-fit mb-2">
                          {getCardTypeLabel(item.card_type)}
                        </Badge>
                        <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="line-clamp-2">
                          {item.summary}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-8">
            <Link href="/topics">
              <Button variant="outline">
                ← 返回专题
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
