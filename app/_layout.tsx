import 'utils/amplify'
import '../i18n.config.js'
import 'intl-pluralrules'

import Mapbox from '@rnmapbox/maps'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { environment } from '@/environment'

SplashScreen.preventAutoHideAsync()

const RootLayout = () => {
  const [mapboxLoaded, setMapboxLoaded] = useState(false)
  const [mapboxError, setMapboxError] = useState<Error | null>(null)

  // temp - replace with font we actually want to use
  const [fontsLoaded] = useFonts({
    // eslint-disable-next-line unicorn/prefer-module,global-require
    BelfastGrotesk_Black: require('@/assets/fonts/Belfast-Grotesk-Black.otf'),
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
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen
          name="vehicles/add-vehicle"
          options={{
            // Set the presentation mode to modal for our modal route.
            presentation: 'modal',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  )
}

export default RootLayout
