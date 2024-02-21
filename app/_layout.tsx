// Route layout is based on documentation in expo-router:
// https://docs.expo.dev/router/reference/authentication/

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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SplashScreen, Stack } from 'expo-router'
import { NativeWindStyleSheet } from 'nativewind'
import { Suspense } from 'react'
import { NativeModules } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ToastProvider } from 'react-native-toast-notifications'

import LoadingScreen from '@/components/screen-layout/LoadingScreen'
import { useToastProviderProps } from '@/components/screen-layout/Snackbar/useSnackbar'
import OmnipresentComponent from '@/components/special/OmnipresentComponent'
import AuthStoreProvider from '@/state/AuthStoreProvider/AuthStoreProvider'
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
  // temp - replace with font we actually want to use
  const [fontsLoaded] = useFonts({
    /* eslint-disable unicorn/prefer-module,global-require */
    BelfastGrotesk_700Bold: require('@/assets/fonts/Belfast-Grotesk-Bold.otf'),
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    /* eslint-enable unicorn/prefer-module,global-require */
  })

  const queryClient = new QueryClient({
    // TODO, set to 1 to prevent confusion during development, may be set to default for production
    // `gcTime` = `cacheTime` in v5: https://tanstack.com/query/latest/docs/react/guides/caching
    defaultOptions: { queries: { retry: 1, gcTime: 1000 * 60 * 60 } },
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
              <GestureHandlerRootView className="flex-1">
                <PortalProvider>
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

export default RootLayout
