# GEO 功能 2: AI 内容质量评分系统 - 开发指南

**优先级**: ⭐⭐⭐⭐⭐  
**预计时间**: 3-4小时  
**当前进度**: 0% → 开始开发

---

## 📋 功能概述

### 核心价值
使用AI自动评估内容质量，帮助用户创作更容易被AI引用的内容。

### 评分维度
1. **结构清晰度** (Structure Clarity) - 0-100分
   - 标题层次是否合理
   - 段落组织是否清晰
   - 是否有明确的大纲

2. **事实密度** (Factual Density) - 0-100分
   - 包含多少具体数据
   - 是否有可验证的事实
   - 信息密度如何

3. **可引用性** (Citation Worthiness) - 0-100分
   - 内容是否具有权威性
   - 是否包含独特见解
   - 适合作为引用来源

4. **实体丰富度** (Entity Richness) - 0-100分
   - 包含多少命名实体（人名、地名、组织等）
   - 实体之间的关联
   - 知识图谱完整度

5. **语义深度** (Semantic Depth) - 0-100分
   - 内容深度如何
   - 是否有深入分析
   - 专业程度

### 总体评分
5个维度的加权平均，生成0-100的总分。

---

## 🎯 开发任务

### 任务1: API端点开发 (2小时)

#### 1.1 创建评分API
**文件**: `src/app/api/admin/geo/score/route.ts`

**功能**:
- 接收文章ID或内容
- 调用AI进行分析
- 返回多维度评分
- 保存到数据库

**提示词设计**:
```typescript
const scoringPrompt = `
你是一个专业的内容质量评估专家。请从以下5个维度评估这篇文章的质量：

1. 结构清晰度 (0-100): 标题层次、段落组织、大纲完整性
2. 事实密度 (0-100): 数据、可验证事实、信息密度
3. 可引用性 (0-100): 权威性、独特见解、引用价值
4. 实体丰富度 (0-100): 命名实体数量、实体关联、知识图谱
5. 语义深度 (0-100): 内容深度、分析质量、专业程度

文章内容：
${content}

请以JSON格式返回评分结果：
{
  "structureScore": 85,
  "factualScore": 90,
  "citationScore": 88,
  "entityScore": 75,
  "semanticScore": 82,
  "overallScore": 84,
  "suggestions": [
    "建议1：增加更多数据支撑",
    "建议2：补充实体关联信息"
  ]
}
`;
```

#### 1.2 批量评分API
**文件**: `src/app/api/admin/geo/score/batch/route.ts`

**功能**:
- 批量评估多篇文章
- 后台队列处理
- 进度追踪

---

### 任务2: AI集成 (1小时)

#### 2.1 使用现有AI配置
利用系统已有的AI配置（DeepSeek, OpenAI等）

```typescript
// 获取可用的AI配置
const aiConfig = await prisma.aiConfig.findFirst({
  where: { isActive: true },
});

// 调用AI API
const response = await callAI(aiConfig, scoringPrompt);
```

#### 2.2 评分缓存
避免重复评分，节省API成本

```typescript
// 检查是否已评分
const existingScore = await prisma.contentAIScore.findUnique({
  where: { articleId },
});

if (existingScore && !forceRefresh) {
  return existingScore;
}
```

---

### 任务3: 前端UI开发 (1.5小时)

#### 3.1 评分展示组件
**文件**: `src/app/admin/geo/_components/ContentScorer.tsx`

**UI元素**:
- 文章选择器
- 评分按钮
- 5维度雷达图
- 评分卡片
- 改进建议列表
- 与竞品对比（可选）

#### 3.2 批量评分界面
**文件**: `src/app/admin/geo/_components/BatchScorer.tsx`

**功能**:
- 批量选择文章
- 进度条
- 结果列表

---

### 任务4: 数据可视化 (30分钟)

#### 4.1 雷达图
使用现有的图表库展示5维度评分

```tsx
import { RadarChart, Radar, ... } from 'recharts';

const data = [
  { dimension: '结构清晰度', score: 85 },
  { dimension: '事实密度', score: 90 },
  { dimension: '可引用性', score: 88 },
  { dimension: '实体丰富度', score: 75 },
  { dimension: '语义深度', score: 82 },
];
```

#### 4.2 评分历史趋势
展示文章评分的历史变化

---

## 💡 UI设计思路

### 评分仪表盘
```
┌─────────────────────────────────────────┐
│  AI 内容质量评分                          │
├─────────────────────────────────────────┤
│  选择文章: [下拉选择] [开始评分]          │
│                                          │
│  ┌──────────┐  ┌──────────┐            │
│  │  总分    │  │  排名    │            │
│  │   84    │  │  前20%  │            │
│  └──────────┘  └──────────┘            │
│                                          │
│  [雷达图 - 5维度评分]                    │
│                                          │
│  改进建议:                                │
│  ✓ 增加更多数据支撑                      │
│  ✓ 补充实体关联信息                      │
│  ✓ 优化标题层次                          │
└─────────────────────────────────────────┘
```

---

## 🔧 技术栈

- **AI调用**: 复用现有AIConfig
- **数据库**: ContentAIScore模型（已创建）
- **图表**: Recharts（已在项目中）
- **UI**: React + TypeScript

---

## 📊 预期效果

### 用户体验
1. 选择或创建文章
2. 点击"评分"按钮
3. 等待5-10秒AI分析
4. 查看5维度评分
5. 阅读改进建议
6. 根据建议优化内容
7. 重新评分验证

### 价值体现
- ❌ **之前**: 不知道内容质量如何，凭感觉创作
- ✅ **现在**: AI客观评分，数据驱动内容优化

---

## 🎯 开发顺序

1. ✅ 数据库模型（已完成）
2. ⏳ AI评分API（接下来）
3. ⏳ 前端UI组件
4. ⏳ 集成到GEO页面
5. ⏳ 测试和优化

---

## 📝 API设计

### POST /api/admin/geo/score
```typescript
Request:
{
  "articleId": "xxx",
  "forceRefresh": false
}

Response:
{
  "score": {
    "overallScore": 84,
    "structureScore": 85,
    "factualScore": 90,
    "citationScore": 88,
    "entityScore": 75,
    "semanticScore": 82,
    "suggestions": ["...", "..."],
    "analyzedAt": "2025-12-29T01:05:00Z"
  }
}
```

### GET /api/admin/geo/score/:articleId
获取文章的AI评分（如果有）

### POST /api/admin/geo/score/batch
批量评分多篇文章

---

**准备开始开发！** 🚀
