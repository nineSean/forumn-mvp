const NextFederationPlugin = require("@module-federation/nextjs-mf");

const REMOTE_URLS = {
  forum: process.env.NEXT_PUBLIC_FORUM_URL || "http://localhost:3001",
  user: process.env.NEXT_PUBLIC_USER_URL || "http://localhost:3002",
  admin: process.env.NEXT_PUBLIC_ADMIN_URL || "http://localhost:3003",
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config, options) {
    if (!options.isServer) {
      config.plugins.push(
        new NextFederationPlugin({
          name: "shell",
          filename: "static/chunks/remoteEntry.js",
          remotes: {
            forum: `forum@${REMOTE_URLS.forum}/_next/static/${options.isServer ? "ssr" : "chunks"}/remoteEntry.js`,
            user: `user@${REMOTE_URLS.user}/_next/static/${options.isServer ? "ssr" : "chunks"}/remoteEntry.js`,
            admin: `admin@${REMOTE_URLS.admin}/_next/static/${options.isServer ? "ssr" : "chunks"}/remoteEntry.js`,
          },
          shared: {
            react: { singleton: true, requiredVersion: false },
            "react-dom": { singleton: true, requiredVersion: false },
            urql: { singleton: true, requiredVersion: false },
            graphql: { singleton: true, requiredVersion: false },
          },
        })
      );
    }
    return config;
  },
};

module.exports = nextConfig;
