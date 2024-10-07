import messaging from '@react-native-firebase/messaging'
import { router } from 'expo-router'
import { useEffect } from 'react'

const getInitialNotification = async () => {
  const initialNotification = await messaging().getInitialNotification()

  if (initialNotification) {
    router.navigate('/tickets')
  }
}

export const useOpenAppFromNotification = () => {
  useEffect(() => {
    // Notification caused app to open from background state
    const unsubscribe = messaging().onNotificationOpenedApp(() => {
      router.navigate('/tickets')
    })

    // Notification caused app to open from quit state
    getInitialNotification()

    return unsubscribe
  }, [])

  return null
}
