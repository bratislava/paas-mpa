import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useMemo,
  useState,
} from 'react'

import { MapFeaturesHashMapValue } from '@/state/types'

type MapFeatureHashMap = Map<number, MapFeaturesHashMapValue>

type ContextProps = {
  mapFeatures: MapFeatureHashMap | null
  setMapFeatures: Dispatch<SetStateAction<MapFeatureHashMap | null>>
}

export const GlobalStoreContext = createContext({} as ContextProps)

const GlobalStoreProvider = ({ children }: PropsWithChildren) => {
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
