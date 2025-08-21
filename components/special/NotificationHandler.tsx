import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { Linking } from 'react-native'

const navigateFromNotification = (notification: FirebaseMessagingTypes.RemoteMessage) => {
  if (!notification.data) {
    return
  }

  const { link, notificationType } = notification.data

  // If the notification has a deeplink and the deeplink is to our app, open it
  if (link && typeof link === 'string' && link.startsWith('paasmpa://')) {
    Linking.openURL(link)

    return
  }

  // This is here for backward compatibility with old notifications
  // TODO: remove after migration to new notifications
  if (notificationType) {
    router.navigate({
      pathname: '/tickets',
      params: {
        tab: notificationType === 'ENDED' ? 'history' : 'active',
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
