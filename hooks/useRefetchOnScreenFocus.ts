import { useFocusEffect } from 'expo-router'
import React from 'react'

// Function from tanstack query docs to refetch data when the screen is focused
// https://tanstack.com/query/v4/docs/framework/react/react-native#refresh-on-screen-focus
export function useRefetchOnScreenFocus<T>(refetch: () => Promise<T>) {
  const firstTimeRef = React.useRef(true)

  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false

        return
      }

      refetch()
    }, [refetch]),
  )
}
