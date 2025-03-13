/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Required for AWS Amplify Gen 2
  output: 'standalone',
  // Ensure compatibility with Amplify's routing
  trailingSlash: false,
  // Optimize image handling
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    domains: [
      `${process.env.AMPLIFY_STORAGE_BUCKET_NAME}.s3.amazonaws.com`,
      `${process.env.AMPLIFY_STORAGE_BUCKET_NAME}.s3.${process.env.AMPLIFY_REGION || 'us-east-1'}.amazonaws.com`,
    ],
  },
};

module.exports = nextConfig;
