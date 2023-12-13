import { useNavigation } from 'expo-router'
import { useEffect } from 'react'

/**
 * Hook to prevent go back from current screen by clicking back button
 * !IMPORTANT! This must be used with Stack.Screen component and gestureEnabled should be false:
 * <Stack.Screen options={{ gestureEnabled: false }} />
 */
export const usePreventGoBack = () => {
  const navigation = useNavigation()

  useEffect(() => {
    const preventEventHandler = (e: Pick<Event, 'preventDefault'>) => {
      e.preventDefault()
    }

    navigation.addListener('beforeRemove', preventEventHandler)

    return () => navigation.removeListener('beforeRemove', preventEventHandler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
