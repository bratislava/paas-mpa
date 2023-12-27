import { Position } from 'geojson'
import { createContext, PropsWithChildren, useCallback, useState } from 'react'

type MapContextProps = {
  setFlyToCenter: ((center: Position) => void) | null
  rotateToNorth: (() => void) | null
}

export const MapStoreContext = createContext<MapContextProps | null>(null)
MapStoreContext.displayName = 'MapContext'

export const MapStoreUpdateContext = createContext<
  ((newValues: Partial<MapContextProps>) => void) | null
>(null)
MapStoreUpdateContext.displayName = 'MapUpdateContext'

const defaultInitialMapValues: MapContextProps = {
  setFlyToCenter: null,
  rotateToNorth: null,
}

const MapStoreProvider = ({ children }: PropsWithChildren) => {
  const [values, setValues] = useState<MapContextProps>(defaultInitialMapValues)

  const onMapProviderUpdate = useCallback(
    (newValues: Partial<MapContextProps>) => {
      setValues((prevValues) => ({ ...prevValues, ...newValues }))
    },
    [setValues],
  )

  return (
    <MapStoreUpdateContext.Provider value={onMapProviderUpdate}>
      <MapStoreContext.Provider value={values}>{children}</MapStoreContext.Provider>
    </MapStoreUpdateContext.Provider>
  )
}

export default MapStoreProvider
