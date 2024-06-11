import messaging from '@react-native-firebase/messaging'
import { useMutation, useQuery } from '@tanstack/react-query'
import * as Device from 'expo-device'
import { useCallback, useEffect, useState } from 'react'
import { Platform } from 'react-native'

import { clientApi } from '@/modules/backend/client-api'
import { devicesOptions } from '@/modules/backend/constants/queryOptions'
import { MobileDevicePlatform } from '@/modules/backend/openapi-generated'
import { PermissionStatus } from '@/utils/types'

type Options =
  | {
      autoAsk?: boolean
      skipTokenQuery?: boolean
    }
  | undefined

export const useNotificationPermission = ({ autoAsk, skipTokenQuery }: Options = {}) => {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>(
    PermissionStatus.UNDETERMINED,
  )

  const { data, refetch } = useQuery(devicesOptions(skipTokenQuery))

  const registerDeviceMutation = useMutation({
    mutationFn: async (token: string) =>
      // TODO investigate if/why this request gets resent in infinite loop sometimes
      clientApi.mobileDevicesControllerInsertMobileDevice({
        token,
        platform: Platform.OS === 'ios' ? MobileDevicePlatform.Apple : MobileDevicePlatform.Android,
      }),
    onSuccess: async () => {
      await refetch()
    },
  })

  const checkAndRegisterToken = useCallback(async () => {
    const token = await messaging().getToken()

    if (token && data && !data.devices.some((device) => device.token === token)) {
      registerDeviceMutation.mutate(token)
    }
  }, [data, registerDeviceMutation])

  const checkPermission = useCallback(async () => {
    const authStatus = await messaging().hasPermission()
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL

    if (enabled) {
      setPermissionStatus(PermissionStatus.GRANTED)

      if (!skipTokenQuery) await checkAndRegisterToken()
    }
  }, [checkAndRegisterToken, skipTokenQuery])

  useEffect(() => {
    if (
      Device.isDevice &&
      (data || skipTokenQuery) &&
      permissionStatus === PermissionStatus.UNDETERMINED
    ) {
      checkPermission()
    }
  }, [checkPermission, data, permissionStatus, skipTokenQuery])

  const getPermission = useCallback(async () => {
    if (Device.isDevice) {
      const authStatus = await messaging().requestPermission()
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL

      if (enabled) {
        setPermissionStatus(PermissionStatus.GRANTED)
        await checkAndRegisterToken()
      } else {
        setPermissionStatus(PermissionStatus.DENIED)
      }
    } else {
      console.warn('Must use physical device for Push Notifications, skipping.')
      setPermissionStatus(PermissionStatus.DENIED)
    }
  }, [checkAndRegisterToken])

  useEffect(() => {
    if (autoAsk) {
      try {
        getPermission()
      } catch (error) {
        console.warn(error)
      }
    }
  }, [getPermission, autoAsk])

  return {
    notificationPermissionStatus: permissionStatus,
    getNotificationPermission: getPermission,
  }
}
