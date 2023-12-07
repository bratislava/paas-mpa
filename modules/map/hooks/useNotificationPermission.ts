import * as Device from 'expo-device'
import { PermissionStatus } from 'expo-modules-core'
import * as Notifications from 'expo-notifications'
import { router } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'

type Options =
  | {
      autoAsk?: boolean
    }
  | undefined

export const useNotificationPermission = ({ autoAsk }: Options = {}) => {
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>(
    PermissionStatus.UNDETERMINED,
  )
  const getPermission = useCallback(async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== PermissionStatus.GRANTED) {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }
      setPermissionStatus(finalStatus)
      if (finalStatus === PermissionStatus.GRANTED) {
        // Learn more about projectId:
        // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
        // const token = (await Notifications.getExpoPushTokenAsync({ projectId: 'your-project-id' })).data
        // console.log(token)
      }
    } else {
      console.warn('Must use physical device for Push Notifications, skipping.')
      router.push('/')
    }
  }, [])

  useEffect(() => {
    if (autoAsk) {
      getPermission().catch((error) => {
        console.warn(error)
      })
    }
  }, [getPermission, autoAsk])

  return [permissionStatus, getPermission] as const
}
