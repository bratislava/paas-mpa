import * as Location from 'expo-location'
import { useCallback, useEffect, useState } from 'react'

export const useLocationPermission = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus | null>(null)

  const getPermission = useCallback(async () => {
    const getResponse = await Location.getForegroundPermissionsAsync()
    if (getResponse?.status === Location.PermissionStatus.GRANTED) {
      setPermissionStatus(getResponse?.status)

      return
    }
    const { status } = await Location.requestForegroundPermissionsAsync()
    setPermissionStatus(status)
    if (status !== Location.PermissionStatus.GRANTED) {
      setErrorMsg('Permission to access location was denied')
    }
  }, [])

  useEffect(() => {
    getPermission().catch((error) => {
      console.warn(error)
    })
  }, [getPermission])

  return { permissionStatus, errorMsg }
}
