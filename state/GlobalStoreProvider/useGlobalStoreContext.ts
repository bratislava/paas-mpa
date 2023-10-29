import { useContext } from 'react'

import { GlobalStoreContext } from '@/state/GlobalStoreProvider/GlobalStoreProvider'

export const useGlobalStoreContext = () => {
  const context = useContext(GlobalStoreContext)

  if (!context) {
    throw new Error('useGlobalStoreContext must be used within a GlobalStoreProvider')
  }

  return context
}
