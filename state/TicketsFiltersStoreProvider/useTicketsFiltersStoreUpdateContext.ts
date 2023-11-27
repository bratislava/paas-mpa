import { useContext } from 'react'

import { TicketsFiltersStoreUpdateContext } from '@/state/TicketsFiltersStoreProvider/TicketsFiltersStoreProvider'

export const useTicketsFiltersStoreUpdateContext = () => {
  const context = useContext(TicketsFiltersStoreUpdateContext)

  if (!context) {
    throw new Error(
      'useTicketsFiltersStoreUpdateContext must be used within a TicketsFiltersStoreProvider',
    )
  }

  return context
}
