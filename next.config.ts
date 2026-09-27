import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  // Note: if you are using a 'src' directory, this should be "src/sw.ts" instead.
  swSrc: "app/sw.ts", 
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development", // Crucial: Disables PWA in dev mode
  cacheOnNavigation: true,
});


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

export default withSerwist(nextConfig);
