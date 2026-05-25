# GEO/SEO 优化系统完善计划

该计划用于优化系统的**实体语义网关联 (Entity sameAs)**与**“段落级”问答切片 (FAQPage JSON-LD)**两个核心 GEO/SEO 功能模块。

## 任务清单

- [x] **1. 实体识别 sameAs / url 百科链接自动提取优化**
  - [x] 修改 `src/lib/ai/pipeline.ts` 中的 `extractEntities` 方法，升级 Prompt，要求大模型必须为已知实体（人名、机构、地名、概念）提取并生成百科（Wikidata/Wikipedia/官方网站）权威 sameAs 链接并包含在 `url` 属性中，同时增加 `description` 支持。
  - [x] 修改 `src/app/api/admin/geo/extract-entities/route.ts` 接口，使手动提取实体的 API 也与 `url` 字段同步支持。
  - [x] 验证数据解析器，防守性清理非真实 URL。

- [x] **2. 问答切片 HTML 格式规范化优化**
  - [x] 修改 `src/lib/ai/pipeline.ts` 中 `optimizeGeo` 方法的 Prompt。在 Q&A / FAQ 模块的生成标准中增加严苛的 HTML 骨架规范约束，强制以 `<h4>问：[问题]</h4>` 与 `<p>答：[解答]</p>` 输出。
  - [x] 确保 `src/lib/geo/parser.ts` 能够以 100% 准确度解析出 FAQ 内容，并将其成功渲染到前端 JSON-LD 中。

- [x] **3. 系统稳定性与构建测试**
  - [x] 运行 `npx tsc --noEmit` 校验。

- [x] **4. 效果实测与验证**
  - [x] 运行测试以检验实体的 `url` 提取和 FAQ HTML 解析是否顺利工作。

- [x] **5. AI 创作工厂商业授权接入与拦截墙设计 (最新)**
  - [x] 设计极具科技感的 `AIProtectWall` 暗色微光渐变商业授权墙组件。
  - [x] 在 `/admin/ai`、`/admin/knowledge-base` 以及 `/admin/articles/automation` 部署服务端 layout 级别的 `hasFeature('ai')` 权限验证，完美拦截未经授权的访问。
  - [x] 拦截所有相关的 AI 创作与自动化流水线 API 接口，严防越权调用，建立零信任安全架构。

