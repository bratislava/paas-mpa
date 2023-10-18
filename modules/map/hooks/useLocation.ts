import * as Location from 'expo-location'
import { useCallback, useEffect, useState } from 'react'

import { useLocationPermission } from '@/modules/map/hooks/useLocationPermission'
import { getCurrentLocation } from '@/modules/map/utils/getCurrentLocation'

export const useLocation = (): [Location.LocationObject | null, () => Promise<void>] => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const { permissionStatus } = useLocationPermission()

  const getCurrentPosition = useCallback(async () => {
    const currentPosition = await getCurrentLocation()
    setLocation(currentPosition)
  }, [])

  const getLocation = useCallback(async () => {
    if (permissionStatus !== Location.PermissionStatus.GRANTED) return
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

  return [location, getLocation]
}
