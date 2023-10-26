import { useContext } from 'react'

import { MapContext } from '@/state/MapProvider/MapProvider'

export const useMapContext = () => {
  const context = useContext(MapContext)

  if (!context) {
    throw new Error('useMapContext must be used within a MapProvider')
  }

  return context
}
