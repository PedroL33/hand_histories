module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = 'electron-renderer';
    }

    return config;
  },
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true
  },
  experimental: {
    externalDir: true,
  },
};
