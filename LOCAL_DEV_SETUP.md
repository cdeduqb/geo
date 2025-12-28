# ✅ 本地开发 - Prisma Client生成完成

**问题**: Build Error - `Module not found: @prisma/client-license`

**原因**: Prisma Client未生成

**已修复**: 运行 `npx prisma generate --schema=prisma/schema.license.prisma`

---

## 🎯 本地开发环境配置

### 必需步骤（首次或拉取代码后）

```bash
# 1. 安装依赖
npm install

# 2. 生成Prisma Client（主数据库）
npx prisma generate

# 3. 生成Prisma Client（授权数据库）
npx prisma generate --schema=prisma/schema.license.prisma

# 4. 同步数据库（如果需要）
npx prisma db push
npx prisma db push --schema=prisma/schema.license.prisma

# 5. 启动开发服务器
npm run dev
```

---

## 📋 完整开发流程

### 首次设置

```bash
# 1. 克隆代码
git clone your-repo
cd geocms

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env
# 编辑.env，配置数据库连接

# 4. 生成Prisma Client
npm run prisma:generate

# 5. 同步数据库
npm run prisma:push

# 6. 启动开发
npm run dev
```

### 更新代码后

```bash
# 1. 拉取最新代码
git pull

# 2. 安装新依赖
npm install

# 3. 重新生成Prisma Client
npx prisma generate
npx prisma generate --schema=prisma/schema.license.prisma

# 4. 同步数据库变更
npx prisma db push
npx prisma db push --schema=prisma/schema.license.prisma

# 5. 重启开发服务器
# Ctrl+C 停止
npm run dev
```

---

## 🔧 添加npm脚本

建议在 `package.json` 中添加快捷脚本：

```json
{
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start",
    
    "prisma:generate": "npx prisma generate && npx prisma generate --schema=prisma/schema.license.prisma",
    "prisma:push": "npx prisma db push && npx prisma db push --schema=prisma/schema.license.prisma",
    "prisma:studio": "npx prisma studio",
    "prisma:studio:license": "npx prisma studio --schema=prisma/schema.license.prisma --port 5556",
    
    "setup": "npm install && npm run prisma:generate && npm run prisma:push",
    "reset": "npm run prisma:push"
  }
}
```

使用：
```bash
# 快速生成所有Prisma Client
npm run prisma:generate

# 快速同步所有数据库
npm run prisma:push

# 首次设置或重置
npm run setup
```

---

## ⚠️ 常见问题

### 问题1: 修改schema后忘记生成

**现象**: 修改了 `schema.prisma` 或 `schema.license.prisma`，但代码报错

**解决**:
```bash
npx prisma generate
npx prisma generate --schema=prisma/schema.license.prisma
```

### 问题2: 数据库表与schema不一致

**现象**: Prisma查询报错，表不存在

**解决**:
```bash
npx prisma db push
npx prisma db push --schema=prisma/schema.license.prisma
```

### 问题3: node_modules被删除

**现象**: 重新安装依赖后Prisma Client丢失

**解决**:
```bash
npm install
npm run prisma:generate  # 或手动生成
```

### 问题4: Git拉取后报错

**现象**: 拉取新代码后，Prisma相关文件变更

**解决**:
```bash
npm run setup  # 一键重新设置
```

---

## 📂 Prisma相关文件

### 生成的文件（不要提交到Git）
```
node_modules/@prisma/client/          # 主数据库Client
node_modules/@prisma/client-license/  # 授权数据库Client
node_modules/.prisma/                  # Prisma元数据
```

### Schema文件（需要提交）
```
prisma/schema.prisma         # 主数据库Schema
prisma/schema.license.prisma # 授权数据库Schema
```

### .gitignore 确保包含
```gitignore
# Prisma
node_modules/@prisma/
node_modules/.prisma/
```

---

## ✅ 检查清单

开发前检查：
- [ ] npm install 已执行
- [ ] npx prisma generate 已执行（主DB）
- [ ] npx prisma generate --schema=prisma/schema.license.prisma 已执行（授权DB）
- [ ] node_modules/@prisma/client 存在
- [ ] node_modules/@prisma/client-license 存在
- [ ] .env 已配置
- [ ] npm run dev 可以启动

---

## 🚀 快速恢复脚本

创建 `dev-setup.sh`:

```bash
#!/bin/bash

echo "🔧 设置开发环境..."

# 安装依赖
echo "📦 安装依赖..."
npm install

# 生成Prisma Client
echo "⚙️  生成Prisma Client..."
npx prisma generate
npx prisma generate --schema=prisma/schema.license.prisma

# 同步数据库
echo "💾 同步数据库..."
npx prisma db push
npx prisma db push --schema=prisma/schema.license.prisma

echo "✅ 设置完成！"
echo "🚀 运行 npm run dev 启动开发服务器"
```

使用：
```bash
chmod +x dev-setup.sh
./dev-setup.sh
```

---

**现在可以正常开发了！** 🎉

**启动开发**: `npm run dev`

**访问**: http://localhost:3000
