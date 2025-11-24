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
  // 优化性能
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // 优化编译
  swcMinify: true,
}

module.exports = nextConfig
