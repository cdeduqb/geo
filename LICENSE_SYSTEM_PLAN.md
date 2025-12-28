# GeoCMS 商业授权系统 - 完整技术方案

## 📋 方案概述

一个企业级的软件授权管理系统，包含授权服务器（License Server）和客户端验证模块，确保 GeoCMS 系统的商业保护和授权管理。

---

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                    授权服务器 (License Server)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  授权管理后台  │  │  用户购买系统  │  │   API 服务   │      │
│  │  (Admin)     │  │  (Store)     │  │  (License)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │             │
│         └──────────────────┴──────────────────┘             │
│                           │                                 │
│                    PostgreSQL 数据库                         │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTPS (RSA 加密)
┌─────────────────────────────────────────────────────────────┐
│                   GeoCMS 客户端实例                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  授权验证模块  │  │  心跳检测服务  │  │  版权管理模块  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │             │
│         └──────────────────┴──────────────────┘             │
│                     本地缓存 + MySQL                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 核心功能模块

### 1. **授权服务器（License Server）**

#### 1.1 技术栈
- **框架**: Next.js 15 (App Router)
- **数据库**: PostgreSQL 16 (独立数据库)
- **认证**: NextAuth.js (独立用户系统)
- **支付**: 支付宝/微信支付/Stripe
- **加密**: RSA-2048 + AES-256
- **部署**: Docker + Nginx + PM2

#### 1.2 功能清单

##### A. 用户购买系统
```typescript
功能列表：
✓ 用户注册/登录
✓ 授权套餐展示（基础版/专业版/企业版）
✓ 在线支付（支付宝/微信/信用卡）
✓ 授权码生成与发放
✓ 订单管理
✓ 发票管理
✓ 授权续费提醒
```

##### B. 授权管理后台
```typescript
功能列表：
✓ 授权实例监控（实时在线状态）
✓ 授权码管理（生成/吊销/续期）
✓ 客户信息管理
✓ 使用统计分析
✓ 异常检测报警
✓ 授权套餐配置
✓ 版权信息管理
```

##### C. API 服务
```typescript
核心接口：
1. POST /api/license/verify      - 授权验证
2. POST /api/license/activate    - 激活授权
3. POST /api/license/heartbeat   - 心跳检测
4. GET  /api/license/info        - 授权信息
5. POST /api/license/revoke      - 吊销授权
6. GET  /api/copyright/branding  - 版权信息
```

### 2. **GeoCMS 客户端集成**

#### 2.1 授权验证模块

```typescript
核心机制：
1. 硬件指纹生成（CPU + MAC + 系统信息）
2. 域名绑定验证
3. 授权码 RSA 签名验证
4. 本地缓存 + 定期在线验证
5. 离线宽限期（7天）
6. 防时间回调检测
```

#### 2.2 版权管理模块

```typescript
版权展示位置：
✓ 页面底部全局版权栏
✓ 后台登录页
✓ 后台侧边栏底部
✓ 系统设置页面

状态：
- 未授权：显示授权服务器版权 + "购买授权"按钮
- 已授权：显示用户自定义版权信息
```

---

## 🔐 安全防护方案

### 1. **多层加密体系**

#### 层级 1: 通信加密
```
客户端 → 服务端
1. HTTPS + TLS 1.3
2. 请求签名（HMAC-SHA256）
3. 时间戳防重放
4. RSA 公钥加密授权码
```

#### 层级 2: 授权码设计
```typescript
授权码结构（RSA-2048 签名）：
{
  licenseId: "LIC-2024-XXXXXX",
  customerId: "CUST-XXXXXX",
  instanceId: "硬件指纹哈希",
  domains: ["example.com", "*.example.com"],
  plan: "ENTERPRISE",
  features: ["无限页面", "AI功能", "高级SEO"],
  issuedAt: 1703318400000,
  expiresAt: 1734854400000,
  signature: "RSA签名..."
}
```

#### 层级 3: 代码混淆
```javascript
混淆方案：
1. JavaScript Obfuscator（授权验证核心代码）
2. Webpack 加密打包
3. 关键函数名混淆
4. 字符串加密
5. 控制流扁平化
```

### 2. **防破解措施**

#### A. 硬件指纹技术
```typescript
// 生成唯一设备标识
const generateFingerprint = async () => {
  const components = [
    os.cpus()[0].model,          // CPU 型号
    os.networkInterfaces(),       // MAC 地址
    os.hostname(),                // 主机名
    process.env.MACHINE_ID,       // 机器 ID
  ];
  
  return crypto
    .createHash('sha256')
    .update(components.join('|'))
    .digest('hex');
};
```

#### B. 时间戳检测
```typescript
// 防止系统时间回调
const checkTimeTampering = async () => {
  const serverTime = await fetchServerTime();
  const localTime = Date.now();
  const lastCheckTime = getLastCheckTime();
  
  // 检测时间倒流
  if (localTime < lastCheckTime - 300000) {
    throw new Error('系统时间异常');
  }
  
  // 检测时间偏差
  if (Math.abs(serverTime - localTime) > 600000) {
    throw new Error('系统时间与服务器不同步');
  }
};
```

#### C. 代码完整性校验
```typescript
// 关键文件 MD5 校验
const verifyCodeIntegrity = () => {
  const criticalFiles = [
    'license-verify.js',
    'fingerprint.js',
    'copyright.js'
  ];
  
  criticalFiles.forEach(file => {
    const hash = calculateFileHash(file);
    if (hash !== getStoredHash(file)) {
      throw new Error('代码被篡改');
    }
  });
};
```

#### D. 运行时检测
```typescript
// 检测调试器
const detectDebugger = () => {
  const start = Date.now();
  debugger; // 调试器会暂停
  const end = Date.now();
  
  if (end - start > 100) {
    // 检测到调试器
    process.exit(1);
  }
};

// 定期执行
setInterval(detectDebugger, 60000);
```

#### E. 心跳检测机制
```typescript
// 每小时验证一次授权
const heartbeat = async () => {
  const fingerprint = await generateFingerprint();
  const response = await fetch(LICENSE_SERVER + '/heartbeat', {
    method: 'POST',
    body: JSON.stringify({
      licenseId: getLicenseId(),
      fingerprint,
      timestamp: Date.now(),
      version: APP_VERSION
    })
  });
  
  if (!response.ok) {
    handleLicenseExpired();
  }
};

setInterval(heartbeat, 3600000); // 1小时
```

---

## 📦 套餐设计

### 套餐 1: 基础版 - ¥2,999/年
```
✓ 单域名授权
✓ 基础功能（页面管理、文章管理）
✓ 社区支持
✓ 1年更新
```

### 套餐 2: 专业版 - ¥9,999/年
```
✓ 3个域名授权
✓ 全部功能（包含AI、SEO优化）
✓ 邮件/电话支持
✓ 1年更新 + 优先bug修复
✓ 自定义版权信息
```

### 套餐 3: 企业版 - ¥29,999/年
```
✓ 无限域名授权
✓ 全部功能 + 定制开发
✓ 专属技术支持
✓ 永久更新
✓ 源码交付
✓ SLA 保障
```

---

## 🗂️ 项目结构

### 授权服务器目录结构
```
geocms-license-server/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (store)/           # 用户购买系统
│   │   │   ├── page.tsx       # 首页
│   │   │   ├── pricing/       # 套餐展示
│   │   │   ├── checkout/      # 结算页
│   │   │   ├── dashboard/     # 用户仪表板
│   │   │   └── orders/        # 订单管理
│   │   ├── (admin)/           # 管理后台
│   │   │   ├── dashboard/     # 监控面板
│   │   │   ├── licenses/      # 授权管理
│   │   │   ├── customers/     # 客户管理
│   │   │   ├── instances/     # 实例监控
│   │   │   └── settings/      # 系统设置
│   │   └── api/               # API路由
│   │       ├── license/
│   │       ├── payment/
│   │       └── copyright/
│   ├── lib/
│   │   ├── crypto/            # 加密工具
│   │   ├── fingerprint/       # 指纹生成
│   │   ├── signature/         # 签名验证
│   │   └── payment/           # 支付集成
│   ├── components/
│   └── prisma/
│       └── schema.prisma
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

### GeoCMS 集成文件
```
geocms/
├── src/
│   ├── lib/
│   │   ├── license/           # 授权模块（加密）
│   │   │   ├── verify.ts      # 验证逻辑
│   │   │   ├── fingerprint.ts # 指纹生成
│   │   │   ├── cache.ts       # 本地缓存
│   │   │   └── heartbeat.ts   # 心跳检测
│   │   └── copyright/         # 版权模块
│   │       ├── branding.tsx   # 版权组件
│   │       └── manager.ts     # 版权管理
│   ├── middleware.ts          # 授权中间件
│   └── app/
│       └── admin/
│           └── license/       # 授权管理页面
│               └── page.tsx
```

---

## 🚀 实施步骤

### 阶段 1: 授权服务器开发（2周）
- [ ] 搭建 Next.js 项目框架
- [ ] 设计数据库模型
- [ ] 开发用户购买系统
- [ ] 集成支付接口
- [ ] 开发管理后台
- [ ] 实现授权API

### 阶段 2: 加密与防护（1周）
- [ ] 实现 RSA 密钥对生成
- [ ] 开发授权码签名系统
- [ ] 实现硬件指纹算法
- [ ] 代码混淆配置
- [ ] 完整性校验系统

### 阶段 3: GeoCMS 集成（1周）
- [ ] 开发授权验证模块
- [ ] 实现心跳检测
- [ ] 集成版权管理
- [ ] 添加授权管理页面
- [ ] 全局中间件集成

### 阶段 4: 测试与部署（1周）
- [ ] 功能测试
- [ ] 安全测试
- [ ] 性能测试
- [ ] Docker 打包
- [ ] 服务器部署

---

## 💎 亮点特性

### 1. **实时监控仪表板**
```
- 地图可视化：显示所有授权实例地理位置
- 实时状态：在线/离线/过期/异常
- 使用统计：页面访问量、功能使用率
- 性能监控：响应时间、错误率
```

### 2. **智能告警系统**
```
- 授权即将过期提醒
- 异常登录检测
- 硬件指纹变更警报
- 超出授权范围使用
```

### 3. **灵活授权模式**
```
- 按时间授权（月/年）
- 按功能授权（模块化）
- 按域名授权（单/多域名）
- 按用户数授权
```

### 4. **优雅降级策略**
```
授权过期后：
- 保留查看功能
- 禁用编辑功能
- 显示续费提醒
- 保留7天宽限期
```

---

## 🔧 技术细节

### 授权验证流程图
```
┌─────────┐
│ 启动系统 │
└────┬────┘
     │
     ▼
┌──────────────────┐
│ 检查本地授权缓存  │
└────┬────┬────────┘
     │    │
 有效 │    │ 无效/过期
     │    │
     │    ▼
     │ ┌──────────────────┐
     │ │ 连接授权服务器    │
     │ └────┬────┬────────┘
     │      │    │
     │  成功│    │失败
     │      │    │
     │      ▼    ▼
     │   ┌────────────┐
     │   │ 验证授权码  │
     │   └──┬────┬────┘
     │      │    │
     │  通过│    │未通过
     │      │    │
     ▼      ▼    ▼
┌──────────────────┐
│    正常运行       │ 
│ 每小时心跳检测    │
└──────────────────┘
     │
     ▼
┌──────────────────┐
│  显示用户版权     │
└──────────────────┘

    (失败路径)
     │
     ▼
┌──────────────────┐
│  显示服务商版权   │
│  + 购买授权按钮   │
└──────────────────┘
```

---

## 📄 数据库设计

### 授权服务器核心表
```sql
-- 客户表
CREATE TABLE customers (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  company_name VARCHAR(255),
  contact_person VARCHAR(100),
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 授权表
CREATE TABLE licenses (
  id UUID PRIMARY KEY,
  license_code VARCHAR(255) UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  plan VARCHAR(50) NOT NULL, -- BASIC/PRO/ENTERPRISE
  domains TEXT[], -- 授权域名列表
  instance_fingerprint VARCHAR(64),
  features JSONB, -- 功能配置
  issued_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- active/suspended/expired
  max_activations INTEGER DEFAULT 1,
  current_activations INTEGER DEFAULT 0,
  signature TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 实例表（监控所有安装）
CREATE TABLE instances (
  id UUID PRIMARY KEY,
  license_id UUID REFERENCES licenses(id),
  fingerprint VARCHAR(64) UNIQUE NOT NULL,
  domain VARCHAR(255),
  ip_address INET,
  geo_location JSONB, -- {country, city, lat, lng}
  version VARCHAR(20),
  last_heartbeat TIMESTAMP,
  status VARCHAR(20) DEFAULT 'online', -- online/offline/suspicious
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 订单表
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  license_id UUID REFERENCES licenses(id),
  plan VARCHAR(50),
  amount DECIMAL(10, 2),
  currency VARCHAR(10) DEFAULT 'CNY',
  payment_method VARCHAR(50),
  payment_status VARCHAR(20), -- pending/completed/failed
  transaction_id VARCHAR(255),
  invoice_issued BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 心跳日志
CREATE TABLE heartbeat_logs (
  id BIGSERIAL PRIMARY KEY,
  instance_id UUID REFERENCES instances(id),
  timestamp TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20),
  response_time INTEGER, -- ms
  error_message TEXT
);
```

---

## 🎨 UI 设计要点

### 授权服务器界面
- **现代渐变风格**：紫色-蓝色渐变主题
- **数据可视化**：Charts.js 实时图表
- **响应式设计**：完美适配移动端
- **动画效果**：Framer Motion 流畅动画
- **暗色模式**：支持亮/暗主题切换

### GeoCMS 授权页面
- **清晰的授权状态展示**
- **一键购买授权按钮**
- **授权详情查看**
- **自定义版权设置**

---

## 💰 商业模式建议

### 收入来源
1. **授权销售**：主要收入
2. **续费收入**：持续现金流
3. **升级收入**：套餐升级差价
4. **定制服务**：企业级定制开发
5. **技术支持**：增值服务

### 定价策略
- **首年优惠**：8折吸引新客户
- **多年折扣**：3年7折，5年6折
- **批量授权**：10个起9折
- **推荐返佣**：推荐成功返10%

---

这个方案提供了完整的技术架构、安全防护、实施步骤和商业模式。是否需要我立即开始实施某个特定模块？
