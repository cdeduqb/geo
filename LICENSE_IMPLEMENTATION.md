# GeoCMS 商业授权系统 - 实施任务清单

## 📅 开发时间线：5周完成

---

## ✅ 阶段 1：基础架构搭建（第1周）

### 任务 1.1：创建授权模块目录结构
- [x] 创建 `src/lib/license/` 核心库
- [ ] 创建 `src/app/admin/license/` 管理页面
- [ ] 创建 `src/components/license/` UI组件
- [ ] 创建数据库模型

### 任务 1.2：实现核心加密库
- [ ] RSA 密钥对生成 (`src/lib/license/crypto/rsa.ts`)
- [ ] AES 加密工具 (`src/lib/license/crypto/aes.ts`)
- [ ] 签名验证工具 (`src/lib/license/crypto/signature.ts`)
- [ ] 哈希工具 (`src/lib/license/crypto/hash.ts`)

### 任务 1.3：硬件指纹系统
- [ ] CPU信息获取 (`src/lib/license/fingerprint/cpu.ts`)
- [ ] 网络接口获取 (`src/lib/license/fingerprint/network.ts`)
- [ ] 系统信息获取 (`src/lib/license/fingerprint/system.ts`)
- [ ] 指纹生成器 (`src/lib/license/fingerprint/generator.ts`)

### 任务 1.4：数据库设计
```sql
-- 在现有 schema.prisma 中添加
model License {
  id                String    @id @default(uuid())
  licenseCode       String    @unique
  customerId        String?
  customerEmail     String?
  customerCompany   String?
  plan              String    // TRIAL, BASIC, PRO, ENTERPRISE
  domains           Json      // ["example.com"]
  fingerprint       String?   // 硬件指纹
  features          Json      // {"pages": true, "ai": true}
  issuedAt          DateTime  @default(now())
  expiresAt         DateTime
  status            String    @default("active") // active, suspended, expired
  maxActivations    Int       @default(1)
  currentActivations Int      @default(0)
  signature         String    @db.Text
  metadata          Json?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  instances         LicenseInstance[]
  heartbeats        LicenseHeartbeat[]
}

model LicenseInstance {
  id            String    @id @default(uuid())
  licenseId     String
  license       License   @relation(fields: [licenseId], references: [id])
  fingerprint   String    @unique
  domain        String?
  ipAddress     String?
  geoLocation   Json?     // {country, city, lat, lng}
  version       String?
  lastHeartbeat DateTime?
  status        String    @default("online") // online, offline, suspicious
  metadata      Json?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  heartbeats    LicenseHeartbeat[]
}

model LicenseHeartbeat {
  id           BigInt   @id @default(autoincrement())
  licenseId    String
  license      License  @relation(fields: [licenseId], references: [id])
  instanceId   String
  instance     LicenseInstance @relation(fields: [instanceId], references: [id])
  timestamp    DateTime @default(now())
  status       String   // success, failed
  responseTime Int?     // ms
  errorMessage String?  @db.Text
  metadata     Json?
}

model LicenseCopyright {
  id              String   @id @default(uuid())
  companyName     String   // 授权公司名称
  companyUrl      String?  // 公司网址
  icpNumber       String?  // ICP备案号
  customText      String?  @db.Text // 自定义版权文本
  showPoweredBy   Boolean  @default(true) // 是否显示 "Powered by GeoCMS"
  isActive        Boolean  @default(true)
  licenseId       String?  @unique
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

---

## ✅ 阶段 2：授权验证核心（第2周）

### 任务 2.1：授权验证引擎
文件：`src/lib/license/verifier.ts`
```typescript
功能：
- 授权码解析和验证
- 域名匹配检查
- 硬件指纹匹配
- 过期时间检查
- 特性权限检查
```

### 任务 2.2：本地缓存系统
文件：`src/lib/license/cache.ts`
```typescript
功能：
- 授权信息本地缓存
- 缓存有效期管理（24小时）
- 离线宽限期（7天）
- 缓存加密存储
```

### 任务 2.3：心跳检测服务
文件：`src/lib/license/heartbeat.ts`
```typescript
功能：
- 定时心跳检测（每小时）
- 在线状态上报
- 异常情况处理
- 自动重连机制
```

### 任务 2.4：时间戳防护
文件：`src/lib/license/timestamp.ts`
```typescript
功能：
- 系统时间检测
- 时间回拨检测
- 服务器时间同步
- 时间篡改告警
```

---

## ✅ 阶段 3：API 开发（第3周）

### 任务 3.1：授权API路由
```
POST /api/license/verify      - 验证授权
POST /api/license/activate    - 激活授权
POST /api/license/heartbeat   - 心跳检测
GET  /api/license/info        - 授权信息
POST /api/license/deactivate  - 停用授权
```

### 任务 3.2：版权API路由
```
GET  /api/copyright/branding  - 获取版权信息
POST /api/copyright/update    - 更新版权信息
```

### 任务 3.3：管理API路由
```
GET    /api/admin/licenses           - 授权列表
POST   /api/admin/licenses           - 创建授权
PATCH  /api/admin/licenses/:id       - 更新授权
DELETE /api/admin/licenses/:id       - 删除授权
GET    /api/admin/licenses/instances - 实例列表
GET    /api/admin/licenses/stats     - 统计数据
```

---

## ✅ 阶段 4：前端界面（第4周）

### 任务 4.1：授权管理页面
路径：`src/app/admin/license/page.tsx`
```
功能：
- 授权状态展示
- 授权信息详情
- 购买授权入口
- 授权激活界面
- 自定义版权设置
```

### 任务 4.2：版权组件
文件：`src/components/license/Copyright.tsx`
```typescript
功能：
- 动态版权信息显示
- 未授权警告
- 购买授权按钮
- 授权到期提醒
```

### 任务 4.3：授权状态指示器
文件：`src/components/license/StatusIndicator.tsx`
```typescript
显示位置：
- 后台侧边栏底部
- 系统设置页面
- 登录页面底部
```

### 任务 4.4：授权激活向导
文件：`src/components/license/ActivationWizard.tsx`
```typescript
步骤：
1. 输入授权码
2. 验证授权信息
3. 绑定域名
4. 激活成功
```

---

## ✅ 阶段 5：安全加固与部署（第5周）

### 任务 5.1：代码混淆
```bash
# 安装混淆工具
npm install -D javascript-obfuscator webpack-obfuscator

# 配置混淆
- 授权验证核心代码
- 硬件指纹算法
- 加密密钥处理
```

### 任务 5.2：代码完整性检查
文件：`src/lib/license/integrity.ts`
```typescript
功能：
- 关键文件 hash 计算
- 启动时完整性验证
- 文件变更检测
- 篡改告警
```

### 任务 5.3：运行时保护
```typescript
功能：
- 调试器检测
- 控制台输出拦截
- 页面检查工具检测
- 定期安全扫描
```

### 任务 5.4：中间件集成
文件：`src/middleware.ts`
```typescript
功能：
- 全局授权检查
- 路由访问控制
- API 授权验证
- 未授权重定向
```

---

## 📦 附加任务

### 任务 A.1：授权服务器（独立项目）
> 注：这部分可以后期单独开发和部署

功能：
- 用户注册/登录
- 套餐展示购买
- 支付集成
- 订单管理
- 授权码生成
- 实例监控面板
- 数据统计分析

### 任务 A.2：文档编写
- [ ] 授权系统使用手册
- [ ] API 接口文档
- [ ] 部署指南
- [ ] 故障排查手册

### 任务 A.3：测试
- [ ] 单元测试
- [ ] 集成测试
- [ ] 安全测试
- [ ] 压力测试
- [ ] 破解测试

---

## 🗓️ 详细时间表

| 周次 | 任务 | 交付物 |
|------|------|--------|
| 第1周 | 阶段1 | 目录结构、加密库、数据库模型 |
| 第2周 | 阶段2 | 授权验证、缓存、心跳 |
| 第3周 | 阶段3 | 完整的API接口 |
| 第4周 | 阶段4 | 管理界面、版权组件 |
| 第5周 | 阶段5 | 代码混淆、安全加固 |

---

## 🎯 当前状态

### ✅ 已完成
- [x] 方案设计文档
- [x] 技术架构设计
- [x] 数据库模型设计

### 🔄 进行中
- [ ] 准备开始第一阶段开发

### ⏳ 待开始
- [ ] 阶段 1-5 的所有任务

---

## 📝 开发原则

1. **安全第一**：所有敏感操作都要加密
2. **离线可用**：支持离线运行（带宽限期）
3. **性能优先**：不影响系统主要功能
4. **用户友好**：清晰的提示和引导
5. **商业友好**：灵活的套餐和定价

---

## 🚀 下一步行动

1. 创建目录结构
2. 添加必要的依赖包
3. 开始开发加密库
4. 实现硬件指纹
5. 数据库迁移

准备好开始了吗？我将从**阶段1任务1.1**开始实施！
