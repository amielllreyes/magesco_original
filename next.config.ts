import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  eslint: {
    ignoreDuringBuilds: true,
  },
  

  typescript: {
    ignoreBuildErrors: true,
  },


  reactStrictMode: true,


  images: {
    domains: ['your-image-domain.com'],
  },
  

  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
};

export default nextConfig;