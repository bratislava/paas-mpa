import { useContext } from 'react'

import { TicketContext } from './TicketProvider'

export const useTicketContext = () => {
  const context = useContext(TicketContext)

  if (context === null) {
    throw new Error('useTicketsContext must be used within a TicketsFiltersStoreProvider')
  }

  return context
}
