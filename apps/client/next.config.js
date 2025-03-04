/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export
  trailingSlash: true, // Recommended for static exports
  images: {
    unoptimized: true // Important for static export
  },
  experimental: {
    outputFileTracingRoot: __dirname
  }
}

module.exports = nextConfig