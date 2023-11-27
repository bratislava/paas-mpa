import { useContext } from 'react'

import { TicketsFiltersStoreContext } from '@/state/TicketsFiltersStoreProvider/TicketsFiltersStoreProvider'

export const useTicketsFiltersStoreContext = () => {
  const context = useContext(TicketsFiltersStoreContext)

  if (!context) {
    throw new Error(
      'useTicketsFiltersStoreContext must be used within a TicketsFiltersStoreProvider',
    )
  }

  return context
}
