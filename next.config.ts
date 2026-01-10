import type { NextConfig } from "next";

// 从环境变量获取站点 URL
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const nextConfig: NextConfig = {
  output: 'standalone',

  // 启用 React Strict Mode 以便更好地检测问题
  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: true,
  },

  // 安全头配置
  async headers() {
    const isDevelopment = process.env.NODE_ENV === 'development';

    // 🔒 CSP 配置 - 防止注入攻击
    const ContentSecurityPolicy = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' blob:;
      worker-src 'self' blob:;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: https: blob:;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self' https://api.openai.com https://generativelanguage.googleapis.com;
      frame-ancestors 'self';
      base-uri 'self';
      form-action 'self';
    `.replace(/\s{2,}/g, ' ').trim();

    // 从环境变量获取允许的域名，默认只允许当前域名
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
      : [process.env.NEXT_PUBLIC_SITE_URL || '*'];

    return [
      {
        // 为所有 API 路由配置 CORS
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            // 生产环境应该使用具体域名，不要使用 *
            value: allowedOrigins[0] || '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,PUT,DELETE,OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization, X-Requested-With'
          },
          {
            key: 'Access-Control-Max-Age',
            value: '86400' // 24 hours
          },
          // 安全头
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
        ],
      },
      {
        // 为所有路由添加安全头
        source: '/:path*',
        headers: [
          // 🔒 CSP - 防止注入攻击
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy,
          },
          // 🔒 HSTS - 强制 HTTPS（生产环境）
          ...(isDevelopment ? [] : [{
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          }]),
          // 🔒 防止点击劫持
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // 🔒 防止 MIME 类型嗅探
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // 🔒 XSS 防护
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // 🔒 Referrer 策略
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // 🔒 权限策略（禁用摄像头、麦克风等）
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  // 🔒 禁用 X-Powered-By 头（隐藏技术栈）
  poweredByHeader: false,

  // 禁用开发模式下的状态指示器
  devIndicators: false,
  serverExternalPackages: ['@prisma/client', 'ali-oss', 'cos-nodejs-sdk-v5'],
  experimental: {
    serverActions: {
      allowedOrigins: (() => {
        // 优先级 1: 从环境变量 ALLOWED_ORIGINS 读取
        if (process.env.ALLOWED_ORIGINS) {
          return process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
        }

        // 优先级 2: 从 NEXT_PUBLIC_SITE_URL 自动提取域名
        const origins: string[] = ['localhost:3000', 'localhost'];
        if (SITE_URL && SITE_URL !== 'http://localhost:3000') {
          try {
            const url = new URL(SITE_URL);
            origins.push(url.host);
            origins.push(url.hostname);
            // 自动添加不带 www 的版本
            if (url.hostname.startsWith('www.')) {
              origins.push(url.hostname.slice(4));
            }
          } catch (e) {
            origins.push(SITE_URL.replace(/^https?:\/\//, ''));
          }
        }

        return origins.filter(Boolean);
      })(),
    },
  },
};

export default nextConfig;
