import type { NextConfig } from "next";

// Local harness only: wraps this package in the real shell. Never deployed.
const nextConfig: NextConfig = {
  transpilePackages: [
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
