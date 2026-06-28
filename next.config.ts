import type { NextConfig } from "next";


const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: `/**`
      //  pathname: `/${cloudName}/**`, // This matches your specific cloud name!
      },
    ],
  },
};

export default nextConfig;
