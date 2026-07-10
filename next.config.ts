import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Fixa a raiz do projeto (há outro lockfile na home do usuário).
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
