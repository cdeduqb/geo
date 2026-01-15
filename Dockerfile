FROM docker.m.daocloud.io/library/node:20-alpine AS base

# 安装系统级依赖
RUN apk add --no-cache openssl libc6-compat

# 安装依赖阶段
FROM base AS deps
WORKDIR /app

# 复制package和schema文件
COPY package*.json ./
COPY prisma ./prisma

# 设置环境变量：跳过 Puppeteer 默认的浏览器下载 (这是卡住的主因)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# 配置阿里镜像源并安装
RUN npm config set registry https://registry.npmmirror.com && \
    npm install --production=false

# 生成Prisma Client
RUN npx prisma generate && \
    npx prisma generate --schema=prisma/schema.license.prisma

# 构建阶段
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 生产运行阶段
FROM base AS runner
WORKDIR /app

# 安装必要的运行时依赖：轻量级 Chromium 和中文字体 (用于生成图片或爬虫)
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    wqy-zenhei

ENV NODE_ENV production
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
# 复制授权密钥 (如果存在)
COPY --from=builder --chown=nextjs:nodejs /app/.keys* /app/.keys/

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
