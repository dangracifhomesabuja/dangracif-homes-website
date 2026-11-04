import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["typeorm", "pg", "bcrypt"],
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/fideliscourts",
        destination: "/fideliscourt",
        permanent: true,
      },
      {
        source: "/fidelis-court",
        destination: "/fideliscourt",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
