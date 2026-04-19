import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['26.170.20.37'],
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001", //backend 
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;
