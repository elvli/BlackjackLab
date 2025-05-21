import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "http://localhost:3000", "http://192.168.1.163:3000", "http://192.168.1.163:5173", 'local-origin.dev', '*.local-origin.dev', 'localhost'
  ],
};

export default nextConfig;
