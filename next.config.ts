import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['posted-stands-roads-football.trycloudflare.com'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/photos/**",
      },
    ]
  }
};

export default nextConfig;
