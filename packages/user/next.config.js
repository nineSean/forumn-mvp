const NextFederationPlugin = require("@module-federation/nextjs-mf");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@forum/shared"],
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: "user",
        filename: `static/${options.isServer ? "ssr" : "chunks"}/remoteEntry.js`,
        exposes: {
          "./ProfilePage": "./src/components/ProfilePage",
          "./SettingsPage": "./src/components/SettingsPage",
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
