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
import { ArrowLeft, Plus, Edit2, Trash2 } from "lucide-react";

interface Topic {
  id: string;
  slug: string;
  title: string;
  icon: string;
  description: string;
  priority: number;
  content_count: number;
}

const CARD_TYPES = [
  { value: "hot", label: "热点" },
  { value: "compare", label: "对比" },
  { value: "pitfall", label: "避坑" },
  { value: "checklist", label: "实操" },
];

export default function AdminTopicsPage() {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    icon: "",
    description: "",
    priority: 0,
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

    fetch("/api/admin/topics", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setTopics(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [checkAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = checkAuth();
    if (!token) return;

    const url = editingTopic ? `/api/admin/topics/${editingTopic.id}` : "/api/admin/topics";
    const method = editingTopic ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setDialogOpen(false);
        setEditingTopic(null);
        setFormData({ slug: "", title: "", icon: "", description: "", priority: 0 });
        // 刷新列表
        const token2 = localStorage.getItem("adminToken");
        fetch("/api/admin/topics", {
          headers: { Authorization: `Bearer ${token2}` },
        })
          .then((res) => res.json())
          .then((data) => setTopics(data.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (topic: Topic) => {
    setEditingTopic(topic);
    setFormData({
      slug: topic.slug,
      title: topic.title,
      icon: topic.icon,
      description: topic.description,
      priority: topic.priority,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个专题吗？")) return;
    const token = checkAuth();
    if (!token) return;

    try {
      const res = await fetch(`/api/admin/topics/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setTopics(topics.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
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
          <h1 className="text-2xl font-bold">专题管理</h1>
          <div className="ml-auto">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  新增专题
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingTopic ? "编辑专题" : "新增专题"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                      placeholder="crs-tax"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="icon">图标 (Emoji)</Label>
                    <Input
                      id="icon"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="📊"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">描述</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">优先级</Label>
                    <Input
                      id="priority"
                      type="number"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingTopic ? "保存修改" : "创建专题"}
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
        ) : topics.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">暂无专题，点击上方按钮创建</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map((topic) => (
              <Card key={topic.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{topic.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{topic.title}</CardTitle>
                        <CardDescription className="text-xs mt-1">优先级: {topic.priority}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{topic.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {topic.content_count} 篇内容
                    </span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(topic)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(topic.id)}>
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
