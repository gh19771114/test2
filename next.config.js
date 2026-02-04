/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'staticmap.openstreetmap.de',
      },
      {
        protocol: 'https',
        hostname: 'helte.jp',
      },
      {
        protocol: 'https',
        hostname: 'www.helte.jp',
      },
      {
        protocol: 'https',
        hostname: 'www.facebook.com',
      },
      {
        protocol: 'https',
        hostname: 'facebook.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
  // 开启 gzip 压缩
  compress: true,
  // 隐藏 X-Powered-By: Next.js 头
  poweredByHeader: false,
  // React 严格模式
  reactStrictMode: true,
  // Turbopack 配置（空配置以消除警告）
  turbopack: {},
  // Webpack 配置
  webpack: (config, { isServer }) => {
    return config
  },
  // ⚠ 不再自定义 webpack cache，全部交给 Next 自己处理
}

module.exports = nextConfig
