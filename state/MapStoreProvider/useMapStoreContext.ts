import { useContext } from 'react'

import { MapStoreContext } from '@/state/MapStoreProvider/MapStoreProvider'

export const useMapStoreContext = () => {
  const context = useContext(MapStoreContext)

  if (!context) {
    throw new Error('useMapStoreContext must be used within a MapStoreProvider')
  }

  return context
}
