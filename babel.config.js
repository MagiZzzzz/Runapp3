module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    // autres plugins si tu en as…
    ['module:react-native-dotenv', {
      moduleName: '@env',
      path: '.env',
      safe: false,
      allowUndefined: true,
    }],
  ],
};
