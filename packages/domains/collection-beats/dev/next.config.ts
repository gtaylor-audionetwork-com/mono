import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@web/collection-beats", "@web/shell", "@web/data", "@web/api-music", "@web/ui"],
};

export default nextConfig;
