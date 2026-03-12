import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // load from stripe
  images: {
    domains: ["files.stripe.com"],
  },
};

export default nextConfig;
