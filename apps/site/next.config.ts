import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

// BASE_PATH is the only value that changes per host: '/MyPortfolio' on the
// GitHub Pages project URL, '' locally or on a custom domain.
const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.BASE_PATH ?? '',
  trailingSlash: true,
  images: { unoptimized: true },
  pageExtensions: ['ts', 'tsx', 'mdx'],
  transpilePackages: ['@cs/tokens'],
};

export default createMDX()(nextConfig);
