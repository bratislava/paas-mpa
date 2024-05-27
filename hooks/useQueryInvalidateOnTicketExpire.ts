import { QueryObserverResult, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'

import { TicketDto } from '@/modules/backend/openapi-generated'

const REFETCH_BUFFER_TIME = 10_000

/**
 * Hook to refetch query when first ticket parking ends
 *
 * @param tickets the tickets array to check earliest expiry time
 * @param refetch function to refetch query from useQuery hook
 * @param queryKey
 */
export const useQueryInvalidateOnTicketExpire = (
  tickets: TicketDto[] | null,
  refetch: () => Promise<QueryObserverResult>,
  queryKey: string[],
) => {
  const sortedTickets = useMemo(
    () =>
      tickets?.sort((a, b) => new Date(a.parkingEnd).getTime() - new Date(b.parkingEnd).getTime()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tickets?.length],
  )

  const queryClient = useQueryClient()

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    const time = sortedTickets?.length
      ? new Date(sortedTickets[0]?.parkingEnd).getTime() - Date.now()
      : 0

    if (time !== 0) {
      timer = setTimeout(() => {
        queryClient.removeQueries({ queryKey })
        refetch()
      }, time + REFETCH_BUFFER_TIME)
    }

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [queryClient, queryKey, refetch, sortedTickets])
}
