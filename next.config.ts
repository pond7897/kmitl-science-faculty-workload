import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n/request.ts');

const nextConfig: NextConfig = {
  /* config options here */
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
  }
};

export default withNextIntl(nextConfig);
