module.exports = {
  expo: {
    name: 'PAAS - parkovanie v Bratislave',
    slug: 'paas',
    scheme: 'paasmpa',
    version: '1.0.1',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#16254C',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.bratislava.paas',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.bratislava.paas',
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
      'expo-router',
      'expo-localization',
    ],
    owner: 'bratislava',
  },
}
