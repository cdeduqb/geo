---
name: component-generator
description: 快速生成一个符合当前项目规范的 Next.js/React 组件，包含 TypeScript 接口、TailwindCSS 样式和标准代码框架。
---

# 任务目标
根据简单的描述，直接生成包含严谨类型推导、符合高阶视觉审美的无状态或有状态 React/Next.js 组件。极大地减少编写基础模板代码的时间。

# 执行步骤
1. 向用户确认需要生成的 **组件名称**、**所在目录路径**（如 `src/components/ui/` 等）以及该组件的**具体功能/用途**。
2. 梳理组件的数据流结构，首先确立该组件所需的 `interface Props { ... }` 属性结构。
3. 编写组件标准代码：
   - 使用现代函数式组件 (Functional Component) 写法。
   - 使用 TailwindCSS 编写现代、美观且响应式的 UI 样式（如阴影、圆角、悬浮过渡效果等）。
   - 如果涉及浏览器端交互（如 useState / onClick），记得在顶部加上 `"use client";` 声明。不涉及则默认 Server Component。
4. 使用工具将代码直接写入指定的路径目标。
5. 返回该组件的引入方式示例和使用 Demo，告知用户已生成完毕。
