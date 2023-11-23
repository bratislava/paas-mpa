import { useContext } from 'react'

import { AuthStoreUpdateContext } from './AuthStoreProvider'

export const useAuthStoreUpdateContext = () => {
  const context = useContext(AuthStoreUpdateContext)

  if (!context) {
    throw new Error('useAuthStoreUpdateContext must be used within a AuthStoreProvider')
  }

  return context
}
