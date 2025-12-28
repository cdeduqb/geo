# GeoCMS 安全配置指南

## 数据库安全

### 连接池配置
在 `.env` 中配置数据库连接字符串时，务必包含连接池参数：

```env
DATABASE_URL="mysql://user:password@host:3306/geocms?connection_limit=10&pool_timeout=20&connect_timeout=10"
```

参数说明：
- `connection_limit=10`: 最大连接数（根据服务器资源调整）
- `pool_timeout=20`: 连接池超时时间（秒）
- `connect_timeout=10`: 连接超时时间（秒）

### 数据库密码安全
- 使用强密码（至少16位，包含大小写字母、数字、特殊字符）
- 定期更换密码
- 不要在代码中硬编码密码

## API 安全

### CORS 配置
在生产环境中，限制 CORS 允许的域名：

```javascript
// next.config.mjs
headers: [
  {
    source: '/api/:path*',
    headers: [
      { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' },
    ],
  },
]
```

### 身份验证
所有 `/api/admin/*` 路由都应检查身份验证：

```typescript
import { getServerSession } from 'next-auth';

export async function GET(request: Request) {
  const session = await getServerSession();
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }
  // ...
}
```

### 速率限制
建议在 Nginx 或 API 网关层面配置速率限制：

```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req zone=api burst=20 nodelay;
```

## 文件上传安全

### 文件类型验证
```typescript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

if (!ALLOWED_TYPES.includes(file.type)) {
  return new Response('Invalid file type', { status: 400 });
}

if (file.size > MAX_FILE_SIZE) {
  return new Response('File too large', { status: 400 });
}
```

### 文件名安全
- 使用 UUID 重命名上传的文件
- 验证文件扩展名
- 存储在非公开目录

## 环境变量安全

### 敏感信息保护
- 永远不要提交 `.env` 到 Git
- 使用 `.env.local` 存储本地配置
- 生产环境使用环境变量管理工具

### 密钥管理
```env
# JWT 密钥（使用强随机字符串）
JWT_SECRET=your-super-secret-jwt-key

# 数据库密码
DATABASE_PASSWORD=strong-random-password

# API 密钥
OPENAI_API_KEY=your-api-key
```

## 定时器和内存管理

### useEffect 清理
React 组件中使用定时器时，务必清理：

```typescript
useEffect(() => {
  const timer = setInterval(() => {
    // ...
  }, 1000);
  
  return () => clearInterval(timer); // 清理
}, []);
```

### 避免内存泄漏
- 组件卸载时取消订阅
- 清理定时器和监听器
- 避免在循环中创建闭包

## 日志和监控

### 日志记录
- 记录所有认证失败
- 记录异常错误
- 定期检查日志

### 错误报告
建议集成错误监控工具（如 Sentry）：

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## 依赖安全

### 定期更新
```bash
# 检查过时的包
npm outdated

# 检查安全漏洞
npm audit

# 修复漏洞
npm audit fix
```

### 最小依赖原则
- 只安装必要的依赖
- 定期审查和清理未使用的包
- 使用 lock 文件锁定版本

## 部署安全

### HTTPS
生产环境必须使用 HTTPS：
- 使用 Let's Encrypt 免费证书
- 配置 HSTS 头
- 禁用 HTTP

### 安全头
```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000";
```

### 防火墙
- 只开放必要端口（22, 80, 443）
- 配置 fail2ban 防止暴力破解
- 使用 SSH 密钥认证

## 数据备份

### 自动备份
```bash
# 每天凌晨 2 点备份数据库
0 2 * * * /path/to/backup-script.sh

# 保留最近 30 天的备份
find /backup -mtime +30 -delete
```

### 备份验证
- 定期测试备份恢复
- 异地备份
- 加密备份文件

## 安全检查清单

日常检查：
- [ ] 检查系统日志
- [ ] 监控资源使用
- [ ] 检查异常访问

每周检查：
- [ ] 运行 npm audit
- [ ] 检查依赖更新
- [ ] 审查访问日志

每月检查：
- [ ] 更新依赖包
- [ ] 审查权限配置
- [ ] 测试备份恢复
- [ ] 安全漏洞扫描

---

**最后更新**: 2025-12-29
**适用版本**: GeoCMS 1.0+
