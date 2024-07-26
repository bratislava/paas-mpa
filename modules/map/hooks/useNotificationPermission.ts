import messaging from '@react-native-firebase/messaging'
import { useMutation } from '@tanstack/react-query'
import * as Device from 'expo-device'
import { useCallback, useEffect, useState } from 'react'

import { clientApi } from '@/modules/backend/client-api'
import { SaveUserSettingsDto } from '@/modules/backend/openapi-generated'
import { useRegisterDevice } from '@/modules/map/hooks/useRegisterDevice'
import { UnifiedPermissionStatus } from '@/utils/types'

export const useNotificationPermission = () => {
  const [permissionStatus, setPermissionStatus] = useState<UnifiedPermissionStatus>(
    UnifiedPermissionStatus.UNDETERMINED,
  )

  const { registerDevice } = useRegisterDevice()

  const { mutate: mutateSaveSetting } = useMutation({
    mutationFn: (body: SaveUserSettingsDto) => clientApi.usersControllerSaveUserSettings(body),
  })

  useEffect(() => {
    const checkStatus = async () => {
      // https://rnfirebase.io/reference/messaging#hasPermission
      const authStatus = await messaging().hasPermission()
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL

      if (enabled) {
        setPermissionStatus(UnifiedPermissionStatus.GRANTED)
      }
    }

    if (Device.isDevice && permissionStatus === UnifiedPermissionStatus.UNDETERMINED) {
      checkStatus()
    }
  }, [permissionStatus])

  // TODO explain why useCallback is used
  // TODO this function should probably do this two things and should be called an app focus (?):
  //  - register device if permissions are granted and set push notifications settings to true
  //  - delete device if permissions are not granted
  //  Now we do only first thing and delete device is called only on sign out.
  const requestNotificationPermissionAndRegisterDevice = useCallback(async () => {
    if (Device.isDevice) {
      // https://rnfirebase.io/messaging/usage#ios---requesting-permissions
      const authStatus = await messaging().requestPermission()
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL

      if (enabled) {
        setPermissionStatus(UnifiedPermissionStatus.GRANTED)
        await registerDevice()
        mutateSaveSetting({ pushNotificationsAboutToEnd: true, pushNotificationsToEnd: true })
      } else {
        setPermissionStatus(UnifiedPermissionStatus.DENIED)
      }
    } else {
      console.warn('Must use physical device for Push Notifications, skipping.')
      setPermissionStatus(UnifiedPermissionStatus.DENIED)
    }
  }, [mutateSaveSetting, registerDevice])

  return {
    notificationPermissionStatus: permissionStatus,
    requestNotificationPermissionAndRegisterDevice,
  }
}
