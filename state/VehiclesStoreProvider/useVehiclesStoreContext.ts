import { useContext } from 'react'

import { VehiclesStoreContext } from '@/state/VehiclesStoreProvider/VehiclesStoreProvider'

export const useVehiclesStoreContext = () => {
  const context = useContext(VehiclesStoreContext)

  if (!context) {
    throw new Error('useVehiclesStoreContext must be used within a VehiclesStoreProvider')
  }

  return context
}
