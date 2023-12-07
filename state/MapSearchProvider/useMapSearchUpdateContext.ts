import { useContext } from 'react'

import { MapSearchUpdateContext } from '@/state/MapSearchProvider/MapSearchProvider'

export const useMapSearchUpdateContext = () => {
  const context = useContext(MapSearchUpdateContext)

  if (!context) {
    throw new Error('useMapSearchContext must be used within a MapSearchProvider')
  }

  return context
}
