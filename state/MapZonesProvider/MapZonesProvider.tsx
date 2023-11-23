import { createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from 'react'

import { MapFeatureHashMap } from '@/state/MapZonesProvider/types'

export const MapZonesContext = createContext<MapFeatureHashMap | null>(null)
MapZonesContext.displayName = 'MapZonesContext'

export const MapZonesUpdateContext = createContext<Dispatch<
  SetStateAction<MapFeatureHashMap | null>
> | null>(null)
MapZonesUpdateContext.displayName = 'MapZonesUpdateContext'

const MapZonesProvider = ({ children }: PropsWithChildren) => {
  const [mapZones, setMapZones] = useState<MapFeatureHashMap | null>(null)

  return (
    <MapZonesUpdateContext.Provider value={setMapZones}>
      <MapZonesContext.Provider value={mapZones}>{children}</MapZonesContext.Provider>
    </MapZonesUpdateContext.Provider>
  )
}

export default MapZonesProvider
