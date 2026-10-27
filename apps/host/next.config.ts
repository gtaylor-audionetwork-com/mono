import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@web/album",
    "@web/collection-beats",
    "@web/home",
    "@web/login",
    "@web/projects",
    "@web/support",
    "@web/work-with-us",
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
