import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export", // hasil build statis di folder /out
  trailingSlash: true, // /id/ → out/id/index.html (aman untuk hosting statis apa pun)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
};

export default withNextIntl(nextConfig);