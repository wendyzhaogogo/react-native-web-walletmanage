const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname, {
  // 配置 web 平台
  platforms: ['web'],
  // 添加 web 配置
  web: {
  },
  resolver: {
    alias: {
      buffer: require.resolve('buffer'),
    },
  },
});

module.exports = withNativeWind(config, { input: './global.css' }) 