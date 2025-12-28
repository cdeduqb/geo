# GeoCMS 授权管理服务器

## 简介
这是从 GeoCMS 项目中提取的独立授权管理系统，可以单独部署为授权服务器。

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填入正确的配置
```

### 3. 初始化数据库
```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

### 4. 启动服务
```bash
# 开发模式
npm run dev

# 生产模式
npm run build
npm start
```

## 部署指南
详细部署步骤请查看 `docs/LICENSE_SERVER_DEPLOYMENT.md`

## 管理指南
管理后台使用说明请查看 `docs/LICENSE_ADMIN_GUIDE.md`

## 访问地址
- 管理后台: http://localhost:4000/license-admin
- API 端点: http://localhost:4000/api/license/*
- Prisma Studio: npm run prisma:studio

## 技术栈
- Next.js 14
- Prisma ORM
- MySQL
- TypeScript
- RSA/AES 加密

## 许可证
保留所有权利 © 2024
