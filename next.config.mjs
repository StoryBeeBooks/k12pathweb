/** @type {import('next').NextConfig} */
const isProd = process.env.GITHUB_ACTIONS === 'true';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ["images.unsplash.com"],
  },
  basePath: isProd ? '/k12pathweb' : '',
  assetPrefix: isProd ? '/k12pathweb/' : '',
};

export default nextConfig;
