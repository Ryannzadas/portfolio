import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components: dados do GitHub ficam no "static shell" e revalidam via `use cache` + cacheLife.
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Domínios de onde vêm as imagens de preview dos repositórios.
    remotePatterns: [
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "repository-images.githubusercontent.com" },
      { protocol: "https", hostname: "opengraph.githubassets.com" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
