import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/rochetta",
  images: { unoptimized: true },
};

export default nextConfig;
