# 服务器崩溃问题修复指南

## 问题原因

系统在服务器上崩溃主要由以下几个原因导致：

### 1. 心跳服务内存泄漏 ⚠️ **主要原因**
- **问题**：授权系统的心跳服务（HeartbeatService）在每次 API 请求时可能创建新的定时器
- **影响**：定时器累积导致内存泄漏，最终导致服务器崩溃
- **修复**：已添加安全检查，在 Serverless 环境和 API 路由中自动禁用心跳服务

### 2. 数据库连接池耗尽
- **问题**：频繁的数据库查询可能耗尽连接池
- **影响**：新请求无法获取数据库连接，导致请求堆积和内存溢出
- **修复**：已添加连接池配置建议

### 3. 未处理的异步错误
- **问题**：心跳发送失败时的错误未被捕获
- **影响**：未捕获的 Promise rejection 可能导致进程崩溃
- **修复**：已为所有心跳相关的异步操作添加错误处理

## 修复措施

### ✅ 已自动修复的问题

1. **禁用 Serverless 环境的心跳**
   ```typescript
   // 自动检测并跳过心跳启动
   if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
       return; // 不启动心跳
   }
   ```

2. **添加进程退出时的清理**
   - 监听 SIGTERM、SIGINT 信号
   - 自动清理定时器和连接

3. **错误捕获增强**
   - 所有心跳操作都包含 `.catch()` 错误处理
   - 防止未捕获的 Promise rejection

### 🔧 需要手动配置的优化

#### 1. 更新数据库连接字符串

在 `.env` 文件中，更新 `DATABASE_URL` 添加连接池限制：

```env
# 修改前
DATABASE_URL="mysql://cms:S73wCYE5xn5FKwaN@101.126.137.112:3306/cms"

# 修改后（添加连接池参数）
DATABASE_URL="mysql://cms:S73wCYE5xn5FKwaN@101.126.137.112:3306/cms?connection_limit=10&pool_timeout=20&connect_timeout=10"
```

参数说明：
- `connection_limit=10`: 最大连接数（根据服务器资源调整，建议 5-20）
- `pool_timeout=20`: 连接池超时时间（秒）
- `connect_timeout=10`: 连接超时时间（秒）

#### 2. 配置 Next.js 内存限制（可选）

如果使用 PM2 或直接运行，可以设置 Node.js 内存限制：

```bash
# 使用 PM2
pm2 start npm --name "geocms" -- start --max-memory-restart 500M

# 或在 package.json 中
{
  "scripts": {
    "start": "NODE_OPTIONS='--max-old-space-size=512' next start"
  }
}
```

#### 3. 禁用心跳服务（如果不需要实时验证）

在 `.env` 中添加：
```env
DISABLE_LICENSE_HEARTBEAT=true
```

然后修改 `src/lib/license/index.ts` 的 activate 方法：
```typescript
// 保存到缓存
LicenseCache.save(license);

// 启动心跳（仅在非禁用情况下）
if (process.env.DISABLE_LICENSE_HEARTBEAT !== 'true') {
    this.startHeartbeat(license.licenseId);
}
```

## 监控和诊断

### 查看服务器日志

```bash
# 如果使用 PM2
pm2 logs geocms --lines 100

# 如果使用 systemd
journalctl -u geocms -n 100 -f

# 查看内存使用情况
pm2 monit
# 或
htop
```

### 常见错误信息

1. **"JavaScript heap out of memory"**
   - 原因：内存泄漏
   - 解决：重启服务，并确保心跳服务已禁用

2. **"Too many connections"**
   - 原因：数据库连接池耗尽
   - 解决：按上述方式配置连接池限制

3. **"ECONNREFUSED" 或 "Connection refused"**
   - 原因：数据库连接失败
   - 解决：检查数据库服务状态和网络连接

## 重启服务

```bash
# PM2
pm2 restart geocms

# systemd
sudo systemctl restart geocms

# Docker
docker-compose restart geocms
```

## 性能优化建议

1. **使用缓存**
   - Redis 缓存授权信息（减少数据库查询）
   - 静态资源使用 CDN

2. **数据库优化**
   - 为常用查询添加索引
   - 定期清理日志表

3. **代码优化**
   - 避免在 API 路由中使用重量级操作
   - 使用 Next.js 的 ISR（增量静态再生成）

## 紧急恢复步骤

如果服务器已经崩溃：

```bash
# 1. 停止服务
pm2 stop all
# 或
sudo systemctl stop geocms

# 2. 清理进程（如果有僵尸进程）
pkill -9 node

# 3. 清理 Next.js 缓存
cd /path/to/geocms
rm -rf .next

# 4. 重新构建（如果需要）
npm run build

# 5. 重启服务
pm2 start all
# 或
sudo systemctl start geocms
```

## 联系支持

如果问题持续存在，请提供以下信息：

1. 服务器配置（CPU、内存、操作系统）
2. 完整的错误日志（最近 100 行）
3. 数据库连接信息（隐藏密码）
4. Next.js 版本和 Node.js 版本

---

**最后更新**: 2025-12-28
**优先级**: 🔴 高 - 立即应用数据库连接池配置
