import { createContext, PropsWithChildren, useMemo } from 'react'

import { TicketDto } from '@/modules/backend/openapi-generated'

interface Props extends PropsWithChildren {
  ticket?: TicketDto
}

export const TicketContext = createContext<TicketDto | null | undefined>(null)

const TicketProvider = ({ children, ticket }: Props) => {
  const value = useMemo(() => ticket ?? undefined, [ticket])

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>
}

export default TicketProvider
