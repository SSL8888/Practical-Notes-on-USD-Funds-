"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const author = {
  name: '美元基金实务札记',
  title: '离岸基金合规领域专业号',
  bio: '十余年美元基金行业从业经验，专注于离岸基金合规实务。致力于将复杂的法规条款转化为实用的操作指南，帮助从业者建立系统化的合规知识体系。',
  expertise: ['CRS税务合规', 'AML/KYC反洗钱', '基金架构设计', '监管合规咨询'],
  experience: '10+',
  projects: '100+'
};

interface Topic {
  id: string;
  slug: string;
  title: string;
  icon: string;
  description: string;
  content_count: number;
}

export default function AboutPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await fetch('/api/topics');
      const data = await res.json();
      if (data.success && data.data) {
        setTopics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch topics:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-slate-950/95">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <span className="font-serif text-xl font-bold tracking-tight">美元基金实务札记</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/topics" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              专题
            </Link>
            <Link href="/glossary" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              术语词典
            </Link>
            <Link href="/about" className="text-sm font-medium text-foreground">
              关于
            </Link>
          </nav>
        </div>
      </header>

      {/* Page Header */}
      <section className="py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📋</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">关于本号</h1>
          </div>
        </div>
      </section>

      {/* Author Section */}
      <section className="pb-16">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl">
            <Card>
              <CardContent className="py-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center shrink-0 mx-auto md:mx-0">
                    <span className="text-6xl">👨‍💼</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{author.name}</h2>
                    <p className="text-muted-foreground">{author.title}</p>
                    <p className="mt-4 text-muted-foreground leading-relaxed">{author.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 bg-slate-100 dark:bg-slate-900">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight mb-6 text-center">创办初衷</h2>
            <Card>
              <CardContent className="py-8">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p>
                    在美元基金行业深耕十余年，我深刻体会到合规知识的稀缺与分散。
                    一线从业者常常面临这样的困境：
                  </p>
                  <ul>
                    <li>法规解读分散在不同的英文原文中，查找困难</li>
                    <li>实操经验存在于"老法师"的脑子里，难以系统学习</li>
                    <li>案例教训往往是"踩过坑"之后才明白，但为时已晚</li>
                  </ul>
                  <p>
                    <strong>美元基金实务札记</strong>的创办，正是为了解决这些问题。
                    我希望将十余年的实战经验转化为系统化的知识内容，
                    让后来者少走弯路，让同行者少踩坑。
                  </p>
                  <p>
                    不同于泛财经媒体的碎片化资讯，这里专注提供：
                  </p>
                  <ul>
                    <li><strong>系列化</strong>的内容——一个主题讲透、讲全</li>
                    <li><strong>系统化</strong>的知识——从概念到实操的完整路径</li>
                    <li><strong>场景化</strong>的案例——真实场景中的合规决策参考</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Content Focus Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight mb-6 text-center">内容覆盖</h2>
            {loading ? (
              <div className="text-center text-muted-foreground">加载中...</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {topics.map((topic) => (
                  <Card key={topic.id}>
                    <CardContent className="py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{topic.icon}</span>
                        <div>
                          <p className="font-semibold">{topic.title}</p>
                          <p className="text-sm text-muted-foreground">{topic.description.slice(0, 50)}...</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-amber-50 dark:bg-amber-950/20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl">
            <Card className="border-amber-200 dark:border-amber-800">
              <CardContent className="py-6">
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">免责声明</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  本号内容仅供学习交流之用，不构成任何法律、投资或合规建议。
                  如需专业咨询，请联系具备相应资质的专业人士。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center text-sm text-muted-foreground">
            <p>© 2024 美元基金实务札记. All rights reserved.</p>
            <p className="mt-2">
              专注于离岸基金合规领域的知识分享与实务探讨
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
