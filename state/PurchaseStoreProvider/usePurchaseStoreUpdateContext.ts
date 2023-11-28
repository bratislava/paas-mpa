import { useContext } from 'react'

import { PurchaseStoreUpdateContext } from '@/state/PurchaseStoreProvider/PurchaseStoreProvider'

export const usePurchaseStoreUpdateContext = () => {
  const context = useContext(PurchaseStoreUpdateContext)

  if (!context) {
    throw new Error('usePurchaseStoreUpdateContext must be used within a PurchaseStoreProvider')
  }

  return context
}
