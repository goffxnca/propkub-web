/** @type {import('next').NextConfig} */
const { version } = require("./package.json");

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "tailwindui.com",
      "images.unsplash.com",
    ],
  },
  publicRuntimeConfig: {
    version: version,
  },
};

module.exports = nextConfig;

// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//   enabled: process.env.ANALYZE === "true",
// });

// module.exports = withBundleAnalyzer({});
