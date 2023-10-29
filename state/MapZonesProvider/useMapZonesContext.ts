import { useContext } from 'react'

import { MapZonesContext } from '@/state/MapZonesProvider/MapZonesProvider'

export const useMapZonesContext = () => {
  const context = useContext(MapZonesContext)

  if (!context) {
    throw new Error('useMapValueContext must be used within a MapProvider')
  }

  return context
}
