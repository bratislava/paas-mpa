import 'intl-pluralrules'
import '@/modules/cognito/amplify'
import '../i18n.config.js'

/* eslint-disable babel/camelcase */
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter'
import { PortalProvider } from '@gorhom/portal'
/* eslint-enable babel/camelcase */
import Mapbox from '@rnmapbox/maps'
import { SplashScreen, Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { NativeModules } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { environment } from '@/environment'
import GlobalStoreProvider from '@/state/GlobalStoreProvider'
import colors from '@/tailwind.config.colors'

SplashScreen.preventAutoHideAsync()

const { UIManager } = NativeModules

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
if (UIManager.setLayoutAnimationEnabledExperimental)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  UIManager.setLayoutAnimationEnabledExperimental(true)

const RootLayout = () => {
  const [mapboxLoaded, setMapboxLoaded] = useState(false)
  const [mapboxError, setMapboxError] = useState<Error | null>(null)

  // temp - replace with font we actually want to use
  const [fontsLoaded] = useFonts({
    /* eslint-disable unicorn/prefer-module,global-require */
    BelfastGrotesk_700Bold: require('@/assets/fonts/Belfast-Grotesk-Bold.otf'),
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    /* eslint-enable unicorn/prefer-module,global-require */
  })

  useEffect(() => {
    Mapbox.setAccessToken(environment.mapboxPublicKey)
      .finally(() => setMapboxLoaded(true))
      .catch((error) =>
        setMapboxError(error instanceof Error ? error : new Error('Unknown error - init mapbox')),
      )
  }, [])

  useEffect(() => {
    if (fontsLoaded) {
      // Hide the splash screen after the fonts have loaded and the UI is ready.
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  // Prevent rendering until the font has loaded and mapbox has loaded
  if (!fontsLoaded || !mapboxLoaded) {
    return null
  }

  // let error boundary handle this
  if (mapboxError) {
    throw mapboxError
  }

  // Render the children routes now that all the assets are loaded.
  return (
    <GlobalStoreProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView className="flex-1">
          <PortalProvider>
            <Stack
              screenOptions={{
                headerBackTitleVisible: false,
                headerTitleStyle: {
                  fontFamily: 'BelfastGrotesk_700Bold',
                },
                headerTintColor: colors.dark.DEFAULT,
              }}
            >
              <Stack.Screen name="vehicles/add-vehicle" options={{ presentation: 'modal' }} />
              <Stack.Screen name="purchase/choose-vehicle" options={{ presentation: 'modal' }} />
              <Stack.Screen
                name="purchase/choose-payment-method"
                options={{ presentation: 'modal' }}
              />
              <Stack.Screen name="purchase/custom-time" options={{ presentation: 'modal' }} />
            </Stack>
          </PortalProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </GlobalStoreProvider>
  )
}

export default RootLayout
