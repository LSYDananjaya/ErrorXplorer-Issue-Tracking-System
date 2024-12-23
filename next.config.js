/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Set the body size limit to 10 MB
    },
  },
};
