import { useContext } from 'react'

import { GlobalStoreUpdateContext } from './GlobalStoreProvider'

export const useGlobalStoreUpdateContext = () => {
  const context = useContext(GlobalStoreUpdateContext)

  if (!context) {
    throw new Error('useGlobalStoreUpdateContext must be used within a PurchaseStoreProvider')
  }

  return context
}
