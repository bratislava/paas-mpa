import Mapbox from '@rnmapbox/maps'
import { Redirect, SplashScreen, Stack } from 'expo-router'
import { NativeWindStyleSheet } from 'nativewind'
import { useEffect, useState } from 'react'
import { NativeModules } from 'react-native'

import { environment } from '@/environment'
import { useGlobalStoreContext } from '@/state/GlobalStoreProvider/useGlobalStoreContext'
import MapZonesProvider from '@/state/MapZonesProvider/MapZonesProvider'
import PurchaseStoreProvider from '@/state/PurchaseStoreProvider/PurchaseStoreProvider'
import colors from '@/tailwind.config.colors'

SplashScreen.preventAutoHideAsync()

/* Quickfix - https://github.com/marklawlor/nativewind/issues/308
   see "Base scaling has changed" and "rem Units" sections */
NativeWindStyleSheet.setVariables({ '--rem': 16 })

const { UIManager } = NativeModules

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
if (UIManager.setLayoutAnimationEnabledExperimental)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  UIManager.setLayoutAnimationEnabledExperimental(true)

const RootLayout = () => {
  const [mapboxLoaded, setMapboxLoaded] = useState(false)
  const [mapboxError, setMapboxError] = useState<Error | null>(null)
  const { user } = useGlobalStoreContext()

  useEffect(() => {
    Mapbox.setAccessToken(environment.mapboxPublicKey)
      .finally(() => setMapboxLoaded(true))
      .catch((error) =>
        setMapboxError(error instanceof Error ? error : new Error('Unknown error - init mapbox')),
      )
  }, [])

  // Prevent rendering until the font has loaded and mapbox has loaded
  if (!mapboxLoaded) {
    return null
  }

  // let error boundary handle this
  if (mapboxError) {
    throw mapboxError
  }

  if (!user) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />
  }

  // Render the children routes now that all the assets are loaded.
  return (
    <MapZonesProvider>
      <PurchaseStoreProvider>
        <Stack
          screenOptions={{
            headerBackTitleVisible: false,
            headerTitleStyle: {
              fontFamily: 'BelfastGrotesk_700Bold',
            },
            headerTintColor: colors.dark.DEFAULT,
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />

          <Stack.Screen name="vehicles/add-vehicle" options={{ presentation: 'modal' }} />
          <Stack.Screen
            name="(purchase-and-payment)/purchase/choose-vehicle"
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen
            name="(purchase-and-payment)/purchase/choose-payment-method"
            options={{ presentation: 'modal' }}
          />
        </Stack>
      </PurchaseStoreProvider>
    </MapZonesProvider>
  )
}

export default RootLayout
