// Route layout is based on documentation in expo-router:
// https://docs.expo.dev/router/reference/authentication/

import 'intl-pluralrules'
import '@/modules/cognito/amplify'
import '../i18n.config.js'
import '../global.css'

/* eslint-disable babel/camelcase */
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { PortalProvider } from '@gorhom/portal'
import * as Sentry from '@sentry/react-native'
/* eslint-enable babel/camelcase */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SplashScreen, Stack, useNavigationContainerRef } from 'expo-router'
import * as Updates from 'expo-updates'
import { Suspense, useEffect } from 'react'
import { NativeModules } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ToastProvider } from 'react-native-toast-notifications'

import LoadingScreen from '@/components/screen-layout/LoadingScreen'
import { useToastProviderProps } from '@/components/screen-layout/Snackbar/useSnackbar'
import OmnipresentComponent from '@/components/special/OmnipresentComponent'
import { environment } from '@/environment'
import AuthStoreProvider from '@/state/AuthStoreProvider/AuthStoreProvider'
import colors from '@/tailwind.config.colors'

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation()

Sentry.init({
  dsn: environment.sentryDns,
  // Debug mode sends logs to console even when enabled is false
  debug: environment.deployment !== 'production',
  // Disabled in development to avoid unnecessary events in Sentry
  enabled: environment.deployment === 'production',
  environment: environment.deployment,
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation,
      enableNativeFramesTracking: true,
    }),
  ],
})

SplashScreen.preventAutoHideAsync()

const { UIManager } = NativeModules

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
if (UIManager.setLayoutAnimationEnabledExperimental)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  UIManager.setLayoutAnimationEnabledExperimental(true)

// Keeping the same name `onFetchUpdateAsync` as in documentation for easier reference
const onFetchUpdateAsync = async () => {
  try {
    const update = await Updates.checkForUpdateAsync()

    if (update.isAvailable) {
      await Updates.fetchUpdateAsync()
      await Updates.reloadAsync()
    }
  } catch (error) {
    console.log('Error fetching update', error)
  }
}

const RootLayout = () => {
  // Capture the NavigationContainer ref and register it with the instrumentation.
  const ref = useNavigationContainerRef()
  useEffect(() => {
    if (ref) {
      routingInstrumentation.registerNavigationContainer(ref)
    }
  }, [ref])

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
    if (environment.deployment === 'production') {
      onFetchUpdateAsync()
    }
  }, [])

  const queryClient = new QueryClient({
    // TODO - we change retries to 0 to see the behaviour in production, if it helps with too long waiting for expected errors response
    defaultOptions: { queries: { retry: 0 } },
  })

  const toastProviderProps = useToastProviderProps()

  // Prevent rendering until the font has loaded and mapbox has loaded
  if (!fontsLoaded) {
    return null
  }

  // Render the children routes now that all the assets are loaded.
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ToastProvider {...toastProviderProps}>
        <QueryClientProvider client={queryClient}>
          <AuthStoreProvider>
            <SafeAreaProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <PortalProvider>
                  <BottomSheetModalProvider>
                    <Stack
                      screenOptions={{
                        headerBackTitleVisible: false,
                        headerShown: false,
                        headerTitleStyle: {
                          fontFamily: 'BelfastGrotesk_700Bold',
                        },
                        headerTintColor: colors.dark.DEFAULT,
                      }}
                    />
                  </BottomSheetModalProvider>
                  <OmnipresentComponent />
                </PortalProvider>
              </GestureHandlerRootView>
            </SafeAreaProvider>
          </AuthStoreProvider>
        </QueryClientProvider>
      </ToastProvider>
    </Suspense>
  )
}

export default Sentry.wrap(RootLayout)
