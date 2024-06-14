import messaging from '@react-native-firebase/messaging'
import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'
import { Platform } from 'react-native'

import { clientApi } from '@/modules/backend/client-api'
import { MobileDevicePlatform } from '@/modules/backend/openapi-generated'

export const useRegisterDevice = () => {
  const { mutate: mutateRegisterDevice } = useMutation({
    mutationFn: async (tokenInner: string) =>
      // TODO investigate if/why this request gets resent in infinite loop sometimes
      clientApi.mobileDevicesControllerInsertMobileDevice({
        token: tokenInner,
        platform: Platform.OS === 'ios' ? MobileDevicePlatform.Apple : MobileDevicePlatform.Android,
      }),
    onSuccess: async () => {
      console.log('Device registered')
    },
  })

  const registerDevice = useCallback(async () => {
    try {
      const token = await messaging().getToken()
      mutateRegisterDevice(token)
    } catch (error) {
      // TODO handle error
      console.log('no token', error)
    }
  }, [mutateRegisterDevice])

  return { registerDevice }
}
