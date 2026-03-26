import messaging from '@react-native-firebase/messaging'
import { useMutation } from '@tanstack/react-query'
import { signOut } from 'aws-amplify/auth'
import * as Device from 'expo-device'
import { router } from 'expo-router'

import { clientApi } from '@/modules/backend/client-api'
import { clearExponea } from '@/modules/cognito/utils'
import { useAuthStoreUpdateContext } from '@/state/AuthStoreProvider/useAuthStoreUpdateContext'

/**
 * Sign out from Cognito, unregister from notifications, set AuthStore user to null and redirect to sign in page
 * Docs: https://docs.amplify.aws/react-native/build-a-backend/auth/enable-sign-up/#sign-out
 */
export const useSignOut = () => {
  const onAuthStoreUpdate = useAuthStoreUpdateContext()

  const { mutate: mutateDeleteDeviceByToken } = useMutation({
    mutationFn: async (tokenInner: string) =>
      clientApi.mobileDevicesControllerDeleteMobileDeviceByToken(tokenInner),
  })

  return async () => {
    try {
      // Unregister the device from notifications
      if (Device.isDevice) {
        try {
          const token = await messaging().getToken()
          mutateDeleteDeviceByToken(token)
        } catch {
          // TODO handle error
          console.log('error during unregistering device from notifications')
        }
      }
      // Sign out from cognito
      await signOut()
      // Cleanup the store and redirect to sign in
      onAuthStoreUpdate({ user: null })
      await clearExponea()
      router.replace('/sign-in')
    } catch (error) {
      console.log('error signing out', error)
    }
  }
}
