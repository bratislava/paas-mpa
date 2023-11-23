import { useContext } from 'react'

import { MapZonesContext } from '@/state/MapZonesProvider/MapZonesProvider'

export const useMapZonesContext = () => {
  return useContext(MapZonesContext)
}
