import { useContext } from 'react'

import { MapValueContext } from '@/state/MapProvider/MapProvider'

export const useMapValueContext = () => {
  const context = useContext(MapValueContext)

  if (!context) {
    throw new Error('useMapValueContext must be used within a MapProvider')
  }

  return context
}
