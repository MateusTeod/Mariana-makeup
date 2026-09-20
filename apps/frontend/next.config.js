/** @type {import('next').NextConfig} */
const backendUrl = (process.env.BACKEND_URL || 'http://localhost:3001').replace(/\/$/, '');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
