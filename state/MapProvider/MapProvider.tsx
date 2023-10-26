import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useMemo,
  useState,
} from 'react'

import { MapZoneHashMapValue } from '@/state/MapProvider/types'

type MapFeatureHashMap = Map<string, MapZoneHashMapValue>

type ContextProps = {
  mapZones: MapFeatureHashMap | null
  setMapZones: Dispatch<SetStateAction<MapFeatureHashMap | null>>
}

export const MapContext = createContext({} as ContextProps)
MapContext.displayName = 'MapContext'

const MapProvider = ({ children }: PropsWithChildren) => {
  const [mapZones, setMapZones] = useState<MapFeatureHashMap | null>(null)

  const value = useMemo(
    () => ({
      mapZones,
      setMapZones,
    }),
    [mapZones],
  )

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>
}

export default MapProvider
