import type { NextConfig } from "next";
import path from "path";

const reactDir = path.resolve(__dirname, "node_modules/react");
const reactDomDir = path.resolve(__dirname, "node_modules/react-dom");

const nextConfig: NextConfig = {
  // Webpack (--webpack flag): one react + react-dom from node_modules for the whole app.
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        react: reactDir,
        "react-dom$": reactDomDir,
        "react-dom/client": path.join(reactDomDir, "client.js"),
        "react-dom/server": path.join(reactDomDir, "server.browser.js"),
        "react-dom/server.browser": path.join(reactDomDir, "server.browser.js"),
      };
    }
    return config;
  },
};

export default nextConfig;
