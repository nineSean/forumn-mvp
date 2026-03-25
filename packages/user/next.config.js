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
          "./ProfilePage": "./src/components/FederatedProfilePage",
          "./SettingsPage": "./src/components/FederatedSettingsPage",
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
