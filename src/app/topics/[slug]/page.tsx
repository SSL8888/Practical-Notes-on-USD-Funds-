"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Topic {
  id: string;
  slug: string;
  title: string;
  icon: string;
  description: string;
  content_count: number;
}

interface Content {
  id: string;
  slug: string;
  title: string;
  summary: string;
  card_type: string;
  tags: string[];
  created_at: string;
  topic_id: string;
}

const CARD_TYPES = [
  { value: 'hot', label: '热点', color: 'bg-red-100 text-red-800 hover:bg-red-200' },
  { value: 'compare', label: '对比', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
  { value: 'pitfall', label: '避坑', color: 'bg-amber-100 text-amber-800 hover:bg-amber-200' },
  { value: 'checklist', label: '实操', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
];

export default function TopicDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [topic, setTopic] = useState<Topic | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [slug]);

  const fetchData = async () => {
    try {
      const [topicRes, contentsRes] = await Promise.all([
        fetch('/api/topics'),
        fetch('/api/contents'),
      ]);
      const topicData = await topicRes.json();
      const contentsData = await contentsRes.json();
      
      if (topicData.success) {
        const foundTopic = topicData.data.find((t: Topic) => t.slug === slug);
        setTopic(foundTopic || null);
      }
      if (contentsData.success) {
        const topicContents = contentsData.data.filter((c: Content) => {
          return topicData.data.find((t: Topic) => t.slug === slug)?.id === c.topic_id;
        });
        setContents(topicContents);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
    setLoading(false);
  };

  const filteredContents = filterType
    ? contents.filter((c) => c.card_type === filterType)
    : contents;

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

  if (!topic) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container py-12 text-center">专题未找到</div>
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
            <Link href="/topics" className="text-sm font-medium text-foreground">
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
        {/* Topic Header */}
        <div className="mb-8 flex items-start gap-6">
          <span className="text-6xl">{topic.icon}</span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{topic.title}</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">{topic.description}</p>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={filterType === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterType(null)}
          >
            全部
          </Button>
          {CARD_TYPES.map((type) => (
            <Button
              key={type.value}
              variant={filterType === type.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType(type.value)}
            >
              {type.label}
            </Button>
          ))}
        </div>

        {/* Content List */}
        {filteredContents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">暂无内容</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredContents.map((content) => (
              <Link key={content.id} href={`/content/${content.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge className={getCardTypeStyle(content.card_type)}>
                        {getCardTypeLabel(content.card_type)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(content.created_at).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <CardTitle className="mt-2 line-clamp-2">{content.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2">
                      {content.summary}
                    </CardDescription>
                    {content.tags && content.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {content.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-xs bg-slate-100 px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
