import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dborozfgg/**', // This matches your specific cloud name!
      },
    ],
  },
};

export default nextConfig;
