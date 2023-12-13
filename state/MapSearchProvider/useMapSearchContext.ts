import { useContext } from 'react'

import { MapSearchContext } from '@/state/MapSearchProvider/MapSearchProvider'

export const useMapSearchContext = () => {
  const context = useContext(MapSearchContext)

  if (!context) {
    throw new Error('useMapSearchContext must be used within a MapSearchProvider')
  }

  return context
}
