import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@web/work-with-us", "@web/shell", "@web/data", "@web/actions", "@web/ui"],
};

export default nextConfig;
