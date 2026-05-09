"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus, Edit2, Trash2, Eye } from "lucide-react";

interface Topic {
  id: string;
  title: string;
}

interface Content {
  id: string;
  slug: string;
  title: string;
  topic_id: string;
  card_type: string;
  summary: string;
  content?: string;
  tags?: string[];
}

const CARD_TYPES = [
  { value: "hot", label: "热点", color: "bg-red-100 text-red-700" },
  { value: "compare", label: "对比", color: "bg-blue-100 text-blue-700" },
  { value: "pitfall", label: "避坑", color: "bg-amber-100 text-amber-700" },
  { value: "checklist", label: "实操", color: "bg-green-100 text-green-700" },
];

export default function AdminContentsPage() {
  const router = useRouter();
  const [contents, setContents] = useState<Content[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    topic_id: "",
    card_type: "hot",
    summary: "",
    content: "",
    tags: "",
  });

  const checkAuth = useCallback(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
      return null;
    }
    return token;
  }, [router]);

  useEffect(() => {
    const token = checkAuth();
    if (!token) return;

    Promise.all([
      fetch("/api/admin/contents", { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json()),
      fetch("/api/admin/topics", { headers: { Authorization: `Bearer ${token}` } }).then((res) => res.json()),
    ])
      .then(([contentsData, topicsData]) => {
        if (contentsData.success) setContents(contentsData.data);
        if (topicsData.success) setTopics(topicsData.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [checkAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = checkAuth();
    if (!token) return;

    const url = editingContent ? `/api/admin/contents/${editingContent.id}` : "/api/admin/contents";
    const method = editingContent ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });

      const data = await res.json();
      if (data.success) {
        resetForm();
        refreshData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setDialogOpen(false);
    setEditingContent(null);
    setFormData({ slug: "", title: "", topic_id: "", card_type: "hot", summary: "", content: "", tags: "" });
  };

  const refreshData = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;
    fetch("/api/admin/contents", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => data.success && setContents(data.data));
  };

  const handleEdit = (content: Content) => {
    setEditingContent(content);
    setFormData({
      slug: content.slug,
      title: content.title,
      topic_id: content.topic_id,
      card_type: content.card_type,
      summary: content.summary,
      content: content.content || "",
      tags: Array.isArray(content.tags) ? content.tags.join(", ") : "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这篇内容吗？")) return;
    const token = checkAuth();
    if (!token) return;

    try {
      const res = await fetch(`/api/admin/contents/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setContents(contents.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getCardTypeLabel = (type: string) => {
    return CARD_TYPES.find((t) => t.value === type)?.label || type;
  };

  const getCardTypeStyle = (type: string) => {
    return CARD_TYPES.find((t) => t.value === type)?.color || "bg-gray-100";
  };

  const getTopicName = (topicId: string) => {
    return topics.find((t) => t.id === topicId)?.title || topicId;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">内容管理</h1>
          <div className="ml-auto">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  新增内容
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingContent ? "编辑内容" : "新增内容"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">标题</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">URL Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="article-slug"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>专题</Label>
                      <Select value={formData.topic_id} onValueChange={(v) => setFormData({ ...formData, topic_id: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择专题" />
                        </SelectTrigger>
                        <SelectContent>
                          {topics.map((t) => (
                            <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>卡片类型</Label>
                      <Select value={formData.card_type} onValueChange={(v) => setFormData({ ...formData, card_type: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CARD_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="summary">摘要</Label>
                    <Input
                      id="summary"
                      value={formData.summary}
                      onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">标签 (逗号分隔)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="CRS, 税务, 合规"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">正文内容 (Markdown)</Label>
                    <textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full min-h-[300px] p-3 border rounded-md font-mono text-sm"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingContent ? "保存修改" : "创建内容"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">加载中...</div>
        ) : contents.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">暂无内容，点击上方按钮创建</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contents.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {getTopicName(item.topic_id)} · {item.slug}
                      </CardDescription>
                    </div>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getCardTypeStyle(item.card_type)}`}>
                      {getCardTypeLabel(item.card_type)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.summary}</p>
                  <div className="flex items-center justify-between">
                    <Link href={`/content/${item.slug}`} target="_blank">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        预览
                      </Button>
                    </Link>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
