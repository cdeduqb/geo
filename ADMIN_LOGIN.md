# GeoCMS 管理员登录信息

## 🔐 管理员账户

### 登录地址
```
http://localhost:3000/admin/login
```

### 管理员账户信息
```
邮箱: admin@example.com
密码: admin
```

---

## 📱 访问方式

### 1. 管理后台
- 地址: http://localhost:3000/admin
- 登录后可访问所有管理功能

### 2. Prisma Studio（数据库管理）
- **主数据库**: http://localhost:5555
  - 用户、页面、文章、模板等
  
- **授权数据库**: http://localhost:5556
  - 授权、实例、订单等

### 3. 授权管理
- 地址: http://localhost:3000/admin/license
- 查看和管理系统授权

---

## 🎯 主要功能入口

### 内容管理
- 页面管理: `/admin/pages`
- 文章管理: `/admin/articles`
- 产品管理: `/admin/products`

### 模板管理
- 模板列表: `/admin/templates`
- AI生成模板: `/admin/templates/create`

### SEO & GEO
- SEO配置: `/admin/seo/configs`
- GEO优化: `/admin/geo`

### AI功能
- AI策略: `/admin/ai/strategies`
- 批量AI创建: `/admin/ai/tasks`

### 系统设置
- 站点设置: `/admin/settings/site`
- 存储配置: `/admin/settings/storage`
- **授权管理**: `/admin/license` ⭐

---

## 💡 快速开始

1. **启动开发服务器**（已运行）
   ```bash
   npm run dev
   ```

2. **访问管理后台**
   ```
   http://localhost:3000/admin
   ```

3. **使用管理员账户登录**
   ```
   邮箱: admin@example.com
   密码: admin
   ```

4. **探索功能**
   - 查看授权状态: `/admin/license`
   - 管理页面和模板
   - 使用AI功能

---

## 🔧 数据库访问

### Prisma Studio（已运行）

**主数据库**（端口5555）:
```
http://localhost:5555
```
可管理:
- 用户（User）
- 页面（Page）
- 文章（Article）
- 模板（PageTemplate）
- 等...

**授权数据库**（端口5556）:
```
http://localhost:5556
```
可管理:
- 授权（License）
- 实例（LicenseInstance）
- 心跳（LicenseHeartbeat）
- 订单（Order）
- 等...

---

## ⚠️ 重要提示

### 首次登录后建议
1. ✅ 修改管理员密码
2. ✅ 查看授权状态（`/admin/license`）
3. ✅ 配置站点基本信息（`/admin/settings/site`）

### 密码修改
登录后访问个人设置修改密码，或使用以下脚本：

```javascript
// 在Node.js中运行
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const db = new PrismaClient();

// 新密码的SHA256哈希
const newPassword = 'your-new-password';
const hash = crypto.createHash('sha256').update(newPassword).digest('hex');

db.user.update({
  where: { email: 'admin@example.com' },
  data: { password: hash }
}).then(() => {
  console.log('密码已更新');
  process.exit(0);
});
```

---

## 📋 当前系统状态

### 已启动服务
- ✅ Next.js 开发服务器（端口3000）
- ✅ Prisma Studio - 主数据库（端口5555）
- ✅ Prisma Studio - 授权数据库（端口5556）

### 系统信息
- GeoCMS版本: 最新
- 授权系统: 已集成（95%完成）
- 数据库: MySQL（远程）

---

## 🎉 快速访问链接

### 管理后台
- 登录: http://localhost:3000/admin/login
- 首页: http://localhost:3000/admin
- 授权: http://localhost:3000/admin/license

### 数据库管理
- 主数据库: http://localhost:5555
- 授权数据库: http://localhost:5556

### 前台网站
- 首页: http://localhost:3000
- 关于: http://localhost:3000/about
- 联系: http://localhost:3000/contact

---

**创建时间**: 2024-12-23 14:18  
**状态**: ✅ 所有服务正常运行  
**建议**: 立即登录查看授权管理功能
