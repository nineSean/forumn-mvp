const NextFederationPlugin = require("@module-federation/nextjs-mf");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config, options) {
    if (!options.isServer) {
      config.plugins.push(
        new NextFederationPlugin({
          name: "user",
          filename: "static/chunks/remoteEntry.js",
          exposes: {
            "./ProfilePage": "./src/components/ProfilePage",
            "./SettingsPage": "./src/components/SettingsPage",
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
