import 'utils/amplify'

// eslint-disable-next-line babel/camelcase
import { Inter_500Medium, useFonts } from '@expo-google-fonts/inter'
import { createTheme, ThemeProvider } from '@rneui/themed'
import Mapbox from '@rnmapbox/maps'
import { SplashScreen, Stack } from 'expo-router'
import { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { environment } from '../environment'

SplashScreen.preventAutoHideAsync()

const RootLayout = () => {
  const [mapboxLoaded, setMapboxLoaded] = useState(false)
  const [mapboxError, setMapboxError] = useState<Error | null>(null)

  // temp - replace with font we actually want to use
  const [fontsLoaded] = useFonts({
    Inter_500Medium,
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
      // Hide the splash screen after the fonts have loaded and the
      // UI is ready.
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  // Prevent rendering until the font has loaded
  if (!fontsLoaded || !mapboxLoaded) {
    return null
  }

  // let error boundary handle this
  if (mapboxError) throw mapboxError

  // TODO place elsewhere
  const theme = createTheme({
    mode: 'light',
  })

  // Render the children routes now that all the assets are loaded.
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <Stack />
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

export default RootLayout
