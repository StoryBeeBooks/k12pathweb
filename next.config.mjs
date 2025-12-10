/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ["images.unsplash.com"],
  },
  basePath: '/k12pathweb',
  assetPrefix: '/k12pathweb/',
};

export default nextConfig;
