import * as Location from 'expo-location'
import { useEffect, useState } from 'react'

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [permissionStatus, requestPermission] = Location.useForegroundPermissions()

  useEffect(() => {
    ;(async () => {
      const { status } = await requestPermission()
      if (status !== Location.PermissionStatus.GRANTED) {
        setErrorMsg('Permission to access location was denied')

        return
      }

      const currentLocation = await Location.getCurrentPositionAsync({})
      setLocation(currentLocation)
    })()
  }, [requestPermission])

  return { location, permissionStatus, errorMsg }
}
