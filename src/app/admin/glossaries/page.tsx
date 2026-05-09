"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Edit2, Trash2, BookOpen } from "lucide-react";

interface Glossary {
  id: string;
  term: string;
  term_en: string;
  definition: string;
  related_terms: string[];
  related_content: string[];
}

export default function AdminGlossariesPage() {
  const router = useRouter();
  const [glossaries, setGlossaries] = useState<Glossary[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGlossary, setEditingGlossary] = useState<Glossary | null>(null);
  const [formData, setFormData] = useState({
    term: "",
    term_en: "",
    definition: "",
    related_terms: "",
    related_content: "",
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

    fetch("/api/admin/glossaries", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setGlossaries(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [checkAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = checkAuth();
    if (!token) return;

    const url = editingGlossary ? `/api/admin/glossaries/${editingGlossary.id}` : "/api/admin/glossaries";
    const method = editingGlossary ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          related_terms: formData.related_terms.split(",").map((t) => t.trim()).filter(Boolean),
          related_content: formData.related_content.split(",").map((t) => t.trim()).filter(Boolean),
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
    setEditingGlossary(null);
    setFormData({ term: "", term_en: "", definition: "", related_terms: "", related_content: "" });
  };

  const refreshData = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return;
    fetch("/api/admin/glossaries", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => data.success && setGlossaries(data.data));
  };

  const handleEdit = (glossary: Glossary) => {
    setEditingGlossary(glossary);
    setFormData({
      term: glossary.term,
      term_en: glossary.term_en,
      definition: glossary.definition,
      related_terms: Array.isArray(glossary.related_terms) ? glossary.related_terms.join(", ") : "",
      related_content: Array.isArray(glossary.related_content) ? glossary.related_content.join(", ") : "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个术语吗？")) return;
    const token = checkAuth();
    if (!token) return;

    try {
      const res = await fetch(`/api/admin/glossaries/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setGlossaries(glossaries.filter((g) => g.id !== id));
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
          <h1 className="text-2xl font-bold">术语词典</h1>
          <div className="ml-auto">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  新增术语
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-xl">
                <DialogHeader>
                  <DialogTitle>{editingGlossary ? "编辑术语" : "新增术语"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="term">中文术语</Label>
                      <Input
                        id="term"
                        value={formData.term}
                        onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="term_en">英文术语</Label>
                      <Input
                        id="term_en"
                        value={formData.term_en}
                        onChange={(e) => setFormData({ ...formData, term_en: e.target.value })}
                        placeholder="English Term"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="definition">定义解释</Label>
                    <textarea
                      id="definition"
                      value={formData.definition}
                      onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
                      className="w-full min-h-[100px] p-3 border rounded-md text-sm"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="related_terms">相关术语 (逗号分隔)</Label>
                    <Input
                      id="related_terms"
                      value={formData.related_terms}
                      onChange={(e) => setFormData({ ...formData, related_terms: e.target.value })}
                      placeholder="KYC, AML, CRS"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="related_content">相关内容 Slug (逗号分隔)</Label>
                    <Input
                      id="related_content"
                      value={formData.related_content}
                      onChange={(e) => setFormData({ ...formData, related_content: e.target.value })}
                      placeholder="crs-intro, kyc-ddq"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    {editingGlossary ? "保存修改" : "创建术语"}
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
        ) : glossaries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">暂无术语，点击上方按钮创建</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {glossaries.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.term}</CardTitle>
                      <CardDescription className="text-xs mt-1">{item.term_en}</CardDescription>
                    </div>
                    <BookOpen className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{item.definition}</p>
                  {item.related_terms && item.related_terms.length > 0 && (
                    <div className="mb-4">
                      <span className="text-xs text-muted-foreground">相关术语：</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.related_terms.slice(0, 3).map((t, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-xs">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
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
