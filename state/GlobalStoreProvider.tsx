import { Feature, Point, Polygon } from 'geojson'
import { createContext, Dispatch, SetStateAction, useMemo, useState } from 'react'

import { MapInterestPoint, MapUdrZone } from '@/modules/map/types'

export type MapFeaturesHashMapValue = Feature<Point | Polygon, MapUdrZone | MapInterestPoint>

type MapFeatureHashMap = Map<number, MapFeaturesHashMapValue>

type ContextProps = {
  mapFeatures: MapFeatureHashMap | null
  setMapFeatures: Dispatch<SetStateAction<MapFeatureHashMap | null>>
}

export const GlobalStoreContext = createContext({} as ContextProps)

type Props = {
  children: React.ReactNode
}

const GlobalStoreProvider = ({ children }: Props) => {
  const [mapFeatures, setMapFeatures] = useState<MapFeatureHashMap | null>(null)

  const value = useMemo(
    () => ({
      mapFeatures,
      setMapFeatures,
    }),
    [mapFeatures],
  )

  return <GlobalStoreContext.Provider value={value}>{children}</GlobalStoreContext.Provider>
}

export default GlobalStoreProvider
