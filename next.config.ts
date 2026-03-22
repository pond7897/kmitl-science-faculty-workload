import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "iam.science.kmitl.ac.th",
        pathname: "/_app/immutable/assets/**",
      },
      {
        protocol: "https",
        hostname: "www.eng.kmitl.ac.th",
        pathname: "/storage/2024/06/About-4-B.png",
      }
    ]
  },
  allowedDevOrigins: [
    "9pm.website",
    "*.9pm.website",
    "local-origin.dev",
    "*.local-origin.dev",
  ]
};

export default nextConfig;
