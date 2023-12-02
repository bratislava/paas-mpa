import * as Location from 'expo-location'
import { useCallback, useEffect, useState } from 'react'

type Options =
  | {
      autoAsk?: boolean
    }
  | undefined

export const useLocationPermission = ({ autoAsk }: Options = {}) => {
  const [permissionStatus, setPermissionStatus] = useState<Location.PermissionStatus>(
    Location.PermissionStatus.UNDETERMINED,
  )

  const getPermission = useCallback(async () => {
    const { status: existingStatus } = await Location.getForegroundPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== Location.PermissionStatus.GRANTED) {
      const { status } = await Location.requestForegroundPermissionsAsync()
      finalStatus = status
    }
    setPermissionStatus(finalStatus)
  }, [])

  useEffect(() => {
    if (autoAsk) {
      getPermission().catch((error) => {
        console.warn(error)
      })
    }
  }, [getPermission, autoAsk])

  return [permissionStatus, getPermission] as const
}
