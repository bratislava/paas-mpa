import * as Location from 'expo-location'
import { useCallback, useEffect, useState } from 'react'

import { useLocationPermission } from '@/modules/map/hooks/useLocationPermission'

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [permissionStatus] = useLocationPermission()

  const getCurrentPosition = useCallback(async () => {
    const currentPosition = await Location.getCurrentPositionAsync()
    setLocation(currentPosition)
  }, [])

  const getLocation = useCallback(async () => {
    if (permissionStatus === Location.PermissionStatus.DENIED) return
    const lastKnownPosition = await Location.getLastKnownPositionAsync()
    setLocation(lastKnownPosition)
    getCurrentPosition()
  }, [permissionStatus, getCurrentPosition])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getLocation().catch((error) => {
      console.warn(error)
      setLocation(null)
    })
  }, [permissionStatus, getLocation])

  return [location, getLocation] as const
}
