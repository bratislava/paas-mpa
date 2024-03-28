// Route layout is based on documentation in expo-router:
// https://docs.expo.dev/router/reference/authentication/

import Mapbox from '@rnmapbox/maps'
import { Redirect, Stack } from 'expo-router'
import { useEffect, useState } from 'react'

import { environment } from '@/environment'
import { useAuthStoreContext } from '@/state/AuthStoreProvider/useAuthStoreContext'
import MapStoreProvider from '@/state/MapStoreProvider/MapStoreProvider'
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

  // Prevent rendering until mapbox has loaded
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
    return <Redirect href="/onboarding" />
  }

  // Render the children routes now that all the assets are loaded.
  return (
    <MapZonesProvider>
      <MapStoreProvider>
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
                <Stack.Screen
                  name="search"
                  options={{
                    animation: 'slide_from_bottom',
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="menu"
                  options={{
                    // TODO On ios, animation from right is ignored when presentation is transparentModal
                    // For now, implemented as full screen page with animation from right
                    // headerShown: false,
                    // presentation: 'transparentModal',
                    animation: 'slide_from_right',
                  }}
                />
              </Stack>
            </TicketsFiltersStoreProvider>
          </PurchaseStoreProvider>
        </VehiclesStoreProvider>
      </MapStoreProvider>
    </MapZonesProvider>
  )
}

export default RootLayout
