module.exports = {
  expo: {
    name: 'PAAS',
    slug: 'paas',
    scheme: 'paasmpa',
    version: '1.0.5',
    orientation: 'portrait',
    icon: './assets/app/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/app/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#16254C',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.bratislava.paas',
      googleServicesFile: './GoogleService-Info.plist',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/app/adaptive-icon.png',
        backgroundColor: '#16254C',
        // We can safely use the same image as monochrome image
        monochromeImage: './assets/app/adaptive-icon.png',
      },
      package: 'com.bratislava.paas',
      googleServicesFile: './google-services.json',
    },
    experiments: {
      tsconfigPaths: true,
    },
    extra: {
      eas: {
        projectId: '304d6880-d62e-46fb-b420-f95a623c571e',
      },
    },
    plugins: [
      '@react-native-firebase/app',
      [
        '@rnmapbox/maps',
        {
          RNMapboxMapsImpl: 'mapbox',
          RNMapboxMapsDownloadToken: process.env.MAPBOX_SECRET_TOKEN,
        },
      ],
      [
        'expo-location',
        {
          locationWhenInUsePermission: 'Show current location on map.',
        },
      ],
      ['./plugins/firebase.plugin.cjs', 'custom'],
      'expo-router',
      'expo-localization',
    ],
    owner: 'bratislava',
  },
}
