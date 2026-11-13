import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Docker için küçük, bağımsız çalışır çıktı üretir (node_modules'ı kopyalamaya gerek kalmaz)
  output: "standalone",
};

export default nextConfig;
