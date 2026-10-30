import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['posted-stands-roads-football.trycloudflare.com'],
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    minimumCacheTTL: 60 * 60 * 24 * 1,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: `/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/**`,
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: `/10.x/notionists/svg`,
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        port: '',
        pathname: '/a/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/photos/**',
      },
    ],
  },
};

export default nextConfig;
