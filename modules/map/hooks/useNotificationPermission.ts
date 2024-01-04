import messaging from '@react-native-firebase/messaging'
import { useMutation } from '@tanstack/react-query'
import * as Device from 'expo-device'
import { PermissionStatus } from 'expo-modules-core'
import { router } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { Platform } from 'react-native'

import { clientApi } from '@/modules/backend/client-api'
import { MobileDevicePlatform } from '@/modules/backend/openapi-generated'

type Options =
  | {
      autoAsk?: boolean
    }
  | undefined

export const useNotificationPermission = ({ autoAsk }: Options = {}) => {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>(
    PermissionStatus.UNDETERMINED,
  )

  const registerDeviceMutation = useMutation({
    mutationFn: async (token: string) =>
      clientApi.mobileDevicesControllerInsertMobileDevice({
        token,
        platform: Platform.OS === 'ios' ? MobileDevicePlatform.Apple : MobileDevicePlatform.Android,
      }),
  })

  const getPermission = useCallback(async () => {
    if (Device.isDevice) {
      const authStatus = await messaging().requestPermission()
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL

      if (enabled) {
        setPermissionStatus(PermissionStatus.GRANTED)
        const token = await messaging().getToken()

        if (token) {
          console.log('token', token)
          registerDeviceMutation.mutate(token)
        }
      }
    } else {
      console.warn('Must use physical device for Push Notifications, skipping.')
      // If on simulator, continue to homepage
      router.push('/')
    }
  }, [registerDeviceMutation])

  useEffect(() => {
    if (autoAsk) {
      try {
        getPermission()
      } catch (error) {
        console.warn(error)
      }
    }
  }, [getPermission, autoAsk])

  return [permissionStatus, getPermission] as const
}
