import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
      "@/components": path.resolve(__dirname, "src/components"),
      "@/sections": path.resolve(__dirname, "src/sections"),
      "@/app": path.resolve(__dirname, "src/app"),
      "@/config": path.resolve(__dirname, "src/config"),
    };
    return config;
  },
};

export default nextConfig;
