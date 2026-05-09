"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Topic {
  id: string;
  slug: string;
  title: string;
  title_en?: string;
  icon: string;
  description: string;
  priority: number;
  content_count: number;
  created_at: string;
  updated_at: string;
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
  { value: 'hot', label: '热点', color: 'bg-red-100 text-red-800' },
  { value: 'compare', label: '对比', color: 'bg-blue-100 text-blue-800' },
  { value: 'pitfall', label: '避坑', color: 'bg-amber-100 text-amber-800' },
  { value: 'checklist', label: '实操', color: 'bg-green-100 text-green-800' },
];

// 五大专题静态展示
const DEFAULT_TOPICS = [
  { icon: '📊', title: 'CRS 税务信息交换', description: '金融账户涉税信息交换详解' },
  { icon: '🔒', title: 'AML/KYC 反洗钱', description: '反洗钱合规框架与客户身份识别实务' },
  { icon: '🔍', title: '监管合规观察', description: 'CIMA\\FSC\\SFC监管解读' },
  { icon: '⚙️', title: '基金运营实务', description: '估值、高水位、业绩报酬等详解' },
  { icon: '🏛️', title: '基金离岸架构', description: '开曼/BVI/香港基金架构对比' },
];

export default function HomePage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [recentContents, setRecentContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [topicsRes, contentsRes] = await Promise.all([
        fetch('/api/topics'),
        fetch('/api/contents'),
      ]);
      
      const topicsData = await topicsRes.json();
      const contentsData = await contentsRes.json();
      
      if (topicsData.success) {
        setTopics(topicsData.data);
      }
      if (contentsData.success) {
        setRecentContents(contentsData.data.slice(0, 6));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
    setLoading(false);
  };

  const getCardTypeStyle = (type: string) => {
    return CARD_TYPES.find((t) => t.value === type)?.color || 'bg-gray-100';
  };

  const getCardTypeLabel = (type: string) => {
    return CARD_TYPES.find((t) => t.value === type)?.label || type;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
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

      {/* Hero Section */}
      <section className="border-b bg-slate-50">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            美元基金实务札记
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            专注美元基金合规领域，提供系列化、系统化、场景化的实战内容。涵盖开曼/BVI/香港基金架构、CRS合规、反洗钱、运营实操等核心议题。
          </p>
          <div className="flex gap-4 mt-8 justify-center">
            <Link
              href="/topics"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              浏览专题
            </Link>
            <Link
              href="/glossary"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent"
            >
              术语词典
            </Link>
          </div>
        </div>
      </section>

      {/* Topics Grid Section - 五大专题（静态展示） */}
      <section className="container mx-auto px-4 py-12 border-t">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight">五大专题</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 max-w-5xl mx-auto">
          {DEFAULT_TOPICS.map((topic, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="text-4xl mb-2">{topic.icon}</div>
                <CardTitle className="text-base">{topic.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {topic.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Content Section */}
      <section className="container mx-auto px-4 py-12 border-t">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight">最新内容</h2>
        </div>
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">加载中...</div>
        ) : recentContents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">暂无内容</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentContents.map((content) => (
              <Link key={content.id} href={`/content/${content.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
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
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {content.summary}
                    </p>
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
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12 border-t">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight">内容特色</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🔥</span> 热点
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                第一时间解读新规 / 新动态
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⚖️</span> 对比
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                横向对比多个司法辖区 / 多种基金结构
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">⚠️</span> 避坑
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                聚焦 "常见合规错误"，帮助少踩坑
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📋</span> 实操
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                可直接使用的干货手册
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-slate-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">📋</span>
              <span className="font-serif font-bold">美元基金实务札记</span>
            </div>
            <p className="text-sm text-muted-foreground">
              专注美元基金合规 · 系列化 · 系统化 · 场景化
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
