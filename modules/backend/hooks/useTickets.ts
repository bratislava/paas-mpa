import { queryOptions, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { TicketsResponseDto } from '@/modules/backend/openapi-generated'

const TEST_TICKETS: TicketsResponseDto = {
  paginationInfo: {
    total: 3,
    currentPage: 0,
    pageSize: 10,
  },
  tickets: [
    {
      udr: '1009',
      parkingStart: '2022-01-01T10:00:00Z',
      parkingEnd: '2022-01-01T12:00:00Z',
      price: { amount: 10, currency: 'EUR' },
      bpkCreditUsed: { duration: 'PT2H' },
      npkCreditUsed: { duration: 'PT2H' },
      updatedAt: '2022-01-01T12:00:00Z',
      createdAt: '2022-01-01T10:00:00Z',
    },
    {
      udr: '1008',
      parkingStart: '2022-01-02T10:00:00Z',
      parkingEnd: '2022-01-02T12:00:00Z',
      price: { amount: 20, currency: 'EUR' },
      bpkCreditUsed: { duration: 'PT2H' },
      npkCreditUsed: { duration: 'PT2H' },
      updatedAt: '2022-01-02T12:00:00Z',
      createdAt: '2022-01-02T10:00:00Z',
    },
    {
      udr: '1007',
      parkingStart: '2022-01-03T10:00:00Z',
      parkingEnd: '2022-01-03T12:00:00Z',
      price: { amount: 30, currency: 'EUR' },
      bpkCreditUsed: { duration: 'PT2H' },
      npkCreditUsed: { duration: 'PT2H' },
      updatedAt: '2022-01-03T12:00:00Z',
      createdAt: '2022-01-03T10:00:00Z',
    },
  ],
}

export const useTickets = (active: boolean) => {
  const options = useMemo(
    () =>
      queryOptions({
        queryKey: ['tickets', active ? 'active' : 'past'],
        // queryFn: () => clientApi.ticketsControllerTicketsGetMany(active),
        queryFn: () => ({ data: TEST_TICKETS }),
        select: (data) => data.data,
      }),
    [active],
  )

  const { data: ticketsData, isPending, isError, error } = useQuery(options)

  return { tickets: ticketsData?.tickets ?? null, isPending, isError, error }
}
