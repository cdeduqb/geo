# GEO 功能 3: 智能内容推荐系统 - 开发指南

**优先级**: ⭐⭐⭐⭐☆  
**预计时间**: 3-4小时  
**当前进度**: 0% → 开始开发

---

## 📋 功能概述

### 核心价值
分析热门AI查询话题，推荐高需求的内容方向，帮助用户创作更容易被AI引用的内容。

### 主要功能
1. **热门话题分析**
   - 分析用户查询中的高频关键词
   - 识别趋势性话题
   - 按时间段统计热度

2. **内容缺口识别**
   - 发现网站尚未覆盖的热门话题
   - 对比现有文章与热门查询
   - 推荐创作方向

3. **AI需求预测**
   - 基于历史数据预测未来趋势
   - 识别新兴话题
   - 推荐最佳发布时机

4. **内容推荐列表**
   - Top 10 推荐话题
   - 每个话题的详细分析
   - 预估流量和引用潜力

---

## 🎯 开发任务

### 任务1: 数据库模型（30分钟）

#### 1.1 热门话题记录
**模型**: `TrendingTopic`

```prisma
model TrendingTopic {
  id              String   @id @default(uuid())
  topic           String   // 话题/关键词
  category        String?  // 分类
  queryCount      Int      @default(0)  // 查询次数
  trendScore      Float    @default(0)  // 趋势得分 0-100
  growthRate      Float    @default(0)  // 增长率 %
  peakTime        DateTime? // 峰值时间
  relatedTopics   String?  @db.Text // JSON数组
  status          String   @default("active") // active, declining, emerging
  firstSeenAt     DateTime @default(now())
  lastSeenAt      DateTime @updatedAt
  
  recommendations ContentRecommendation[]
  
  @@index([trendScore])
  @@index([queryCount])
  @@index([status])
  @@index([lastSeenAt])
}
```

#### 1.2 内容推荐
**模型**: `ContentRecommendation`

```prisma
model ContentRecommendation {
  id                String   @id @default(uuid())
  topicId           String
  title             String   // 推荐的文章标题
  description       String   @db.Text // 推荐理由
  estimatedTraffic  Int      @default(0) // 预估流量
  difficulty        String   @default("medium") // easy, medium, hard
  priority          Int      @default(0) // 1-10优先级
  keywords          String?  @db.Text // JSON数组：相关关键词
  status            String   @default("pending") // pending, accepted, rejected, published
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  topic             TrendingTopic @relation(fields: [topicId], references: [id], onDelete: Cascade)
  
  @@index([topicId])
  @@index([priority])
  @@index([status])
  @@index([createdAt])
}
```

---

### 任务2: API端点开发（2小时）

#### 2.1 分析热门话题
**文件**: `src/app/api/admin/geo/trends/route.ts`

**功能**:
- 从引用记录中提取关键词
- 统计话题出现频率
- 计算趋势得分
- 识别新兴话题

**算法**:
```typescript
// 趋势得分 = (近7天查询 / 总查询) * 100 + 增长率加成
trendScore = (recent7Days / totalQueries) * 100 + growthBonus
```

#### 2.2 生成内容推荐
**文件**: `src/app/api/admin/geo/recommendations/route.ts`

**功能**:
- 基于热门话题生成推荐
- 检查网站是否已有相关内容
- 计算推荐优先级
- 使用AI生成标题和大纲建议

#### 2.3 获取推荐列表
**GET /api/admin/geo/recommendations**

**参数**:
- `status`: pending, accepted, published
- `priority`: min-max
- `limit`: 10-100

---

### 任务3: 前端UI开发（1.5小时）

#### 3.1 推荐面板组件
**文件**: `src/app/admin/geo/_components/ContentRecommendations.tsx`

**UI元素**:
- 热门话题卡片
- 推荐内容列表
- 趋势图表
- 操作按钮（接受/拒绝）

**布局**:
```
┌─────────────────────────────────────────┐
│  智能内容推荐                            │
├─────────────────────────────────────────┤
│  [刷新推荐] [生成新推荐]                 │
│                                          │
│  热门趋势话题 (Top 5)                    │
│  ┌──────────┐  ┌──────────┐            │
│  │ 话题1    │  │ 话题2    │            │
│  │ 🔥 258次 │  │ ⭐ 186次 │            │
│  │ +45% ↑  │  │ +32% ↑  │            │
│  └──────────┘  └──────────┘            │
│                                          │
│  推荐内容 (Top 10)                       │
│  ┌─────────────────────────────────────┐│
│  │ 1. [高优先级] 标题                  ││
│  │    💡 推荐理由: ...                 ││
│  │    📊 预估流量: 500+/月             ││
│  │    🏷️  关键词: xx, yy, zz           ││
│  │    [接受] [查看详情] [忽略]        ││
│  └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

---

### 任务4: 智能分析算法（1小时）

#### 4.1 关键词提取
从AI引用查询中提取高频关键词：

```typescript
function extractKeywords(queries: string[]) {
  // 1. 分词
  // 2. 去除停用词
  // 3. 统计词频
  // 4. TF-IDF计算
  // 5. 返回Top关键词
}
```

#### 4.2 趋势分析
```typescript
function analyzeTrend(topic: string, history: QueryLog[]) {
  const recent7Days = countInDays(history, 7);
  const previous7Days = countInDays(history, 14, 7);
  
  const growthRate = ((recent7Days - previous7Days) / previous7Days) * 100;
  const trendScore = (recent7Days / history.length) * 100;
  
  return {
    trendScore,
    growthRate,
    status: getTrendStatus(growthRate) // emerging, active, declining
  };
}
```

#### 4.3 内容缺口识别
```typescript
async function findContentGaps(topics: TrendingTopic[], articles: Article[]) {
  const gaps = [];
  
  for (const topic of topics) {
    // 检查是否已有相关文章
    const hasContent = articles.some(article => 
      article.title.includes(topic.topic) ||
      article.content.includes(topic.topic)
    );
    
    if (!hasContent && topic.trendScore > 50) {
      gaps.push({
        topic,
        opportunity: calculateOpportunity(topic)
      });
    }
  }
  
  return gaps.sort((a, b) => b.opportunity - a.opportunity);
}
```

---

## 📊 数据来源

### 主要数据源
1. **AI引用记录** (AICitation表)
   - 用户查询 (query字段)
   - 查询时间
   - 引用次数

2. **现有文章** (Article表)
   - 标题和内容
   - 类别
   - 标签

3. **外部数据** (可选)
   - Google Trends API
   - 百度指数

---

## 🎯 推荐算法

### 优先级计算
```typescript
priority = (
  trendScore * 0.4 +           // 趋势热度 40%
  (100 - competitionScore) * 0.3 +  // 竞争难度 30%
  estimatedTraffic / 10 * 0.3  // 预估流量 30%
)
```

### 难度评估
```
- Easy: 低竞争，高需求，简单主题
- Medium: 中等竞争或复杂度
- Hard: 高竞争或专业深度要求高
```

---

## 💡 UI/UX设计

### 热门话题卡片
```tsx
<Card>
  <Badge>🔥 热门</Badge>
  <h3>小程序开发教程</h3>
  <Stats>
    <Stat icon="📊" label="查询次数" value="258" />
    <Stat icon="📈" label="增长率" value="+45%" color="green" />
    <Stat icon="⏰" label="峰值时间" value="下午2-4点" />
  </Stats>
  <Button>生成推荐</Button>
</Card>
```

### 推荐内容项
```tsx
<RecommendationCard priority="high">
  <Header>
    <PriorityBadge level={9}>高优先级</PriorityBadge>
    <Title>如何从零开始开发微信小程序</Title>
  </Header>
  
  <Body>
    <Reason>
      💡 该话题近7天查询量增长45%，但您的网站尚无相关深度内容
    </Reason>
    <Metrics>
      <Metric icon="📊" label="预估月流量" value="500+" />
      <Metric icon="⭐" label="难度" value="中等" />
      <Metric icon="🎯" label="引用潜力" value="85分" />
    </Metrics>
    <Keywords>
      {['微信小程序', '开发教程', '零基础'].map(kw => <Tag>{kw}</Tag>)}
    </Keywords>
  </Body>
  
  <Actions>
    <Button variant="primary">接受并创作</Button>
    <Button variant="outline">查看详情</Button>
    <Button variant="ghost">暂不考虑</Button>
  </Actions>
</RecommendationCard>
```

---

## 🧪 测试场景

### 测试1: 生成推荐
1. 系统分析过去30天的AI引用查询
2. 识别出5个热门话题
3. 生成10条内容推荐
4. 按优先级排序

### 测试2: 趋势分析
1. 查看"小程序开发"话题
2. 显示30天趋势图
3. 显示增长率和峰值时间
4. 预测未来7天趋势

### 测试3: 内容缺口
1. 对比热门话题与现有文章
2. 识别5个内容缺口
3. 推荐创作方向
4. 提供标题建议

---

## 📈 预期效果

### 用户收益
- 知道创作什么内容最有价值
- 了解用户真实需求
- 提高内容被AI引用的概率
- 数据驱动的内容策略

### 系统价值
- 内容规划更科学
- 提升GEO效率 +200%
- 减少无效创作 -80%
- 增加AI引用率 +150%

---

## 🎊 开发checklist

- [ ] 数据库模型创建
- [ ] Prisma迁移
- [ ] 趋势分析API
- [ ] 推荐生成API
- [ ] 关键词提取算法
- [ ] 前端UI组件
- [ ] 集成到GEO页面
- [ ] 测试验证

---

**准备开始开发！** 🚀
