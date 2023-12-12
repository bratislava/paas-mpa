import { useNavigation } from 'expo-router'
import { useEffect } from 'react'

/**
 * Hook to prevent go back from current screen by clicking back button
 * !IMPORTANT! This must be used with Stack.Screen component and gestureEnabled should be false:
 * <Stack.Screen options={{ gestureEnabled: false }} />
 */
export const usePreventGoBack = () => {
  // Navigation
  const navigation = useNavigation()

  // Effect
  useEffect(() => {
    navigation.addListener('beforeRemove', (e) => {
      e.preventDefault()
    })

    return () => navigation.removeListener('beforeRemove', () => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
