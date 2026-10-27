import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@web/login", "@web/shell", "@web/data", "@web/actions", "@web/ui"],
};

export default nextConfig;
