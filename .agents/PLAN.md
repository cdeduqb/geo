# 管理后台 UI 风格与布局扩展计划 (UI & Layout Expansion Plan)

## 背景目标
在**绝对不影响任何现有功能**的前提下，对目前的管理后台进行界面升级：
1. 增加新的 UI 风格（如：支持暗色模式、不同的配色主题）。
2. 增加新的布局选项（如：从当前的左侧边栏布局，切换至顶部导航布局）。
3. 支持在管理后台界面进行可视化切换，并能够在本地记录用户偏好。

## 方案架构设计
通过解耦视口 (View) 和逻辑 (Logic) 实现：
- **Logic层**：将当前的菜单数据配置、用户信息、退出登录功能、系统更新检查功能从视图层剥离，统一下沉到一个 Context 或自定义 Hook。
- **Store层面**：利用现有的 `next-themes` 以及自定义的 `LocalStorage` 来记录用户的 `layout` 偏好（如：`classic | modern | top-nav`）。
- **View层**：创建多套高阶组件（Layout Wrapper）。在 `AdminLayoutClient` 入口处根据用户偏好动态加载不同的布局组件并渲染 `{children}`。

## 任务执行清单 (Todo List)

- [x] **步骤0：理解项目依赖与代码结构分析**
  - 确认依赖：`next-themes`, `tailwindcss`, `lucide-react`。
  - 确认待改动文件：`src/app/admin/_components/AdminLayoutClient.tsx`。
- [x] **步骤1：解耦 `AdminLayoutClient` 提取共享逻辑与上下文 (Context)**
  - 创建 `src/app/admin/_components/layout/AdminConfigContext.tsx` 或类似目录。
  - 将 `MENU_ITEMS`、`updateInfo` 机制、登出、`user` 状态移交进去统一管理。
- [x] **步骤2：抽象与封装当前的默认布局为 `ClassicLayout`**
  - 把重构前纯碎的“代码视觉骨架”（即右边Header，左边Sidebar）拆分到 `ClassicLayout.tsx`，确保任何功能不倒退。
- [x] **步骤3：开发新布局 `ModernTopNavLayout` (或其他风格，例如紧凑黑客风、玻璃悬浮风)**
  - 编写全新的一套包裹组件，内部无缝接入 `{children}` 与上一步提取的 `Context`。
- [x] **步骤4：引入布局切换器 (Theme / Layout Switcher Component)**
  - 在右上角的 Header 内新增一个“主题设置”按钮，点击后弹出 `Drawer` 或 `Dialog` 进行切换。
  - 改变偏好时，动态渲染指定的 Layout 包裹组件，支持跟随全局色值变化。
- [ ] **步骤5：验证测试 (Validation)**
  - 随意点开几个后台页面，包含表单页面、数据展示表格，确保 `children` 渲染宽度、高度和交互一切正常。

---
*Created by [Superpowers & Planning-with-files workflow]*
- [x] **步骤6 (扩展)：实现子级容器组件 (Card/PageContainer) 的上下文穿透响应设计**
