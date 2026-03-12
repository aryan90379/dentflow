import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // increase from default 1mb

    },
    
  },
};

export default nextConfig;