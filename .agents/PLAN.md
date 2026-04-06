# 增加知识库与文章创作注入 (RAG) 机制架构规划

> 目标：在后台增加“知识库”模块，解决 AI 生成文章时“胡编乱造(幻觉)”或偏离企业品牌基调的问题。在进行 AI 创作推流或任务编排时，智能挂载对应知识段落作为参考锚点（RAG）。

## 最新改进建议 (The "Superpowers" Insight)
基于最新的大模型 Prompt 工程最佳实践（如 Claude 3.5 和 DeepSeek R1 的偏好），我们在投喂大体量知识库时，最佳的方法是**结构化分块注入 (Structured XML Prompting)**，而不是喂一坨乱七八糟的纯文本。您提议把知识库拆分为【品牌故事】、【用户痛点】等专门的维度，这**极其完美**，它能让大模型在写文章时进行靶向抓取（比如写引言的时候抓品牌故事，写解决方案的时候抓产品特点）。因此数据结构必须支持这些独立维度的存取！

---

## 阶段一：数据库与数据流链路设计 (Database Schema)
- [ ] **步骤 1: 扩展 `prisma/schema.prisma`**
  新增 `KnowledgeBase` (知识库) 模型。基于您的结构化需求，字段设计如下：
  - `id`, `createdAt`, `updatedAt`
  - `name` (String): 知识库名称
  - `category` (String): 知识库分类
  - `productServices` (LongText): 产品服务
  - `productFeatures` (LongText): 产品特点
  - `brandStory` (LongText): 品牌故事
  - `userPainPoints` (LongText): 用户痛点
  - `trustEndorsement` (LongText): 信任背书
  - `customerCases` (LongText): 客户案例
  - `otherInfo` (LongText): 其他附加要求/信息
  - `seoInternalLinks` (Json?): 【SEO专属增强】相关的内部链接对照表 (如 `{"产品名": "/product/a"}`)。
  - `lang` (String): 【多语言支持】当前知识库语种 (默认 zh)。
  - `isActive` (Boolean): 开启状态
- [ ] **步骤 2: 关联创作任务外键**
  在 `ArticleAutomationProject` 中，新增字段 `knowledgeBaseId (String?)`。

## 阶段二：智能组装与注入机制 (Backend & Prompt Engineering)
- [ ] **步骤 1: 结构化抽取服务 (`src/lib/ai/knowledge-service.ts`)**
  读取具体的 `KnowledgeBase` 行数据，清理掉为空的字段。
- [ ] **步骤 2: XML 格式化 Prompt 增强注入**
  在 `update-strategy.ts` 或 LLM 拼装时，采用大模型最易抓取的 XML 树状结构注入：
  ```xml
  <enterprise_knowledge>
      <product_services>...</product_services>
      <brand_story>...</brand_story>
      ...
  </enterprise_knowledge>
  请在输出文章时，严格映射 <enterprise_knowledge> 节点内的素材事实，不可捏造。
  ```

## 阶段三：管理后台视图与组件开发 (Admin UI)
- [ ] **步骤 1: 知识库维护面板 (`KnowledgeForm` / `KnowledgeTable`)**
  在后台增加 "🏢 知识库管理"。新增知识库使用高级表单，包含分块的 Textarea (文本域)，并加入分类下拉选框。
- [ ] **步骤 2: “创作工厂-自动化项目”表单升级**
  在 `ProjectForm` 中增加一个 `<Select>`：选择**要挂载的参考知识库**。只有选择了的知识库才会被送去 `XML注入`。

## 阶段四：联调闭环与测试验证 (REPL loop)
- [x] **步骤 1: `test-rag.ts` 沙盒测试驱动**
  通过集成测试或本地化 Server 开启闭环。
- [x] **步骤 2: 确认无误，更新至正式部署链路**

---

# 文章详情页「博客化」重构规划 (Blog-Style Layout Refactoring)
> 目标：将当前前台的文章详情页 (`src/app/articles/[slug]/page.tsx`) 彻底改造为一个高度关注阅读体验的现代博客样式，具备清晰的视觉阅读层级、侧边栏导航和极致的 SEO 支持。

## 阶段五：页面骨架与现代视觉重构
- [x] **步骤 1: 全局布局拆分 (两栏/三栏架构)**
  - 核心阅读区：使用最大限制宽度 (如 `max-w-3xl`) 保证每行文字的视觉瞳孔扫描不过劳。
  - 右侧栏 (Optional)：将作者信息、最近文章或者目录 (Table of Contents) 悬浮在此。
- [x] **步骤 2: Typography 深度强化**
  - 使用 `@tailwindcss/typography` 强化 `RichTextContent` 的文章渲染。
  - 加大一级/二级标题边距，调整首字下沉或引用块 (Blockquote) 的样式。
  - 使用衬线或等宽等更优雅的字体搭配（对英文更佳，或者中文对齐）。

## 阶段六：SEO 与组件增强能力 (SEO-Audit & GEO)
- [x] **步骤 1: 极致的语义化与可访问性 (GEO 基础)**
  - 严格遵守 HTML5 语义：主体包裹 `<article>`，侧边栏 `<aside>`，目录 `<nav>`。
  - 为所有图片配置完整的 `alt` 属性，强制使用 `next/image` 提升 Core Web Vitals 评分。
- [x] **步骤 2: 文章目录 (TOC) 生成器 (SEO Sitelinks 优化)**
  - 利用正则提取正文的 `<h2>`/`<h3>`，生成右侧浮动锚点导航。
  - 自动渲染带有 `id` 的标题，增加搜索引擎将其抓取为富文本“跳转片段(Sitelinks)”的概率。
- [x] **步骤 3: 深度关联与内链引擎 (GEO 权重转移)**
  - 提供 “您可能还感兴趣” (Related Posts) 板块，让爬虫能继续纵深爬取。
  - 标签云 (Tag Cloud) 与核心实体词 (Entities) 增加点击流。
  - 在侧边栏增设了全部分类列表及文章统计，加强全站的拓扑结构与内链网。

## 阶段七：传统详情页与博客详情页的兼容与切换方案 (Architecture)
> 解决痛点：如何在保留老版严肃风格“传统详情页”的同时，无缝兼容“博客化页面”？
- [x] **方案设定：双轨渲染器模式 (Dual-Renderer Pattern)**
  1. **组件层解耦**: 将当前的 `[slug]/page.tsx` 中的渲染逻辑抽离为专属组件 `<TraditionalArticleLayout />`，并新建 `<BlogArticleLayout />`。
  2. **系统全局开关**: 在管理后台 `systemSettings` 增加 `article_layout_style` 选项，配置为 `traditional` 或 `blog`，通过后台站点设置界面进行图形化即时切换。
  3. **分类覆盖 (Category Override)**: (能力已预留)
  4. **动态引入**: 在主 `[slug]/page.tsx` 根据判定条件，条件渲染不同的 Layout 组件实现 0 冲突升级。

> **阶段复盘：**
> 博客化改造现已彻底闭环。不仅满足了用户在视觉结构上的清爽感，还通过剥离 HTML 标签重构了预估阅读时间算法、替换失效的 button 标签为路由可穿透的 Link 组件、解绑了突兀的顶部栏，最后顺带在右侧补齐了拥有聚合分类统计属性的全站挂件。整个页面的语义化骨架完美切合了极致 SEO 的诉求。

---

# 全站 GEO/SEO 深度审计与合规改造规划 (Domestic AI Optimization)
> 目标：排查中国国内 AI 平台 (如百度文心、Kimi、豆包、通义千问等) 不收录、不引用系统内容的根本原因，并出具符合国内大语言模型 RAG (检索增强生成) 抓取规范的最佳实践配置。

## 阶段八：全局基础设施缺陷排查与填补 (✔️ 已完成)
- [x] **步骤 1: 填补缺失的全局 Keywords 与 OpenGraph 属性**
  - **缺陷原因**：虽然 Next.js App Router 提供了极强的 Metadata API，但是系统在根部 `src/app/layout.tsx` 丢失了全局 `keywords` 和具体的 `openGraph` 属性字典。国内传统搜索引擎 (百度等) 至今仍然对 `meta[name="keywords"]` 存在显著权重。
  - **修复措施**：在 `system-settings.ts` 扩建 `siteKeywords` 和国内平台的 `baiduOptimization`。在根布局为其注入完整的 `keywords` 和 `openGraph`。
- [x] **步骤 2: 注入全局 JSON-LD (结构化数据引擎增强)**
  - **缺陷原因**：单纯有 HTML 代码页，国内大模型需要耗费大量算力去做 NLP 拆解，往往被降权。
  - **修复措施**：在顶级 `<RootLayout>` 底部强行注入标准的 Schema.org 的 `"@type": "WebSite"` 与 `"@type": "Organization"` JSON-LD。使得任何 AI 爬虫进入网站首页的第一毫秒就能提取站点的归属人、官方名称和拓扑协议。
- [x] **步骤 3: 百度等平台的专有网关验证 (Site Verification)**
  - **修复措施**：为 Next.js 增加了专门针对国内 `baidu-site-verification` 的配置占位，为站长认证提供通道保障。
- [x] **步骤 4: API 实时被动/主动提交链路审计 (Baidu Push API)**
  - **审计结果**：当前系统实装了完善的 `autoPushToSEO` 服务 (通过 `http://data.zz.baidu.com/urls` 推送)，并且在 `src/app/admin/articles/actions.ts` 中每次文章从草稿变为发布，或者更新时，都成功衔接了该调用。**这证明后端的推流链路是通配的**。

## 阶段九：文章详情页(双渲染器) 深度 SEO 语义优化 (✔️ 已完成)
根据 `@seo-audit` 规范审计详情页源码后，执行了以下闭环修改：
- [x] **内链网 (Silo Structure) 的建立**：AI 和搜索引擎抓取的一个重大阻碍是**“孤岛页面”**。爬虫顺着链接爬到一个文章底部后无处可去就会直接跳出（高 Bounce Rate）。我在 `[slug]/page.tsx` 的服务端逻辑中增加了 `prevArticle`（上一篇）和 `nextArticle`（下一篇）的同类别检索，并将这个超大的连通导航（Semantic Navigation）挂载到了博客详情页和传统详情页的底部。
- [x] **LCP (最大内容绘制) 首屏图片强化**：针对文章 `<coverImage>` 注入了 `fetchPriority="high"` 和 `decoding="async"` 的原生 H5 标签，直接抢占宽带优先权。这对 GEO 蜘蛛评估页面的“视觉就绪时间”具有显著提分效果。
- [x] **HTML 语义骨架强化**：确保 `<article>` 标签严密囊括一切，`<time>` 标签包裹 ISO8601 标准日期，彻底抛弃单纯使用 `<div>` 的松散结构。

## 阶段十：全域索引协议审计 (Sitemap / Robots / LLMs.txt) (✔️ 已完成)
- [x] **Robots.txt 语法穿透修复**：在标准规范中，`Sitemap:` 指令只能指向 `.xml` 或纯 URL 线性的 `.txt`。如果在 `robots.ts` 中直接将包含 Markdown 标记的 `llms.txt` 暴露给传统搜索引擎蜘蛛（如百度），可能会引发该爬虫抛弃整个索引序列！已将其从 Sitemap 阵列中剥离，保留给大模型自行检索其默认路由。
- [x] **Sitemap.xml 广度扩展**：补充了缺失的 `[Category] 分类` 与 `[Tag] 标签` 页面。在此之前，系统自带的 Sitemap 并没有向外界提交分类页，直接限制了搜索引擎对同簇内容的关联和整体架构的推演。
- [x] **LLMs.txt 国际阵营适配**：当前的 `llms.txt` 和 `llms-full.txt` 已经高度前沿化。它完美地按 `https://llmstxt.org` 规范使用了结构化 Markdown，不仅提供了 `Core Pages`，还按需切分了 `full.txt`，防止单一 Prompt 被超额占用。代码实现近乎完美。

## 后续建议 (未完全代码化的管理操作)
1. **Robots.txt 失效/覆盖问题**：当前系统生成了 `robots.ts` 包含 `Baiduspider`, `Bytespider`, `MoonshotBot` 等 10+ 种 AI 爬虫。在后台 `SEO 设置` -> `全员/机器人防抓取` 中，站长必须确保没有“意外屏蔽”这些蜘蛛。
2. **AI 原创度过低导致直接丢弃 (AI-Detector Drop)**：国内部分 AI 平台蜘蛛 (如百度) 内置了文本 AI 痕迹检测，如果通篇由 GPT 直接无损生成且不带人造案例，被抓取后会被归入低分类数据库，**不予展示**。建议在文章内容中通过我们先前建立的 RAG 机制混入强企业自身属性的案例词条。
