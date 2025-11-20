module.exports = {
  expo: {
    name: 'PAAS',
    slug: 'paas',
    scheme: 'paasmpa',
    version: '1.8.3',
    orientation: 'portrait',
    icon: './assets/app/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/app/icon.png',
      backgroundColor: '#16254C',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.bratislava.paas',
      googleServicesFile: './GoogleService-Info.plist',
      entitlements: {
        'aps-environment': 'production',
      },
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        LSApplicationQueriesSchemes: ['itms-apps'],
      },
    },
    android: {
      androidXOptions: {
        useAndroidX: true,
        enableJetifier: true,
      },
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
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
            buildReactNativeFromSource: true,
          },
        },
      ],
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
          locationWhenInUsePermission: 'Show current location on map to find your parking zone.',
        },
      ],
      [
        'expo-updates',
        {
          username: 'bratislava',
        },
      ],
      ['./plugins/liveActivities.plugin.cjs', 'custom'],
      ['./plugins/withBloomreach.plugin.cjs'],
      'expo-router',
      'expo-localization',
      'expo-font',
      'expo-secure-store',
      [
        '@bacons/apple-targets',
        {
          appleTeamId: '2P6QC78LFR',
        },
      ],
      [
        '@sentry/react-native/expo',
        {
          organization: 'bratislava-city-hall',
          project: 'paas-mpa',
          url: 'https://sentry.io/',
        },
      ],
    ],
    owner: 'bratislava',
    updates: {
      url: 'https://u.expo.dev/304d6880-d62e-46fb-b420-f95a623c571e',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
  },
}
