import messaging from '@react-native-firebase/messaging'
import * as Device from 'expo-device'
import { useEffect, useState } from 'react'

import { useRegisterDevice } from '@/modules/map/hooks/useRegisterDevice'
import { PermissionStatus } from '@/utils/types'

export const useNotificationPermission = (options?: { skipTokenRegistration?: boolean }) => {
  const { skipTokenRegistration = false } = options ?? {}

  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>(
    PermissionStatus.UNDETERMINED,
  )

  const { registerDeviceIfNotExists } = useRegisterDevice()

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

  useEffect(() => {
    if (Device.isDevice && permissionStatus === PermissionStatus.UNDETERMINED) {
      checkStatus()

      if (PermissionStatus.GRANTED && !skipTokenRegistration) {
        registerDeviceIfNotExists()
      }
    }
  }, [checkStatus, registerDeviceIfNotExists, permissionStatus])

  const getPermission = async () => {
    if (Device.isDevice) {
      // https://rnfirebase.io/messaging/usage#ios---requesting-permissions
      const authStatus = await messaging().requestPermission()
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL

      if (enabled) {
        setPermissionStatus(PermissionStatus.GRANTED)
        await registerDeviceIfNotExists()
      } else {
        setPermissionStatus(PermissionStatus.DENIED)
      }
    } else {
      console.warn('Must use physical device for Push Notifications, skipping.')
      setPermissionStatus(PermissionStatus.DENIED)
    }
  }

  return {
    notificationPermissionStatus: permissionStatus,
    getNotificationPermission: getPermission,
  }
}
