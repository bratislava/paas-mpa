import { createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from 'react'

import { MapFeatureHashMap } from '@/state/MapZonesProvider/types'

type ValueContextProps = {
  mapZones: MapFeatureHashMap | null
}

type UpdateContextProps = {
  setMapZones: Dispatch<SetStateAction<MapFeatureHashMap | null>>
}

export const MapZonesContext = createContext({} as ValueContextProps)
MapZonesContext.displayName = 'MapZonesContext'

export const MapZonesUpdateContext = createContext({} as UpdateContextProps)
MapZonesUpdateContext.displayName = 'MapZonesUpdateContext'

const MapZonesProvider = ({ children }: PropsWithChildren) => {
  const [mapZones, setMapZones] = useState<MapFeatureHashMap | null>(null)

  return (
    <MapZonesContext.Provider value={{ mapZones }}>
      <MapZonesUpdateContext.Provider value={{ setMapZones }}>
        {children}
      </MapZonesUpdateContext.Provider>
    </MapZonesContext.Provider>
  )
}

export default MapZonesProvider
