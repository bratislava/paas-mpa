import * as Location from 'expo-location'
import { useCallback, useEffect, useState } from 'react'

import { useLocationPermission } from './useLocationPermission'

export const useLocation = (): [Location.LocationObject | null, () => Promise<void>] => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const { permissionStatus } = useLocationPermission()

  const getCurrentLocation = useCallback(async () => {
    const currentPosition = await Location.getCurrentPositionAsync()
    setLocation(currentPosition)
  }, [])

  const getLocation = useCallback(async () => {
    if (permissionStatus !== Location.PermissionStatus.GRANTED) return
    const lastKnownPosition = await Location.getLastKnownPositionAsync()
    setLocation(lastKnownPosition)
    await getCurrentLocation()
  }, [permissionStatus, getCurrentLocation])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getLocation().catch((error) => {
      console.warn(error)
      setLocation(null)
    })
  }, [permissionStatus, getLocation])

  return [location, getLocation]
}
