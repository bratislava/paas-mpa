// Route layout is based on documentation in expo-router:
// https://docs.expo.dev/router/reference/authentication/

import Mapbox from '@rnmapbox/maps'
import { Redirect, router, Stack } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'

import Icon from '@/components/shared/Icon'
import PressableStyled from '@/components/shared/PressableStyled'
import { environment } from '@/environment'
import { useAuthStoreContext } from '@/state/AuthStoreProvider/useAuthStoreContext'
import MapSearchProvider from '@/state/MapSearchProvider/MapSearchProvider'
import MapZonesProvider from '@/state/MapZonesProvider/MapZonesProvider'
import PurchaseStoreProvider from '@/state/PurchaseStoreProvider/PurchaseStoreProvider'
import TicketsFiltersStoreProvider from '@/state/TicketsFiltersStoreProvider/TicketsFiltersStoreProvider'
import VehiclesStoreProvider from '@/state/VehiclesStoreProvider/VehiclesStoreProvider'
import colors from '@/tailwind.config.colors'

const RootLayout = () => {
  const [mapboxLoaded, setMapboxLoaded] = useState(false)
  const [mapboxError, setMapboxError] = useState<Error | null>(null)
  const { user } = useAuthStoreContext()

  useEffect(() => {
    Mapbox.setAccessToken(environment.mapboxPublicKey)
      .finally(() => setMapboxLoaded(true))
      .catch((error) =>
        setMapboxError(error instanceof Error ? error : new Error('Unknown error - init mapbox')),
      )
  }, [])

  const xHeaderRight = useCallback(
    // eslint-disable-next-line react/no-unused-prop-types
    ({ canGoBack, tintColor }: { tintColor?: string; canGoBack: boolean }) => {
      const onPress = () => {
        if (canGoBack) {
          router.back()
        } else {
          router.push('/')
        }
      }

      return (
        <PressableStyled accessibilityLabel="close" onPress={onPress}>
          <Icon name="close" style={{ color: tintColor }} />
        </PressableStyled>
      )
    },
    [],
  )

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
      <MapSearchProvider>
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
                  name="search/index"
                  options={{
                    animation: 'slide_from_bottom',
                    headerShown: false,
                    headerRight: xHeaderRight,
                    headerBackButtonMenuEnabled: false,
                  }}
                />
              </Stack>
            </TicketsFiltersStoreProvider>
          </PurchaseStoreProvider>
        </VehiclesStoreProvider>
      </MapSearchProvider>
    </MapZonesProvider>
  )
}

export default RootLayout
