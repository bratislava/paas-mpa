import messaging from '@react-native-firebase/messaging'
import { useMutation } from '@tanstack/react-query'
import * as Device from 'expo-device'
import { PermissionStatus } from 'expo-modules-core'
// import * as Notifications from 'expo-notifications'
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

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// })

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
      console.log(messaging.AuthorizationStatus.AUTHORIZED)
      const authStatus = await messaging().requestPermission()
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      if (enabled) {
        setPermissionStatus(PermissionStatus.GRANTED)
        const token = await messaging().getToken()
        if (token) {
          console.log(token)
          registerDeviceMutation.mutate(token)
        }
      }
    } else {
      console.warn('Must use physical device for Push Notifications, skipping.')
      // If on simulator, continue to homepage
      router.push('/')
    }

    // if (Platform.OS === 'android') {
    //   await Notifications.setNotificationChannelAsync('default', {
    //     name: 'default',
    //     importance: Notifications.AndroidImportance.MAX,
    //     vibrationPattern: [0, 250, 250, 250],
    //     lightColor: '#FF231F7C',
    //   })
    // }

    // if (Device.isDevice) {
    //   const { status: existingStatus } = await Notifications.getPermissionsAsync()
    //   let finalStatus = existingStatus
    //   if (existingStatus !== PermissionStatus.GRANTED) {
    //     const { status } = await Notifications.requestPermissionsAsync()
    //     finalStatus = status
    //   }
    //   setPermissionStatus(finalStatus)
    //   if (finalStatus === PermissionStatus.GRANTED) {
    //     // Learn more about projectId:
    //     // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    //     const tokenResponse = await Notifications.getExpoPushTokenAsync()
    //     const token = tokenResponse.data

    //     if (token) {
    //       console.log(token)
    //       registerDeviceMutation.mutate(token)
    //     }
    //   }
    // } else {
    //   console.warn('Must use physical device for Push Notifications, skipping.')
    //   // If on simulator, continue to homepage
    //   router.push('/')
    // }
  }, [registerDeviceMutation])

  useEffect(() => {
    if (autoAsk) {
      getPermission().catch((error) => {
        console.warn(error)
      })
    }
  }, [getPermission, autoAsk])

  return [permissionStatus, getPermission] as const
}
