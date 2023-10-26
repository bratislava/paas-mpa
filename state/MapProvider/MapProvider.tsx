import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useMemo,
  useState,
} from 'react'

import { MapFeatureHashMap } from '@/state/MapProvider/types'

type ValueContextProps = {
  mapZones: MapFeatureHashMap | null
}

type UpdateContextProps = {
  setMapZones: Dispatch<SetStateAction<MapFeatureHashMap | null>>
}

export const MapValueContext = createContext({} as ValueContextProps)
MapValueContext.displayName = 'MapValueContext'

export const MapUpdateContext = createContext({} as UpdateContextProps)
MapUpdateContext.displayName = 'MapUpdateContext'

const MapProvider = ({ children }: PropsWithChildren) => {
  const [mapZones, setMapZones] = useState<MapFeatureHashMap | null>(null)

  const value = useMemo(
    () => ({
      mapZones,
    }),
    [mapZones],
  )

  const update = useMemo(
    () => ({
      setMapZones,
    }),
    [],
  )

  return (
    <MapValueContext.Provider value={value}>
      <MapUpdateContext.Provider value={update}>{children}</MapUpdateContext.Provider>
    </MapValueContext.Provider>
  )
}

export default MapProvider
