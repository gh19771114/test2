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
    ],
  },
  // 开启 gzip 压缩
  compress: true,
  // 隐藏 X-Powered-By: Next.js 头
  poweredByHeader: false,
  // React 严格模式
  reactStrictMode: true,
  // 实验性功能：明确禁用 turbo 以解决路径编码问题
  experimental: {
    // 完全禁用 Turbopack
    turbo: false,
  },
  // 强制使用 webpack 而不是 Turbopack
  webpack: (config, { isServer }) => {
    return config
  },
  // ⚠ 不再自定义 webpack cache，全部交给 Next 自己处理
}

module.exports = nextConfig
