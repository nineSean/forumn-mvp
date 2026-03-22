const NextFederationPlugin = require("@module-federation/nextjs-mf");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@forum/shared"],
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: "forum",
        filename: `static/${options.isServer ? "ssr" : "chunks"}/remoteEntry.js`,
        exposes: {
          "./ForumPage": "./src/components/ForumPage",
          "./PostDetailPage": "./src/components/PostDetailPage",
          "./CreatePostPage": "./src/components/CreatePostPage",
        },
        shared: {
          urql: { singleton: true, requiredVersion: false },
          graphql: { singleton: true, requiredVersion: false },
        },
      })
    );
    return config;
  },
};

module.exports = nextConfig;
