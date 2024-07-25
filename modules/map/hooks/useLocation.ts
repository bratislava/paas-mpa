import * as Location from 'expo-location'
import { useCallback, useEffect, useState } from 'react'

import { useLocationPermission } from '@/modules/map/hooks/useLocationPermission'

// TODO refactor
export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const { locationPermissionStatus } = useLocationPermission()

  const getLocation = useCallback(async () => {
    if (locationPermissionStatus !== Location.PermissionStatus.GRANTED) return

    const lastKnownPosition = await Location.getLastKnownPositionAsync()
    setLocation(lastKnownPosition)

    // Request the current position for next-time use.
    // It should be used on next visit of Map screen or when GPS button is pressed (if already available)
    await Location.getCurrentPositionAsync()
  }, [locationPermissionStatus])

  // TODO handle error
  useEffect(() => {
    getLocation()
  }, [getLocation])

  return [location] as const
}
