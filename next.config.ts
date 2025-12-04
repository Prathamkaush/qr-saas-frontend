import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // 🔥 FIX: Point to your LIVE Render Backend
        destination: 'https://qr-saas-backend-wew1.onrender.com/api/:path*', 
      },
    ]
  },
};

export default nextConfig;