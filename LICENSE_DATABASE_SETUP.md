# GeoCMS 授权系统 - 数据库配置完成

## ✅ 已完成工作（2024-12-23）

### 1. 独立授权数据库
- ✅ **数据库信息**
  - 数据库名: `cmssq`
  - 地址: `101.126.137.112`
  - 用户名: `cmssq`
  - 密码: `2awBTbS3fs6iHd8i`

- ✅ **Prisma Schema**
  - 文件: `prisma/schema.license.prisma`
  - 生成路径: `node_modules/@prisma/client-license`

### 2. 数据库表结构（10个表）
- ✅ `customers` - 客户信息
- ✅ `licenses` - 授权许可证
- ✅ `license_instances` - 授权实例（监控）
- ✅ `license_heartbeats` - 心跳日志
- ✅ `orders` - 订单管理
- ✅ `copyrights` - 版权信息
- ✅ `system_configs` - 系统配置
- ✅ `admins` - 管理员账户
- ✅ `audit_logs` - 操作日志

### 3. RSA 密钥对
- ✅ 已生成 RSA-2048 密钥对
- ✅ 保存在 `.keys/` 目录
- ✅ 公钥用于客户端验证
- ✅ 私钥用于服务端签名

---

## 📂 文件结构

```
geocms/
├── prisma/
│   ├── schema.prisma         # GeoCMS 主数据库
│   └── schema.license.prisma # 授权系统独立数据库 ✨
├── .keys/                    # RSA 密钥（不要提交到git）
│   ├── public.pem           # 公钥
│   ├── private.pem          # 私钥
│   └── env-keys.txt         # 环境变量格式
├── scripts/
│   ├── generate-rsa-keys.js  # 生成RSA密钥
│   └── init-license-db.sh    # 数据库初始化
├── docs/
│   └── LICENSE_ENV.md        # 环境变量说明
└── .env                      # 已添加授权数据库连接
```

---

## 🗄️ 数据库表详情

### License（授权许可证）
```sql
主要字段：
- licenseCode: 授权码
- plan: 套餐（TRIAL/BASIC/PRO/ENTERPRISE）
- features: 功能配置（JSON）
- domains: 授权域名（JSON）
- fingerprint: 硬件指纹
- signature: RSA签名
- status: 状态（active/suspended/expired）
```

### LicenseInstance（实例监控）
```sql
主要字段：
- fingerprint: 硬件指纹（唯一）
- domain: 域名
- ipAddress: IP地址
- geoLocation: 地理位置（JSON）
- lastHeartbeat: 最后心跳时间
- status: online/offline/suspicious
```

### LicenseHeartbeat（心跳日志）
```sql
主要字段：
- status: success/failed/warning
- responseTime: 响应时间（ms）
- cpuUsage: CPU使用率
- memoryUsage: 内存使用率
- timestamp: 时间戳
```

---

## 🔐 RSA 密钥使用

### 服务端（授权系统）
```typescript
import { RSACrypto } from '@/lib/license/crypto/rsa';

// 从 .keys/private.pem 读取私钥
const privateKey = RSACrypto.loadKeyPair().privateKey;

// 生成授权码签名
const licenseData = {
  licenseId: "LIC-2024-001",
  plan: "ENTERPRISE",
  expiresAt: Date.now() + 365*24*60*60*1000
};

const signature = RSACrypto.signLicense(licenseData, privateKey);
```

### 客户端（GeoCMS）
```typescript
import { PUBLIC_KEY } from '@/lib/license/crypto/rsa';

// 验证授权码
const isValid = RSACrypto.verifyLicense(
  licenseData,
  signature,
  PUBLIC_KEY
);
```

---

## 📊 套餐配置

### TRIAL（试用版）- 免费
- 有效期: 30天
- 域名: 1个
- 功能: 基础功能
- 版权: 必须显示

### BASIC（基础版）- ¥2,999/年
- 域名: 1个
- 功能: 基础 + 部分高级
- 版权: 可自定义

### PRO（专业版）- ¥9,999/年
- 域名: 3个
- 功能: 全部功能
- AI: 包含
- SEO: 高级

### ENTERPRISE（企业版）- ¥29,999/年
- 域名: 无限
- 功能: 全部 + 定制
- 支持: 专属
- 源码: 可交付

---

## 🚀 下一步操作

### 1. 环境变量配置
将 `.keys/env-keys.txt` 中的密钥添加到 `.env`:
```bash
cat .keys/env-keys.txt >> .env
```

### 2. 确保密钥安全
```bash
# 添加到 .gitignore
echo ".keys/" >> .gitignore
```

### 3. 测试数据库连接
```bash
# 使用独立schema查询
npx prisma studio --schema=prisma/schema.license.prisma
```

### 4. 创建初始管理员
```javascript
// scripts/create-admin.js
const { PrismaClient } = require('@prisma/client-license');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await prisma.admin.create({
    data: {
      username: 'admin',
      email: 'admin@geocms.com',
      password: hashedPassword,
      role: 'super_admin'
    }
  });
}

main();
```

---

## 🔄 数据库同步命令

```bash
# 生成 Prisma Client
npx prisma generate --schema=prisma/schema.license.prisma

# 推送数据库变更
npx prisma db push --schema=prisma/schema.license.prisma

# 打开数据库浏览器
npx prisma studio --schema=prisma/schema.license.prisma

# 重置数据库（危险！）
npx prisma db push --schema=prisma/schema.license.prisma --force-reset
```

---

## 📈 进度更新

```
授权系统开发进度: ████████░░ 50%

✅ 阶段1: 基础架构 - 100% 完成
  ├─ 加密库 ✅
  ├─ 硬件指纹 ✅
  └─ 数据库模型 ✅

⏳ 阶段2: 验证引擎 - 0%
⏳ 阶段3: API开发 - 0%
⏳ 阶段4: 前端界面 - 0%
⏳ 阶段5: 安全加固 - 0%
```

---

## 🎯 关键文件

| 文件 | 用途 | 状态 |
|------|------|------|
| `prisma/schema.license.prisma` | 授权数据库模型 | ✅ |
| `.keys/public.pem` | RSA公钥 | ✅ |
| `.keys/private.pem` | RSA私钥 | ✅ |
| `src/lib/license/crypto/*` | 加密库 | ✅ |
| `src/lib/license/fingerprint/*` | 硬件指纹 | ✅ |
| `.env` | 环境变量 | ✅ |

---

**最后更新**: 2024-12-23 13:09  
**数据库状态**: ✅ 已同步  
**RSA密钥**: ✅ 已生成  
**下一阶段**: 授权验证引擎开发
