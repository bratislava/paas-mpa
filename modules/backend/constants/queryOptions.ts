import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query'

import { clientApi } from '@/modules/backend/client-api'
import { GetTicketPriceRequestDto, ParkingCardDto } from '@/modules/backend/openapi-generated'
import { NormalizedUdrZone } from '@/modules/map/types'

type PaginationOptions = {
  page?: number
  pageSize?: number
}

type PageSize = {
  pageSize?: number
}

export const notificationSettingsOptions = () =>
  queryOptions({
    queryKey: ['NotificationSetting'],
    queryFn: () => clientApi.usersControllerGetUserSettings(),
    select: (data) => data.data,
  })

export const ticketsOptions = ({
  ecv,
  parkingStartFrom,
  parkingStartTo,
  parkingEndFrom,
  parkingEndTo,
  page,
  pageSize,
}: {
  ecv?: string
  parkingStartFrom?: string
  parkingStartTo?: string
  parkingEndFrom?: string
  parkingEndTo?: string
} & PaginationOptions) =>
  queryOptions({
    queryKey: [
      'Tickets',
      ecv,
      parkingStartFrom,
      parkingStartTo,
      parkingEndFrom,
      parkingEndTo,
      page,
      pageSize,
    ],
    queryFn: () =>
      clientApi.ticketsControllerTicketsGetMany(
        page,
        pageSize,
        ecv,
        parkingStartFrom,
        parkingStartTo,
        parkingEndFrom,
        parkingEndTo,
      ),
    select: (data) => data.data,
  })

export const ticketsInfiniteQuery = (
  options?: {
    ecv?: string
    parkingStartFrom?: string
    parkingStartTo?: string
    parkingEndFrom?: string
    parkingEndTo?: string
  } & PageSize,
) => {
  const { ecv, parkingStartFrom, parkingStartTo, parkingEndFrom, parkingEndTo, pageSize } =
    options ?? {}

  return infiniteQueryOptions({
    queryKey: [
      'Tickets',
      ecv,
      parkingStartFrom,
      parkingStartTo,
      parkingEndFrom,
      parkingEndTo,
      pageSize,
    ],
    queryFn: ({ pageParam }) =>
      clientApi.ticketsControllerTicketsGetMany(
        pageParam,
        pageSize,
        ecv,
        parkingStartFrom,
        parkingStartTo,
        parkingEndFrom,
        parkingEndTo,
      ),
    initialPageParam: 1,
    // TODO remove ts-ignore when types are fixed
    getNextPageParam: (lastPage) => {
      // @ts-ignore
      const currentPage = parseInt(lastPage.data.paginationInfo.currentPage, 10)
      // @ts-ignore
      const total = parseInt(lastPage.data.paginationInfo.total, 10)

      return currentPage < total ? currentPage + 1 : undefined // If there is not a next page, getNextPageParam will return undefined and the hasNextPage boolean will be set to 'false'
    },
  })
}

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

export const verifiedEmailsOptions = ({ page, pageSize }: PaginationOptions | undefined = {}) =>
  queryOptions({
    queryKey: ['VerifiedEmails', page, pageSize],
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
