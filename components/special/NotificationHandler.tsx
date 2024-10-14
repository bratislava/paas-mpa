import messaging from '@react-native-firebase/messaging'
import { router } from 'expo-router'
import { useEffect } from 'react'

const navigateToTickets = (notificationType: string) => {
  router.navigate({
    pathname: '/tickets',
    params: {
      tab: notificationType === 'ENDED' ? 'history' : 'active',
    },
  })
}

const getInitialNotification = async () => {
  const initialNotification = await messaging().getInitialNotification()

  if (initialNotification) {
    navigateToTickets(initialNotification.data?.notificationType as string)
  }
}

/**
 * Handles notifications that open the app
 */
const NotificationHandler = () => {
  useEffect(() => {
    // Notification caused app to open from background state
    const unsubscribe = messaging().onNotificationOpenedApp((notification) => {
      navigateToTickets(notification.data?.notificationType as string)
    })

    // Notification caused app to open from quit state
    getInitialNotification()

    return unsubscribe
  }, [])

  return null
}

export default NotificationHandler
