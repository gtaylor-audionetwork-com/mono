import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@web/support", "@web/shell", "@web/data", "@web/actions", "@web/ui"],
};

export default nextConfig;
