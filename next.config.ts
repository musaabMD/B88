import type { NextConfig } from "next";

const CONVEX_URL =
  process.env.NEXT_PUBLIC_CONVEX_URL ??
  "https://decisive-goldfinch-992.convex.cloud";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_CONVEX_URL: CONVEX_URL,
  },
};

export default nextConfig;
