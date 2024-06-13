import messaging from '@react-native-firebase/messaging'
import * as Device from 'expo-device'
import { useCallback, useEffect, useState } from 'react'

import { useRegisterDevice } from '@/modules/map/hooks/useRegisterDevice'
import { PermissionStatus } from '@/utils/types'

export const useNotificationPermission = () => {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>(
    PermissionStatus.UNDETERMINED,
  )

  const { registerDevice } = useRegisterDevice()

  useEffect(() => {
    const checkStatus = async () => {
      // https://rnfirebase.io/reference/messaging#hasPermission
      const authStatus = await messaging().hasPermission()
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL

      if (enabled) {
        setPermissionStatus(PermissionStatus.GRANTED)
      }
    }

    if (Device.isDevice && permissionStatus === PermissionStatus.UNDETERMINED) {
      checkStatus()
    }
  }, [permissionStatus])

  // TODO why useCallback
  const getPermission = useCallback(async () => {
    if (Device.isDevice) {
      // https://rnfirebase.io/messaging/usage#ios---requesting-permissions
      const authStatus = await messaging().requestPermission()
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL

      if (enabled) {
        setPermissionStatus(PermissionStatus.GRANTED)
        await registerDevice()
      } else {
        setPermissionStatus(PermissionStatus.DENIED)
      }
    } else {
      console.warn('Must use physical device for Push Notifications, skipping.')
      setPermissionStatus(PermissionStatus.DENIED)
    }
  }, [registerDevice])

  return {
    notificationPermissionStatus: permissionStatus,
    getNotificationPermission: getPermission,
  }
}
