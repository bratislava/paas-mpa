import messaging from '@react-native-firebase/messaging'
import { useMutation, useQuery } from '@tanstack/react-query'
import { signOut } from 'aws-amplify/auth'
import * as Device from 'expo-device'
import { router } from 'expo-router'

import { clientApi } from '@/modules/backend/client-api'
import { devicesOptions } from '@/modules/backend/constants/queryOptions'
import { useAuthStoreUpdateContext } from '@/state/AuthStoreProvider/useAuthStoreUpdateContext'

/**
 * Sign out from Cognito, set AuthStore user to null and redirect to sign in page
 * Docs: https://docs.amplify.aws/react-native/build-a-backend/auth/enable-sign-up/#sign-out
 */
export const useSignOut = () => {
  const onAuthStoreUpdate = useAuthStoreUpdateContext()

  const { data } = useQuery(devicesOptions())

  const registerDeviceMutation = useMutation({
    mutationFn: async (id: number) => clientApi.mobileDevicesControllerDeleteMobileDevice(id),
  })

  return async () => {
    try {
      // unregister device from notifications
      if (Device.isDevice) {
        try {
          const token = await messaging().getToken()
          const deviceId = data?.devices.find((device) => device.token === token)?.id

          if (deviceId) {
            registerDeviceMutation.mutate(deviceId)
          }
        } catch {
          console.log('error during unregistering device from notifications')
        }
      }
      // signout from cognito
      await signOut()
      // cleanup the store and redirect to sign in
      onAuthStoreUpdate({ user: null })
      router.replace('/sign-in')
    } catch (error) {
      console.log('error signing out', error)
    }
  }
}
