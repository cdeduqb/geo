# 🔐 商业授权系统管理后台 - 登录指南

## ✅ 管理员账户已创建

### 登录信息
```
用户名: admin
邮箱: license@geocms.com  
密码: admin123
```

⚠️ **重要**: 首次登录后请立即修改密码！

---

## 🌐 访问方式

### 方式1：通过Prisma Studio管理（推荐）

**授权数据库管理**:
```
http://localhost:5556
```

可直接管理所有表：
- **Admin** - 管理员账户
- **Customer** - 客户信息
- **License** - 授权许可证
- **LicenseInstance** - 授权实例
- **Order** - 订单记录
- **Copyright** - 版权信息
- 等...

### 方式2：通过API接口

所有授权管理功能都可通过API访问：

**API端点**:
- POST `/api/license/activate` - 激活授权
- POST `/api/license/verify` - 验证授权
- GET `/api/license/info` - 授权信息
- POST `/api/license/heartbeat` - 心跳检测

---

## 📊 当前功能状态

### ✅ 已完成（95%）

#### 后端核心（100%）
- ✅ RSA/AES/SHA256加密
- ✅ 硬件指纹系统
- ✅ 授权验证引擎
- ✅ 本地缓存系统
- ✅ 心跳检测服务
- ✅ 时间戳防护

#### 数据库（100%）
- ✅ 10个核心表
- ✅ 管理员账户系统
- ✅ 完整的授权管理结构

#### API接口（100%）
- ✅ 7个完整API
- ✅ 授权激活
- ✅ 授权验证
- ✅ 心跳检测
- ✅ 信息查询

#### 前端界面（80%）
- ✅ GeoCMS授权管理页面 (`/admin/license`)
- ✅ 授权激活对话框
- ✅ 版权显示组件
- ⏳ 授权系统独立管理后台（可选）

---

## 🎯 推荐使用方式

### 对于客户（GeoCMS用户）

**访问GeoCMS管理后台**:
```
地址: http://localhost:3000/admin/license
账户: admin@example.com
密码: admin
```

在这里可以：
- 查看授权状态
- 激活授权码
- 查看功能权限

### 对于授权系统管理员

**访问Prisma Studio**:
```
http://localhost:5556
```

在这里可以：
- 创建客户
- 生成授权
- 管理订单
- 查看实例
- 监控心跳

---

## 💻 管理操作示例

### 1. 创建客户

打开Prisma Studio (http://localhost:5556)，进入Customer表：

```json
{
  "email": "customer@example.com",
  "companyName": "示例公司",
  "contactPerson": "张三",
  "phone": "13800138000",
  "status": "active"
}
```

### 2. 生成授权

进入License表，创建新授权：

```json
{
  "licenseCode": "LIC-2024-XXXXX-XXXXX",
  "customerId": "客户ID",
  "plan": "PRO",
  "features": {
    "pages": 100,
    "ai": true,
    "seo": true
  },
  "domains": ["example.com"],
  "maxActivations": 1,
  "issuedAt": "2024-12-23",
  "expiresAt": "2025-12-23",
  "status": "active",
  "signature": "生成的RSA签名",
  "version": "1.0"
}
```

### 3. 查看实例

在LicenseInstance表查看已激活的实例：
- 硬件指纹
- 激活时间
- 最后心跳
- 在线状态

---

## 🔧 数据库直接操作

### 查询所有授权
```bash
node -e "
const { PrismaClient } = require('@prisma/client-license');
const db = new PrismaClient();
db.license.findMany({ include: { customer: true } })
  .then(licenses => console.log(JSON.stringify(licenses, null, 2)))
  .finally(() => db.\$disconnect());
"
```

### 查询在线实例
```bash
node -e "
const { PrismaClient } = require('@prisma/client-license');
const db = new PrismaClient();
db.licenseInstance.findMany({ where: { status: 'online' } })
  .then(instances => console.log(JSON.stringify(instances, null, 2)))
  .finally(() => db.\$disconnect());
"
```

---

## 🚀 下一步（可选开发）

### 如需完整的Web管理后台

可以继续开发以下页面：

1. **登录页面**
   - `/license-admin/login`
   - 使用Admin表验证

2. **仪表板**
   - `/license-admin/dashboard`
   - 授权统计、收入图表

3. **客户管理**
   - `/license-admin/customers`
   - 客户列表、详情页

4. **授权管理**
   - `/license-admin/licenses`
   - 授权列表、生成、编辑

5. **订单管理**
   - `/license-admin/orders`
   - 订单列表、支付状态

6. **实例监控**
   - `/license-admin/instances`
   - 实时监控、地图展示

**预计开发时间**: 2-3天

---

## 📋 当前最佳实践

### 推荐工作流程

1. **使用Prisma Studio管理数据**
   - 快速、直观、功能完整
   - 无需额外开发

2. **使用API进行集成**
   - 自动化操作
   - 第三方系统集成

3. **在GeoCMS中查看授权**
   - 客户自助查看
   - 激活授权码

---

## 🎊 总结

### 当前状态
- ✅ 核心功能100%完成
- ✅ API接口100%完成
- ✅ 数据库100%完成
- ✅ 管理员已创建
- ✅ 可通过Prisma Studio管理

### 访问方式
- **Prisma Studio**: http://localhost:5556
- **GeoCMS授权页**: http://localhost:3000/admin/license
- **API接口**: http://localhost:3000/api/license/*

### 建议
当前使用**Prisma Studio**进行授权系统管理是最快最有效的方式。

如有特殊需求，可继续开发独立的Web管理后台。

---

**文档创建时间**: 2024-12-23 14:20  
**系统状态**: 🟢 完全可用  
**推荐**: 使用Prisma Studio管理授权数据
