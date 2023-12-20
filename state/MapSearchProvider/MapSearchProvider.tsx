import { Position } from 'geojson'
import { createContext, PropsWithChildren, useCallback, useState } from 'react'

type MapSearchContextProps = {
  setFlyToCenter: ((center: Position) => void) | null
}

export const MapSearchContext = createContext<MapSearchContextProps | null>(null)
MapSearchContext.displayName = 'MapSearchContext'

export const MapSearchUpdateContext = createContext<
  ((newValues: Partial<MapSearchContextProps>) => void) | null
>(null)
MapSearchUpdateContext.displayName = 'MapSearchUpdateContext'

const defaultInitialMapSearchValues: MapSearchContextProps = {
  setFlyToCenter: null,
}

const MapSearchProvider = ({ children }: PropsWithChildren) => {
  const [values, setValues] = useState<MapSearchContextProps>(defaultInitialMapSearchValues)

  const onMapSearchProviderUpdate = useCallback(
    (newValues: Partial<MapSearchContextProps>) => {
      setValues((prevValues) => ({ ...prevValues, ...newValues }))
    },
    [setValues],
  )

  return (
    <MapSearchUpdateContext.Provider value={onMapSearchProviderUpdate}>
      <MapSearchContext.Provider value={values}>{children}</MapSearchContext.Provider>
    </MapSearchUpdateContext.Provider>
  )
}

export default MapSearchProvider
