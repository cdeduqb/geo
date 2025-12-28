import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',

  // 启用 React Strict Mode 以便更好地检测问题
  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: true,
  },

  // 安全头配置
  async headers() {
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
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
        ],
      },
    ];
  },
};

export default nextConfig;
