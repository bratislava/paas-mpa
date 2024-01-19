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
  const [doNotAskAgain, setDoNotAskAgain] = useState(false)

  const checkPermission = useCallback(async () => {
    const { status } = await Location.getForegroundPermissionsAsync()
    setPermissionStatus(status)
  }, [])

  useEffect(() => {
    checkPermission()
  }, [checkPermission])

  const getPermission = useCallback(async () => {
    if (!doNotAskAgain) {
      const { status } = await Location.requestForegroundPermissionsAsync()

      setDoNotAskAgain(true)
      setPermissionStatus(status)
    }
  }, [doNotAskAgain])

  useEffect(() => {
    if (autoAsk) {
      getPermission().catch((error) => {
        console.warn(error)
      })
    }
  }, [getPermission, autoAsk])

  return [permissionStatus, getPermission] as const
}
