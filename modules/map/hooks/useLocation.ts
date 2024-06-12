import * as Location from 'expo-location'
import { useCallback, useEffect, useState } from 'react'

import { useLocationPermission } from '@/modules/map/hooks/useLocationPermission'

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const { locationPermissionStatus } = useLocationPermission()

  const getCurrentPosition = useCallback(async () => {
    const currentPosition = await Location.getCurrentPositionAsync()
    setLocation(currentPosition)
  }, [])

  const getLocation = useCallback(async () => {
    if (locationPermissionStatus !== Location.PermissionStatus.GRANTED) return

    const lastKnownPosition = await Location.getLastKnownPositionAsync()
    setLocation(lastKnownPosition)
    getCurrentPosition()
  }, [locationPermissionStatus, getCurrentPosition])

  useEffect(() => {
    getLocation().catch((error) => {
      console.warn(error)
      setLocation(null)
    })
  }, [getLocation])

  return [location, getLocation] as const
}
