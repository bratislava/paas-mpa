import { useContext } from 'react'

import { MapUpdateContext } from '@/state/MapProvider/MapProvider'

export const useMapUpdateContext = () => {
  const context = useContext(MapUpdateContext)

  if (!context) {
    throw new Error('useMapUpdateContext must be used within a MapProvider')
  }

  return context
}
