import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    // msw/browser no se puede resolver en Node: en el servidor se usa un sustituto vacío.
    resolveAlias: {
      "@/mocks/browser": { browser: "./mocks/browser.ts", default: "./mocks/sin-worker.ts" },
    },
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
