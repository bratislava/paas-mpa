// Route layout is based on documentation in expo-router:
// https://docs.expo.dev/router/reference/authentication/

import Mapbox from '@rnmapbox/maps'
import { Redirect, Stack } from 'expo-router'
import { useEffect, useState } from 'react'

import { environment } from '@/environment'
import { useAuthStoreContext } from '@/state/AuthStoreProvider/useAuthStoreContext'
import MapZonesProvider from '@/state/MapZonesProvider/MapZonesProvider'
import PurchaseStoreProvider from '@/state/PurchaseStoreProvider/PurchaseStoreProvider'
import TicketsFiltersStoreProvider from '@/state/TicketsFiltersStoreProvider/TicketsFiltersStoreProvider'
import VehiclesStoreProvider from '@/state/VehiclesStoreProvider/VehiclesStoreProvider'
import colors from '@/tailwind.config.colors'

const RootLayout = () => {
  const [mapboxLoaded, setMapboxLoaded] = useState(false)
  const [mapboxError, setMapboxError] = useState<Error | null>(null)
  const { user, isLoading } = useAuthStoreContext()

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

  if (isLoading) return null

  if (!user) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />
  }

  // Render the children routes now that all the assets are loaded.
  return (
    <MapZonesProvider>
      <VehiclesStoreProvider>
        <PurchaseStoreProvider>
          <TicketsFiltersStoreProvider>
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
              <Stack.Screen name="tickets/filters/index" options={{ presentation: 'modal' }} />
              <Stack.Screen name="tickets/filters/vehicles" options={{ presentation: 'modal' }} />
              <Stack.Screen
                name="tickets/filters/timeframes"
                options={{
                  headerShown: false,
                  presentation: 'transparentModal',
                  animation: 'none',
                }}
              />
            </Stack>
          </TicketsFiltersStoreProvider>
        </PurchaseStoreProvider>
      </VehiclesStoreProvider>
    </MapZonesProvider>
  )
}

export default RootLayout
