"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Glossary {
  id: string;
  term: string;
  term_en: string;
  definition: string;
  related_terms: string[];
  related_content: string[];
}

// Fallback data when API fails
const fallbackGlossaries: Glossary[] = [
  { id: 'g-01', term: '共同申报准则', term_en: 'Common Reporting Standard (CRS)', definition: 'OECD于2014年发布的自动交换涉税信息国际标准', related_terms: ['FATCA', 'OECD', 'AEOI'], related_content: ['crs-intro'] },
  { id: 'g-02', term: '受益所有人', term_en: 'Beneficial Owner (BO)', definition: '最终拥有或控制客户的自然人，即实际享受账户或资产权益的人', related_terms: ['UBO', 'KYC', 'AML'], related_content: ['crs-ddq'] },
  { id: 'g-03', term: '了解你的客户', term_en: 'Know Your Customer (KYC)', definition: '金融机构对客户身份、业务性质和资金来源进行验证的程序', related_terms: ['AML', '尽职调查', 'CDD'], related_content: ['aml-intro'] },
  { id: 'g-04', term: '反洗钱', term_en: 'Anti-Money Laundering (AML)', definition: '预防、发现和报告洗钱活动的法律、规章和程序体系', related_terms: ['KYC', 'CFT', '制裁合规'], related_content: ['aml-intro'] },
  { id: 'g-05', term: '海外资产控制办公室', term_en: 'Office of Foreign Assets Control (OFAC)', definition: '美国财政部下属机构，负责管理和执行美国经济和贸易制裁', related_terms: ['制裁', 'SDN List', '合规'], related_content: [] },
];

export default function GlossaryPage() {
  const [glossaries, setGlossaries] = useState<Glossary[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGlossaries();
  }, []);

  const fetchGlossaries = async (query?: string) => {
    setLoading(true);
    const url = query ? `/api/glossaries?q=${encodeURIComponent(query)}` : '/api/glossaries';
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        setGlossaries(data.data);
      } else {
        // Use fallback data if API returns empty
        setGlossaries(fallbackGlossaries);
      }
    } catch (error) {
      console.error('Failed to fetch glossaries:', error);
      setGlossaries(fallbackGlossaries);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchGlossaries(search);
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
            <Link href="/topics" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              专题
            </Link>
            <Link href="/glossary" className="text-sm font-medium text-foreground">
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
          <h1 className="text-3xl font-bold tracking-tight">术语词典</h1>
          <p className="text-muted-foreground mt-2">美元基金专业术语中英文对照与详解</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <Input
              type="search"
              placeholder="搜索术语..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
          </div>
        </form>

        {/* Glossary List */}
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">加载中...</div>
        ) : glossaries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {search ? '未找到匹配的术语' : '暂无术语'}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {glossaries.map((item) => {
              const relatedTerms = Array.isArray(item.related_terms) ? item.related_terms : [];
              const relatedContent = Array.isArray(item.related_content) ? item.related_content : [];
              
              return (
                <Card key={item.id} className="h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{item.term}</CardTitle>
                        <CardDescription className="text-base mt-1">{item.term_en}</CardDescription>
                      </div>
                      <span className="text-2xl">📖</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{item.definition}</p>
                    
                    {relatedTerms.length > 0 && (
                      <div className="mb-3">
                        <span className="text-sm font-medium">相关术语：</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {relatedTerms.map((term, i) => (
                            <span key={i} className="px-2 py-1 bg-slate-100 rounded text-sm">
                              {term}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {relatedContent.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {relatedContent.slice(0, 2).map((slug, i) => (
                          <Link key={i} href={`/content/${slug}`}>
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded text-sm hover:underline">
                              查看相关 →
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
