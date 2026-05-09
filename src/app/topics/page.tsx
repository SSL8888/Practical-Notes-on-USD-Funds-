"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Topic {
  id: string;
  slug: string;
  title: string;
  icon: string;
  description: string;
  content_count: number;
}

export default function TopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await fetch('/api/topics');
      const data = await res.json();
      if (data.success) {
        setTopics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch topics:', error);
    }
    setLoading(false);
  };

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">专题系列</h1>
          <p className="text-muted-foreground mt-2">
            系统化学习美元基金合规知识，系列专题覆盖核心议题
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">加载中...</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <Link key={topic.id} href={`/topics/${topic.slug}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <span className="text-5xl">{topic.icon}</span>
                      <span className="text-sm text-muted-foreground">
                        {topic.content_count} 篇
                      </span>
                    </div>
                    <CardTitle className="mt-4 text-xl">{topic.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">
                      {topic.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
