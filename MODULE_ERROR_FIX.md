# 🔧 模块加载错误 - 快速修复

**错误**: Module was instantiated but factory is not available

**原因**: Next.js热重载问题，添加新组件后需要重启开发服务器

---

## ✅ 解决方案

### 重启开发服务器

1. **停止当前服务器**:
   - 在运行 `npm run dev` 的终端
   - 按 `Ctrl + C`

2. **重新启动**:
   ```bash
   npm run dev
   ```

3. **等待编译完成**:
   - 看到 "Ready in xxx ms"
   - 访问 http://localhost:3000

---

## 📝 添加的新文件

刚才添加了以下文件，需要重启才能加载：

1. **src/components/license/LicenseFooter.tsx**
   - 授权底部组件
   - 版权保护逻辑

2. **修改 src/app/layout.tsx**
   - 导入 LicenseFooter
   - 添加到 body 底部

---

## 🎯 重启后应该看到

### 访问任意页面

```
http://localhost:3000
http://localhost:3000/about
http://localhost:3000/admin
```

### 底部应该显示

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ ⚠️ 未授权使用 | 本站使用 GeoCMS 企业授权系统  ┃
┃         [🛡️ 立即激活授权] [购买授权]         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
```

红色渐变背景，固定在底部

---

## 💡 如果问题仍存在

### 清除缓存并重启

```bash
# 1. 停止服务器 (Ctrl+C)

# 2. 删除 .next 目录
rm -rf .next

# 3. 重新启动
npm run dev
```

---

## ✅ 验证修复

重启后：

1. **访问首页**: http://localhost:3000
   - 应该看到底部红色版权提示

2. **访问授权页**: http://localhost:3000/admin/license
   - 应该看到未激活状态

3. **点击底部按钮**: "立即激活授权"
   - 应该跳转到授权页面

---

**解决方法**: 重启开发服务器  
**预期结果**: 底部显示版权提示条

重启后应该就正常了！🚀
