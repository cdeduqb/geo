# 🔧 解决 "npm: command not found" 错误

**问题**: `-bash: npm: command not found`  
**原因**: Node.js/npm未安装或环境变量未配置

---

## 🎯 解决方案

### 方法1: 宝塔面板安装（推荐）

#### 步骤1: 安装Node版本管理器
```
1. 登录宝塔面板
2. 点击左侧 "软件商店"
3. 搜索 "Node"
4. 找到 "Node版本管理器" 或 "Node.js版本管理"
5. 点击 "安装"
```

#### 步骤2: 安装Node.js
```
1. 软件商店 → 已安装
2. 找到 "Node版本管理器"
3. 点击 "设置"
4. 安装 Node.js 20.x 版本
5. 等待安装完成（约5分钟）
```

#### 步骤3: 配置环境变量
```bash
# 通过SSH连接服务器后执行
echo 'export PATH=$PATH:/www/server/nodejs/v20/bin' >> ~/.bashrc
source ~/.bashrc

# 验证安装
node -v
npm -v
```

---

### 方法2: 手动安装（SSH命令行）

#### 选项A: 使用NVM（推荐）

```bash
# 1. 下载并安装NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 2. 重新加载shell配置
source ~/.bashrc
# 或
source ~/.bash_profile

# 3. 验证NVM安装
nvm --version

# 4. 安装Node.js 20
nvm install 20

# 5. 设置默认版本
nvm use 20
nvm alias default 20

# 6. 验证
node -v
npm -v
```

**如果curl下载失败，使用国内镜像**:
```bash
# 设置NVM镜像
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node

# 然后再安装
nvm install 20
```

#### 选项B: 直接安装Node.js

**CentOS/RHEL系统**:
```bash
# 1. 添加Node.js 20源
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -

# 2. 安装Node.js
sudo yum install -y nodejs

# 3. 验证
node -v
npm -v
```

**Ubuntu/Debian系统**:
```bash
# 1. 添加Node.js 20源
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# 2. 安装Node.js
sudo apt-get install -y nodejs

# 3. 验证
node -v
npm -v
```

**如果遇到网络问题，使用二进制包**:
```bash
# 1. 下载Node.js二进制包
cd /opt
wget https://npmmirror.com/mirrors/node/v20.11.0/node-v20.11.0-linux-x64.tar.xz

# 2. 解压
tar -xvf node-v20.11.0-linux-x64.tar.xz

# 3. 创建软链接
ln -s /opt/node-v20.11.0-linux-x64/bin/node /usr/local/bin/node
ln -s /opt/node-v20.11.0-linux-x64/bin/npm /usr/local/bin/npm
ln -s /opt/node-v20.11.0-linux-x64/bin/npx /usr/local/bin/npx

# 4. 验证
node -v
npm -v
```

---

## ✅ 验证安装

安装完成后，执行以下命令验证：

```bash
# 检查Node.js版本
node -v
# 应该显示: v20.x.x

# 检查npm版本
npm -v
# 应该显示: 10.x.x

# 检查npx
npx -v
# 应该显示: 10.x.x

# 查看Node.js安装路径
which node
which npm
```

---

## 🔍 常见问题排查

### 问题1: 安装后仍提示找不到命令

**原因**: 环境变量未生效

**解决**:
```bash
# 刷新环境变量
source ~/.bashrc

# 或退出SSH重新登录
exit
# 然后重新SSH连接

# 如果还不行，手动添加到PATH
export PATH=$PATH:/www/server/nodejs/v20/bin
# 或
export PATH=$PATH:/opt/node-v20.11.0-linux-x64/bin
```

### 问题2: 不同用户下找不到npm

**原因**: 环境变量只对当前用户生效

**解决**:
```bash
# 为所有用户配置
sudo ln -s /www/server/nodejs/v20/bin/node /usr/bin/node
sudo ln -s /www/server/nodejs/v20/bin/npm /usr/bin/npm
sudo ln -s /www/server/nodejs/v20/bin/npx /usr/bin/npx
```

### 问题3: 权限问题

**现象**: `permission denied`

**解决**:
```bash
# 修改npm全局目录权限
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

---

## 🚀 安装完成后继续部署

环境配置好后，继续执行部署步骤：

```bash
# 1. 进入项目目录
cd /www/wwwroot/geocms

# 2. 配置npm镜像（加速下载）
npm config set registry https://registry.npmmirror.com

# 3. 安装依赖
npm install

# 4. 如果提示权限问题
sudo npm install --unsafe-perm

# 5. 验证依赖安装
ls node_modules  # 应该有很多文件夹
```

---

## 💡 推荐配置

### 1. 配置npm国内镜像（加速）

```bash
# 淘宝镜像
npm config set registry https://registry.npmmirror.com

# 验证
npm config get registry

# 还原官方源（如果需要）
npm config set registry https://registry.npmjs.org
```

### 2. 安装pnpm（可选，更快）

```bash
npm install -g pnpm

# 配置镜像
pnpm config set registry https://registry.npmmirror.com

# 使用pnpm安装依赖（比npm快）
pnpm install
```

### 3. 安装PM2进程管理器

```bash
npm install -g pm2

# 验证
pm2 -v
```

---

## 📋 完整检查清单

安装Node.js后的检查：

- [ ] `node -v` 显示版本号（v20.x.x）
- [ ] `npm -v` 显示版本号（10.x.x）
- [ ] `npx -v` 显示版本号
- [ ] `npm config get registry` 已配置镜像
- [ ] `pm2 -v` 已安装PM2

全部通过后，可以继续执行：
```bash
cd /www/wwwroot/geocms
npm install
```

---

## 🆘 仍然无法解决？

### 方法1: 使用宝塔SSH终端

1. 宝塔面板 → 终端
2. 直接在宝塔终端执行命令
3. 宝塔终端会自动加载环境变量

### 方法2: 手动指定完整路径

```bash
# 如果npm在 /www/server/nodejs/v20/bin/npm
/www/server/nodejs/v20/bin/npm install

# 或创建别名
alias npm='/www/server/nodejs/v20/bin/npm'
alias node='/www/server/nodejs/v20/bin/node'
```

### 方法3: 重启服务器

```bash
# 有时重启后环境变量才会生效
sudo reboot
```

---

## 📞 需要帮助

**提供以下信息可以更好诊断**：

```bash
# 执行这些命令并提供输出
echo $PATH
ls -la /www/server/nodejs/
cat ~/.bashrc | grep -i node
which node
which npm
```

---

**解决npm找不到的问题后，继续查看**:  
→ `DEPLOYMENT_BAOTA.md` 完成部署

**推荐**: 使用宝塔面板的Node版本管理器，最简单可靠！
