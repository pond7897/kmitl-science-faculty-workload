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
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.better-auth.com",
        pathname: "/**",
      },
    ],
  },
  allowedDevOrigins: [
    "http://9pm.website",
    "https://9pm.website",
    "http://*.9pm.website",
    "https://*.9pm.website",
    "http://local-origin.dev",
    "https://local-origin.dev",
    "http://*.local-origin.dev",
    "https://*.local-origin.dev",
  ],
};

export default nextConfig;
