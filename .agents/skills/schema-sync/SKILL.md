---
name: schema-sync
description: 根据 Prisma Schema 的更新，自动执行数据库迁移、生成 Prisma Client，并检查和修复可能受影响的 TypeScript 类型及相关 API 路由。
---

# 任务目标
当项目中的数据结构（`schema.prisma`）发生变动时，确保后端数据库与代码类型体系的一致性，防止因数据字段更改导致的运行时错误。

# 执行步骤
1. 确认用户最近对 `prisma/schema.prisma` 做的修改内容。
2. 运行 `npx prisma format` 以确保格式正确。
3. 执行数据库迁移或推送：
   - 如果是开发环境且需要记录迁移，运行 `npx prisma migrate dev --name <migration_name>`。
   - 否则运行 `npx prisma db push` 快速更新表结构。
4. 运行 `npx prisma generate` 重新生成 Prisma Client 类型。
5. （关键步骤）通过搜索项目中引用被修改模型的代码（特别是 `src/app/api/` 的路由和相关的 TypeScript interfaces），检查是否有字段缺失或重命名导致的 TS 类型报错。
6. 如果发现报错或类型不匹配，主动修改相关代码以适配新的 Schema 结构，并在完成后向用户汇报修复了哪些文件。
