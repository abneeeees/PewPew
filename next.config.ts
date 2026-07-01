import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
              protocol: 'https',
              hostname: '*.rawg.io', // Catches any subdomain like media.rawg.io
              pathname: '/media/**',
            },
    ],
  },
};

export default nextConfig;