import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@web/album",
    "@web/home",
    "@web/projects",
    "@web/shell",
    "@web/actions",
    "@web/data",
    "@web/api-download",
    "@web/api-music",
    "@web/track-list",
    "@web/ui",
  ],
};

export default nextConfig;
