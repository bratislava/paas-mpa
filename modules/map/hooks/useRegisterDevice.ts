import messaging from '@react-native-firebase/messaging'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Platform } from 'react-native'

import { clientApi } from '@/modules/backend/client-api'
import { devicesOptions } from '@/modules/backend/constants/queryOptions'
import { MobileDevicePlatform } from '@/modules/backend/openapi-generated'

export const useRegisterDevice = () => {
  const devicesQuery = useQuery(devicesOptions())

  const registerDeviceMutation = useMutation({
    mutationFn: async (tokenInner: string) =>
      // TODO investigate if/why this request gets resent in infinite loop sometimes
      clientApi.mobileDevicesControllerInsertMobileDevice({
        token: tokenInner,
        platform: Platform.OS === 'ios' ? MobileDevicePlatform.Apple : MobileDevicePlatform.Android,
      }),
    onSuccess: async () => {
      await devicesQuery.refetch()
    },
  })

  const registerDeviceIfNotExists = async () => {
    const token = await messaging().getToken()

    if (token && !devicesQuery.data?.devices.some((device) => device.token === token)) {
      registerDeviceMutation.mutate(token)
    }
  }

  return { registerDeviceIfNotExists }
}
