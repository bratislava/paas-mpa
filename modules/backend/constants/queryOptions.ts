import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query'

import { CardFilter, ValidityKey } from '@/components/parking-cards/ParkingCardsFilter'
import { clientApi } from '@/modules/backend/client-api'
import {
  GetTicketPriceRequestDto,
  GetTicketProlongationPriceRequestDto,
} from '@/modules/backend/openapi-generated'
import { nextPageParam } from '@/modules/backend/utils/nextPageParam'
import { FilterTimeframesEnum } from '@/state/TicketsFiltersStoreProvider/TicketsFiltersStoreProvider'

type PaginationOptions = {
  page?: number
  pageSize?: number
}

type PageSize = {
  pageSize?: number
}

export const settingsOptions = () =>
  queryOptions({
    queryKey: ['Settings'],
    queryFn: () => clientApi.usersControllerGetUserSettings(),
  })

export const activeTicketsOptions = () =>
  queryOptions({
    // Using the same queryKey shape as in ticketsInfiniteQuery
    queryKey: ['Tickets', { isActive: true }],
    queryFn: () =>
      clientApi.ticketsControllerTicketsGetMany(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        new Date().toISOString(),
      ),
    select: (data) => data.data,
  })

/*
 * The parameters parkingStartFrom, parkingStartTo, parkingEndFrom, parkingEndTo are not included in the queryKey, because it causes infinite refresh loop
 *   - TODO investigate why
 *
 * IMPORTANT - query should therefore invalidated manually whenever needed
 */
export const ticketsInfiniteQuery = (
  options?: {
    isActive?: boolean
    timeframe?: FilterTimeframesEnum
    ecvs?: string[]
    parkingStartFrom?: Date
    parkingStartTo?: Date
    parkingEndFrom?: Date
    parkingEndTo?: Date
  } & PageSize,
) => {
  const {
    isActive,
    timeframe,
    ecvs,
    parkingStartFrom,
    parkingStartTo,
    parkingEndFrom,
    parkingEndTo,
    pageSize,
  } = options ?? {}

  return infiniteQueryOptions({
    // Using the same queryKey shape as in activeTicketsOptions
    queryKey: ['Tickets', { isActive, timeframe, ecvs: ecvs?.join(','), pageSize }],
    queryFn: ({ pageParam }) => {
      return clientApi.ticketsControllerTicketsGetMany(
        pageParam,
        pageSize,
        ecvs?.join(','),
        parkingStartFrom?.toISOString(),
        parkingStartTo?.toISOString(),
        parkingEndFrom?.toISOString(),
        parkingEndTo?.toISOString(),
      )
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => nextPageParam(lastPage.data.paginationInfo),
  })
}

export const parkingCardsInfiniteOptions = (
  options: {
    email: string | undefined
    validityKey: ValidityKey
  } & PaginationOptions,
) => {
  const { email, pageSize, validityKey } = options

  // This constant needs to be inside the function so the dates are always fresh
  const VALIDITY_FILTERS: Record<ValidityKey, CardFilter> = {
    all: {},
    actual: {
      validFromTo: new Date(),
      validToFrom: new Date(),
    },
    expired: {
      validToTo: new Date(),
    },
    future: {
      validFromFrom: new Date(),
    },
  }

  const { validFromFrom, validFromTo, validToFrom, validToTo } = VALIDITY_FILTERS[validityKey]

  return infiniteQueryOptions({
    queryKey: ['ParkingCardsInfinite', email, pageSize, validityKey],
    enabled: !!email,
    queryFn: ({ pageParam }) =>
      clientApi.parkingCardsControllerGetParkingCards(
        email!,
        pageParam,
        pageSize,
        validFromFrom?.toISOString(),
        validFromTo?.toISOString(),
        validToFrom?.toISOString(),
        validToTo?.toISOString(),
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => nextPageParam(lastPage.data.paginationInfo),
  })
}

export const verifiedEmailsInfiniteOptions = (options?: PageSize) => {
  const { pageSize } = options ?? {}

  return infiniteQueryOptions({
    queryKey: ['VerifiedEmailsInfinite', pageSize],
    queryFn: ({ pageParam }) =>
      clientApi.verifiedEmailsControllerVerifiedEmailsGetMany(pageParam, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => nextPageParam(lastPage.data.paginationInfo),
  })
}

export const ticketPriceOptions = (body: GetTicketPriceRequestDto) =>
  queryOptions({
    queryKey: [
      'TicketPrice',
      body.ticket.udr,
      body.ticket.ecv,
      body.ticket.parkingEnd,
      body.npkId,
      body.ticket.udrUuid,
      body.ticket.parkingStart,
    ],
    queryFn: () => clientApi.ticketsControllerGetTicketPrice(body),
    select: (res) => res.data,
    // https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5#removed-keeppreviousdata-in-favor-of-placeholderdata-identity-function
    placeholderData: keepPreviousData,
    refetchInterval: 1000 * 60,
    enabled: !!body.ticket.udr && !!body.ticket.ecv && !!body.ticket.parkingEnd,
  })

export const getTicketOptions = (ticketId?: number) =>
  queryOptions({
    queryKey: ['Ticket', ticketId],
    queryFn: () => clientApi.ticketsControllerTicketsGetOne(ticketId!),
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

export const ticketProlongationPriceOptions = (body: GetTicketProlongationPriceRequestDto) =>
  queryOptions({
    queryKey: ['TicketProlongationPrice', body.ticketId, body.newParkingEnd],
    queryFn: () => clientApi.ticketsControllerGetTicketProlongationPrice(body),
    select: (res) => res.data,
    placeholderData: keepPreviousData,
    enabled: !!body.ticketId,
  })

export const vehiclesInfiniteOptions = () =>
  infiniteQueryOptions({
    queryKey: ['Vehicles'],
    queryFn: ({ pageParam }) => clientApi.vehiclesControllerVehiclesGetMany(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => nextPageParam(lastPage.data.paginationInfo),
  })

export const mobileAppVersionOptions = () =>
  queryOptions({
    queryKey: ['MobileVersion'],
    queryFn: () => clientApi.systemControllerGetMobileAppVersion(),
    select: (res) => res.data,
  })

export const verifiedEmailsLengthOptions = ({ enabled }: { enabled?: boolean }) => {
  return queryOptions({
    queryKey: ['VerifiedEmailsLength'],
    enabled,
    queryFn: () => clientApi.verifiedEmailsControllerVerifiedEmailsGetMany(),
    select: (res) => res.data,
  })
}
export const storedPaymentMethodOptions = () => {
  return queryOptions({
    queryKey: ['StoredPaymentMethod'],
    queryFn: () => clientApi.ticketsControllerGetStoredPaymentMethodAvailability(),
    select: (res) => res.data,
  })
}
