# ⚠️ 授权激活问题诊断和解决方案

**问题**: 激活API返回成功，但前端页面显示未激活

**根本原因**: LicenseCache.save在Next.js API路由中可能存在问题

---

## 🔍 问题诊断

### 测试结果
- ✅ 激活API响应: 成功
- ❌ 缓存文件: 未创建
- ❌ 授权信息API: 返回未激活

### 测试步骤
```bash
# 1. 激活授权
node scripts/manual-activate.js
# 结果: API返回success: true

# 2. 检查缓存
ls .license-cache/
# 结果: 只有timestamp.dat，没有license.enc

# 3. 检查授权信息
curl http://localhost:3000/api/license/info
# 结果: licensed: false
```

---

## ✅ 临时解决方案（推荐）

### 方案1: 使用客户端激活

由于缓存需要在客户端创建，建议使用客户端组件直接调用：

创建一个客户端激活工具页面：
```
http://localhost:3000/admin/license
```

### 方案2: 直接在Prisma Studio检查

1. 打开 http://localhost:5556
2. 查看 License表
3. 找到授权码: `LIC-2024-MJIMR9PA-AVZI7H`
4. 确认status为"active"

---

## 🔧 完整修复方案

### 修复LicenseCache以支持服务端

需要修改 `/src/lib/license/core/cache.ts`:

```typescript
// 添加检查确保在正确的环境中运行
private static getCachePath(): string {
  // 确保使用正确的工作目录
  const baseDir = process.cwd();
  const cacheDir = path.join(baseDir, '.license-cache');
  
  // 确保目录存在
  if (!fs.existsSync(cacheDir)) {
    try {
      fs.mkdirSync(cacheDir, { recursive: true, mode: 0o700 });
    } catch (error) {
      console.error('Failed to create cache directory:', error);
    }
  }
  
  return path.join(cacheDir, this.CACHE_FILE);
}

// 在save方法中添加错误日志
 static save(license: LicenseData, ttl: number = this.DEFAULT_TTL): void {
  try {
    this.ensureCacheDir();
    const cached: CachedLicense = {
      license,
      cachedAt: Date.now(),
      expiresAt: Date.now() + ttl,
      lastVerifiedAt: Date.now()
    };

    const encrypted = AESCrypto.encryptLicenseCache(cached);
    const cachePath = this.getCachePath();
    
    console.log('[LicenseCache] Saving to:', cachePath); // 添加日志
    fs.writeFileSync(cachePath, encrypted, { mode: 0o600 });
    console.log('[LicenseCache] Saved successfully'); // 添加日志
  } catch (error) {
    console.error('[LicenseCache] Save failed:', error); // 添加日志
    throw new Error('Failed to save license cache');
  }
}
```

---

## 🎯 当前可用的测试授权

### 授权码
```
LIC-2024-MJIMR9PA-AVZI7H
```

### 授权详情
- 套餐: PRO
- 有效期: 2026-12-23
- 域名: localhost, *.geocms.com
- 功能: AI, SEO, GEO, 100页面

### 验证授权是否存在
```bash
# 方法1: Prisma Studio
打开 http://localhost:5556
→ License表
→ 找到 LIC-2024-MJIMR9PA-AVZI7H

# 方法2: 数据库查询
node -e "
const { PrismaClient } = require('@prisma/client-license');
const db = new PrismaClient();
db.license.findUnique({
where: { licenseCode: 'LIC-2024-MJIMR9PA-AVZI7H' }
}).then(l => console.log(l ? '✅ 授权存在' : '❌ 授权不存在'))
.finally(() => db.\$disconnect());
"
```

---

## 💡 推荐的工作流程（避免问题）

### 管理员侧
```
1. 创建客户 (可视化界面) ✅
   http://localhost:3000/license-admin/customers

2. 生成授权 (可视化界面) ✅
   http://localhost:3000/license-admin/generate

3. 复制授权码发给客户 ✅
```

### 客户侧（可能需要手动验证）
```
1. 收到授权码

2. 在Prisma Studio验证授权存在 ✅
   http://localhost:5556 → License表

3. 如果激活页面不工作，直接查看数据库确认

4. 或等待缓存修复后再激活
```

---

## 🔄 替代方案：不使用本地缓存

如果缓存问题难以解决，可以改为每次都查询数据库：

修改 `/api/license/info/route.ts`:
```typescript
// 不使用缓存，直接从数据库查询
export async function GET() {
  try {
    // 通过硬件指纹查询激活的实例
    const fingerprint = await FingerprintGenerator.generate();
    const instance = await licenseDb.licenseInstance.findUnique({
      where: { fingerprint },
      include: { license: true }
    });

    if (!instance || !instance.license) {
      return NextResponse.json({ licensed: false });
    }

    return NextResponse.json({
      licensed: true,
      license: {
        // 返回授权信息
      }
    });
  } catch (error) {
    return NextResponse.json({ licensed: false });
  }
}
```

这样就不依赖文件缓存了。

---

## 📊 当前状态

| 组件 | 状态 |
|------|------|
| 客户管理 | ✅ 正常 |
| 授权生成 | ✅ 正常 |
| 授权数据库 | ✅ 有数据 |
| 激活API | ✅ 返回成功 |
| 缓存保存 | ❌ 不工作 |
| 信息API | ❌ 读不到缓存 |

---

## 🎯 建议

### 短期方案
1. 管理员在Prisma Studio查看授权数据
2. 确认授权已创建且status为active
3. 客户知道有授权即可

### 长期方案
1. 修复LicenseCache的服务端支持
2. 或改用数据库查询代替缓存
3. 重新测试激活流程

---

**下一步**: 修复缓存系统或改用数据库查询方案

**临时方案**: 直接在Prisma Studio确认授权状态
