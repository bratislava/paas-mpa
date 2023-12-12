import { QueryObserverResult } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'

import { TicketDto } from '@/modules/backend/openapi-generated'

/**
 * Hook to refetch query when first ticket parking ends
 * @param tickets the tickets array to check earliest expiry time
 * @param refetch function to refetch query from useQuery hook
 */
export const useQueryRefetchOnTicketExpire = (
  refetch: () => Promise<QueryObserverResult>,
  tickets?: TicketDto[],
) => {
  const sortedTickets = useMemo(
    () =>
      tickets?.sort((a, b) => new Date(a.parkingEnd).getTime() - new Date(b.parkingEnd).getTime()),
    [tickets],
  )

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    const time = sortedTickets?.length
      ? new Date(sortedTickets[0]?.parkingEnd).getTime() - Date.now()
      : 0

    if (time !== 0) {
      timer = setTimeout(async () => {
        refetch()
      }, time)
    }

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedTickets])
}
