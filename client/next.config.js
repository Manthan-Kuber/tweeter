/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  images: {
    domains: ['cloudflare-ipfs.com','loremflickr.com'],
  },
};

module.exports = nextConfig;
