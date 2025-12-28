# GEO 功能 1: AI 引用追踪系统 - 开发指南

**当前进度**: 数据库模型已创建 ✅  
**下一步**: API 端点开发  
**总体进度**: 20%

---

## ✅ 已完成

### 1. 数据库模型设计
- ✅ `AICitation` - AI引用记录
- ✅ `AISearchRanking` - AI搜索排名
- ✅ `ContentAIScore` - 内容AI质量评分
- ✅ `CrawlerBehavior` - 爬虫行为分析

**文件**: `prisma/schema.prisma`

---

## 📋 待开发任务

### 任务 1: 更新 Article 模型关联
**优先级**: 高  
**预计时间**: 10分钟

**要做的事**:
在 `prisma/schema.prisma` 的 Article 模型中添加：
```prisma
model Article {
  // ... 现有字段
  
  // GEO 优化关联 (在 tags 行之后添加)
  aiCitations         AICitation[]
  aiRankings          AISearchRanking[]
  aiScore             ContentAIScore?
  
  // ... 其他
}
```

**然后运行**:
```bash
npx prisma db push
npx prisma generate
```

---

### 任务 2: 创建 API 端点
**优先级**: 高  
**预计时间**: 2小时

#### 2.1 引用追踪 API
**文件**: `src/app/api/admin/geo/citations/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - 获取引用列表
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get('articleId');
  const platform = searchParams.get('platform');
  const limit = parseInt(searchParams.get('limit') || '50');
  
  try {
    const citations = await prisma.aICitation.findMany({
      where: {
        ...(articleId && { articleId }),
        ...(platform && { platform }),
      },
      include: {
        article: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: { citedAt: 'desc' },
      take: limit,
    });
    
    return NextResponse.json({ citations });
  } catch (error) {
    return NextResponse.json(
      { error: '获取引用数据失败' },
      { status: 500 }
    );
  }
}

// POST - 添加引用记录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId, platform, query, position, context } = body;
    
    const citation = await prisma.aICitation.create({
      data: {
        articleId,
        articleTitle: '', // 会自动从关联获取
        platform,
        query,
        position: position || 0,
        context,
      },
    });
    
    return NextResponse.json({ citation });
  } catch (error) {
    return NextResponse.json(
      { error: '创建引用记录失败' },
      { status: 500 }
    );
  }
}
```

#### 2.2 引用统计 API
**文件**: `src/app/api/admin/geo/citations/stats/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '30');
  
  const since = new Date();
  since.setDate(since.getDate() - days);
  
  try {
    // 总引用数
    const totalCitations = await prisma.aICitation.count({
      where: { citedAt: { gte: since } },
    });
    
    // 按平台统计
    const byPlatform = await prisma.aICitation.groupBy({
      by: ['platform'],
      where: { citedAt: { gte: since } },
      _count: true,
    });
    
    // 按日期趋势
    const trend = await prisma.$queryRaw`
      SELECT 
        DATE(citedAt) as date,
        COUNT(*) as count
      FROM AICitation
      WHERE citedAt >= ${since}
      GROUP BY DATE(citedAt)
      ORDER BY date ASC
    `;
    
    // 最受AI关注的文章
    const topArticles = await prisma.aICitation.groupBy({
      by: ['articleId'],
      where: { citedAt: { gte: since } },
      _count: true,
      orderBy: { _count: { articleId: 'desc' } },
      take: 10,
    });
    
    const topArticlesWithDetails = await Promise.all(
      topArticles.map(async (item) => {
        const article = await prisma.article.findUnique({
          where: { id: item.articleId },
          select: { id: true, title: true, slug: true },
        });
        return {
          article,
          citations: item._count,
        };
      })
    );
    
    return NextResponse.json({
      totalCitations,
      byPlatform,
      trend,
      topArticles: topArticlesWithDetails,
    });
  } catch (error) {
    return NextResponse.json(
      { error: '获取统计数据失败' },
      { status: 500 }
    );
  }
}
```

---

### 任务 3: 前端UI开发
**优先级**: 中  
**预计时间**: 3小时

#### 3.1 引用追踪面板
**文件**: `src/app/admin/geo/_components/CitationTracker.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Quote, TrendingUp, Award } from 'lucide-react';

interface Citation {
  id: string;
  platform: string;
  query: string;
  citedAt: string;
  position: number;
  article: {
    title: string;
    slug: string;
  };
}

export default function CitationTracker() {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchCitations();
    fetchStats();
  }, []);
  
  const fetchCitations = async () => {
    const res = await fetch('/api/admin/geo/citations?limit=20');
    const data = await res.json();
    setCitations(data.citations || []);
  };
  
  const fetchStats = async () => {
    const res = await fetch('/api/admin/geo/citations/stats?days=30');
    const data = await res.json();
    setStats(data);
    setLoading(false);
  };
  
  if (loading) {
    return <div>加载中...</div>;
  }
  
  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              总引用次数
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalCitations || 0}</div>
            <p className="text-xs text-gray-500 mt-1">近30天</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              活跃AI平台
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.byPlatform?.length || 0}</div>
            <p className="text-xs text-gray-500 mt-1">引用您的内容</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              最受关注文章
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.topArticles?.[0]?.citations || 0}</div>
            <p className="text-xs text-gray-500 mt-1 truncate">
              {stats?.topArticles?.[0]?.article?.title || '暂无'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* 引用列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Quote className="w-5 h-5" />
            最近的AI引用
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {citations.map((citation) => (
              <div key={citation.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        {citation.platform}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(citation.citedAt).toLocaleString('zh-CN')}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">
                      {citation.article.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      用户查询: "{citation.query}"
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Award className="w-3 h-3" />
                      排名位置: #{citation.position}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {citations.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                暂无引用数据。开始创作优质内容，让AI发现并引用！
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### 3.2 集成到GEO页面
**文件**: `src/app/admin/geo/page.tsx`

在现有的Tabs中添加新的"引用追踪"标签页：

```typescript
<TabsTrigger value="citations">引用追踪</TabsTrigger>

<TabsContent value="citations">
  <CitationTracker />
</TabsContent>
```

---

### 任务 4: 数据采集逻辑(可选)
**优先级**: 低  
**预计时间**: 4小时

由于真实的AI引用追踪需要调用各个AI平台的API（可能需要付费），这部分可以：

**方案A**: 手动录入测试数据
- 在管理后台添加"手动添加引用"按钮
- 用于演示和测试

**方案B**: API集成
- 集成Perplexity API
- 集成其他支持的AI平台API
- 定期自动检查

**推荐**: 先实现方案A，UI完成后再考虑方案B

---

## 🧪 测试步骤

### 1. 数据库测试
```bash
npx prisma studio
# 查看新模型是否正确创建
```

### 2. API测试
```bash
# 创建引用记录
curl -X POST http://localhost:3000/api/admin/geo/citations \
  -H "Content-Type: application/json" \
  -d '{
    "articleId": "article-id",
    "platform": "ChatGPT",
    "query": "测试查询",
    "position": 1
  }'

# 获取引用列表
curl http://localhost:3000/api/admin/geo/citations

# 获取统计数据
curl http://localhost:3000/api/admin/geo/citations/stats
```

### 3. UI测试
1. 访问 `/admin/geo`
2. 切换到"引用追踪"标签
3. 查看统计卡片
4. 查看引用列表

---

## 📊 预期效果

完成后，用户将能够：
1. ✅ 查看所有AI平台对内容的引用
2. ✅ 了解哪些文章最受AI关注
3. ✅ 看到引用趋势变化
4. ✅ 知道用户通过什么问题找到内容

**价值**: 可量化GEO效果，指导内容优化方向

---

## 🎯 下一个功能

完成当前功能后，继续开发：
**功能2**: AI内容质量评分系统

---

**开发建议**: 
- 按顺序完成任务 1-4
- 每完成一个任务提交一次Git
- 遇到问题可以查看本指南

**预计总开发时间**: 6-8小时
