import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { router, UnknownInputParams } from 'expo-router'
import { useEffect } from 'react'

const navigateFromNotification = (notification: FirebaseMessagingTypes.RemoteMessage) => {
  if (!notification.data) {
    return
  }

  if (notification.data.pathname) {
    router.navigate({
      pathname: notification.data.pathname as string,
      params: (notification.data.params as UnknownInputParams) ?? {},
    })

    return
  }

  // This is here for backward compatibility with old notifications
  // TODO: remove after migration to new notifications
  if (notification.data.notificationType) {
    router.navigate({
      pathname: '/tickets',
      params: {
        tab: notification.data.notificationType === 'ENDED' ? 'history' : 'active',
      },
    })
  }
}

const getInitialNotification = async () => {
  const initialNotification = await messaging().getInitialNotification()

  if (initialNotification) {
    navigateFromNotification(initialNotification)
  }
}

/**
 * Handles notifications that open the app
 */
const NotificationHandler = () => {
  useEffect(() => {
    // Notification caused app to open from background state
    const unsubscribe = messaging().onNotificationOpenedApp((notification) => {
      navigateFromNotification(notification)
    })

    // Notification caused app to open from quit state
    getInitialNotification()

    return unsubscribe
  }, [])

  return null
}

export default NotificationHandler
