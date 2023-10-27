import { useContext } from 'react'

import { MapZonesUpdateContext } from '@/state/MapZonesProvider/MapZonesProvider'

export const useMapZonesUpdateContext = () => {
  const context = useContext(MapZonesUpdateContext)

  if (!context) {
    throw new Error('useMapUpdateContext must be used within a MapProvider')
  }

  return context
}
