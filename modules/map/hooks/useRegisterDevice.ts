import messaging from '@react-native-firebase/messaging'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Platform } from 'react-native'

import { clientApi } from '@/modules/backend/client-api'
import { devicesOptions } from '@/modules/backend/constants/queryOptions'
import { MobileDevicePlatform } from '@/modules/backend/openapi-generated'

export const useRegisterDevice = (skipTokenRegistration?: boolean) => {
  const devicesQuery = useQuery(devicesOptions(skipTokenRegistration))

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

    // Register the device only if the device token is not already registered. Without this check, we can run into loop.
    if (
      token &&
      devicesQuery.data &&
      !devicesQuery.data.devices.some((device) => device.token === token)
    ) {
      registerDeviceMutation.mutate(token)
    }
  }

  return { registerDeviceIfNotExists }
}
