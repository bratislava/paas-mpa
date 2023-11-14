import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query'

import { clientApi } from '@/modules/backend/client-api'
import { GetTicketPriceRequestDto, ParkingCardDto } from '@/modules/backend/openapi-generated'
import { NormalizedUdrZone } from '@/modules/map/types'

type PaginationOptions = {
  page?: number
  pageSize?: number
}

const getNextPageParam = (lastPage: {
  paginationInfo: { currentPage: number; pageSize: number; total: number }
}) => {
  const { paginationInfo } = lastPage
  // TODO: remove quick fix, currentPage and pageSize are strings
  const currentPage = Number.parseInt(paginationInfo.currentPage as unknown as string, 10)
  const pageSize = Number.parseInt(paginationInfo.pageSize as unknown as string, 10)
  const total = Number.parseInt(paginationInfo.total as unknown as string, 10)

  return currentPage < total / pageSize ? currentPage + 1 : null
}

export const notificationSettingsOptions = () =>
  queryOptions({
    queryKey: ['NotificationSetting'],
    queryFn: () => clientApi.usersControllerGetUserSettings(),
    select: (data) => data.data,
  })

export const ticketsOptions = ({
  active,
  page = 1,
  pageSize = 1,
}: { active: boolean } & PaginationOptions) =>
  queryOptions({
    queryKey: ['Tickets', active ? 'active' : 'past', page, pageSize],
    queryFn: () => clientApi.ticketsControllerTicketsGetMany(active, page, pageSize),
    select: (data) => data.data,
  })

export const ticketsInfiniteOptions = ({
  active,
  pageSize = 10,
}: {
  active: boolean
  pageSize?: number
}) =>
  infiniteQueryOptions({
    queryKey: ['Tickets', active ? 'active' : 'past', 'infinite', pageSize],
    queryFn: async ({ pageParam }) => {
      const response = await clientApi.ticketsControllerTicketsGetMany(active, pageParam, pageSize)

      return response.data
    },
    select: (data) => data.pages,
    getNextPageParam,
    initialPageParam: 1,
  })

export const parkingCardsOptions = ({
  email,
  page = 1,
  pageSize = 10,
}: { email: string | undefined } & PaginationOptions) =>
  queryOptions({
    queryKey: ['ParkingCardsActive', email, page, pageSize],
    enabled: !!email,
    queryFn: () => clientApi.parkingCardsControllerGetParkingCards(email!, page, pageSize),
    select: (res) => res.data,
  })

export const verifiedEmailsOptions = ({
  page = 1,
  pageSize = 10,
}: PaginationOptions | undefined = {}) =>
  queryOptions({
    queryKey: ['VerifiedEmails'],
    queryFn: () => clientApi.verifiedEmailsControllerVerifiedEmailsGetMany(page, pageSize),
    select: (res) => res.data,
  })

export const ticketPriceOptions = (
  body: GetTicketPriceRequestDto,
  {
    udr,
    licencePlate,
    duration,
    npk,
  }: {
    udr: NormalizedUdrZone | null
    licencePlate: string
    duration: number
    npk: ParkingCardDto | null
  },
) =>
  queryOptions({
    queryKey: ['TicketPrice', udr, licencePlate, duration, npk],
    queryFn: () => clientApi.ticketsControllerGetTicketPrice(body),
    select: (res) => res.data,
    // https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5#removed-keeppreviousdata-in-favor-of-placeholderdata-identity-function
    placeholderData: keepPreviousData,
    enabled: !!udr && !!licencePlate && !!duration,
  })

export const getTicketOptions = (ticketId: number) =>
  queryOptions({
    queryKey: ['ticket', ticketId],
    queryFn: () => clientApi.ticketsControllerTicketsGetOne(ticketId),
    select: (res) => res.data,
    enabled: !!ticketId,
  })

export const visitorCardsOptions = () =>
  queryOptions({
    queryKey: ['VisitorCards'],
    queryFn: () => clientApi.parkingCardsControllerGetActiveVisitorCards(),
    select: (res) => res.data,
  })

export const announcementsOptions = (
  language: string,
  { page, pageSize }: PaginationOptions | undefined = {},
) =>
  queryOptions({
    queryKey: ['Announcements'],
    queryFn: () => clientApi.announcementsControllerAnnouncementsGetMany(language, page, pageSize),
    select: (res) => res.data,
    // TODO: remove this when the backend has test announcements data
    enabled: false,
  })
