import { useContext } from 'react'

import { PurchaseStoreContext } from '@/state/PurchaseStoreProvider/PurchaseStoreProvider'

export const usePurchaseStoreContext = () => {
  const context = useContext(PurchaseStoreContext)

  if (!context) {
    throw new Error('usePurchaseStoreContext must be used within a PurchaseStoreProvider')
  }

  return context
}
