const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add polyfills for Node.js modules in React Native
config.resolver.alias = {
  ...config.resolver.alias,
  crypto: 'crypto-browserify',
  stream: 'stream-browserify',
  buffer: 'buffer',
};

// Ensure these modules are included in the bundle
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;