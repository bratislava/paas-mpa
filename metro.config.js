// Learn more https://docs.expo.io/guides/customizing-metro
const { withNativeWind } = require('nativewind/metro')
const { getSentryExpoConfig } = require('@sentry/react-native/metro')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getSentryExpoConfig(__dirname)

/* Setup for react-native-svg-transformer https://github.com/kristerkari/react-native-svg-transformer#step-3-configure-the-react-native-packager */
const { transformer, resolver } = config

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
}
config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...resolver.sourceExts, 'svg'],
}
/* end of setup react-native-svg-transformer */

module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 })
