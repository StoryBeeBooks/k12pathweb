/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ["images.unsplash.com"],
  },
  basePath: process.env.NODE_ENV === 'production' ? '/k12pathweb' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/k12pathweb/' : '',
};

export default nextConfig;
