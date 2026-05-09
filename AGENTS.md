# 美元基金实务札记 - 项目规范

## 项目概览

**项目名称**：美元基金实务札记
**项目类型**：专业内容网站（Next.js + shadcn/ui）
**核心功能**：离岸基金合规领域的专业内容平台，提供系列化、系统化、场景化的实战内容

## 技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4
- **Markdown**: react-markdown + remark-gfm

## 目录结构

```
src/
├── app/
│   ├── page.tsx                    # 首页
│   ├── about/page.tsx              # 关于页面
│   ├── topics/
│   │   ├── page.tsx               # 专题列表
│   │   └── [slug]/page.tsx        # 专题详情
│   ├── content/
│   │   └── [slug]/page.tsx        # 内容详情
│   └── glossary/
│       └── page.tsx               # 术语词典
├── components/ui/                   # shadcn/ui 组件库
└── lib/
    ├── content-types.ts            # 类型定义
    └── content-data.ts             # 内容数据
```

## 内容管理

### 专题 (Topics)

位于 `src/lib/content-data.ts` 的 `topics` 数组：

```typescript
{
  id: string,           // 唯一标识
  slug: string,         // URL slug
  title: string,        // 中文标题
  titleEn: string,      // 英文标题
  description: string,   // 描述
  icon: string,         // emoji图标
  priority: number,      // 优先级
  contentCount: number,  // 内容数量
  createdAt: string,     // 创建日期
  updatedAt: string      // 更新日期
}
```

### 内容 (Contents)

位于 `src/lib/content-data.ts` 的 `contents` 数组：

```typescript
{
  id: string,           // 唯一标识
  slug: string,         // URL slug
  title: string,        // 标题
  titleEn?: string,     // 英文标题
  summary: string,      // 摘要
  content: string,      // Markdown内容
  topicId: string,      // 所属专题
  cardType?: CardType,  // 卡片类型
  type: ContentType,    // 内容类型
  tags: string[],       // 标签
  createdAt: string,    // 创建日期
  updatedAt: string     // 更新日期
}
```

**卡片类型**：
- `hot` - 热点卡片
- `compare` - 对比卡片
- `pitfall` - 避坑卡片
- `checklist` - 实操清单

### 术语词典 (Glossaries)

位于 `src/lib/content-data.ts` 的 `glossaries` 数组：

```typescript
{
  id: string,            // 唯一标识
  term: string,          // 术语（中文）
  termEn: string,        // 术语（英文）
  definition: string,    // 定义
  relatedTerms?: string[],        // 相关术语
  relatedContent?: string[]        // 相关内容slug
}
```

## 添加新内容的流程

### 添加新专题

1. 在 `src/lib/content-data.ts` 的 `topics` 数组中添加新对象
2. 创建对应的专题页面（如需要）
3. 添加相关联的内容

### 添加新内容

1. 在 `src/lib/content-data.ts` 的 `contents` 数组中添加新对象
2. 确保 `topicId` 与现有专题匹配
3. 设置合适的 `cardType` 和 `tags`

### 添加新术语

1. 在 `src/lib/content-data.ts` 的 `glossaries` 数组中添加新对象
2. 如有相关内容，可通过 `relatedContent` 关联

## 开发命令

```bash
# 安装依赖
pnpm install

# 开发环境
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务
pnpm start
```

## 构建和部署

- 端口：5000
- 环境变量：`DEPLOY_RUN_PORT=5000`
- 框架自动处理 HMR（热模块替换）

## 设计规范

### 颜色主题

- **Primary**: 深色（专业、严肃）
- **Card Types**:
  - 热点卡片: 红色系
  - 对比卡片: 蓝色系
  - 避坑卡片: 琥珀色系
  - 实操清单: 绿色系

### 响应式设计

- 移动端优先
- 断点: sm(640px), md(768px), lg(1024px)

## 安全注意事项

1. 内容中如涉及真实案例，须做匿名化处理
2. 不在代码中硬编码敏感信息
3. 用户输入内容需做好XSS防护（已由React自动处理）
