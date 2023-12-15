import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query'

import { clientApi } from '@/modules/backend/client-api'
import {
  GetTicketPriceRequestDto,
  GetTicketProlongationPriceRequestDto,
  ParkingCardDto,
} from '@/modules/backend/openapi-generated'
import { nextPageParam } from '@/modules/backend/utils/nextPageParam'
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

export const ticketsCountOptions = ({
  parkingEndFrom,
}: {
  parkingEndFrom?: string
} & PaginationOptions) =>
  queryOptions({
    queryKey: ['Tickets'],
    queryFn: () =>
      clientApi.ticketsControllerTicketsGetMany(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        parkingEndFrom,
      ),
    select: (data) => data.data,
  })

export const ticketsInfiniteQuery = (
  options?: {
    ecv?: string
    parkingStartFrom?: Date
    parkingStartTo?: Date
    parkingEndFrom?: Date
    parkingEndTo?: Date
    isActive?: boolean
  } & PageSize,
) => {
  const {
    ecv,
    parkingStartFrom,
    parkingStartTo,
    parkingEndFrom,
    parkingEndTo,
    pageSize,
    isActive,
  } = options ?? {}

  return infiniteQueryOptions({
    queryKey: [
      'Tickets',
      ecv,
      parkingStartFrom?.toISOString(),
      parkingStartTo?.toISOString(),
      // if isActive is true, parkingEndShould be the current datetime and it changes with every second, so the query keeps refetching
      isActive ? null : parkingEndFrom?.toISOString(),
      parkingEndTo?.toISOString(),
      pageSize,
    ],
    queryFn: ({ pageParam }) =>
      clientApi.ticketsControllerTicketsGetMany(
        pageParam,
        pageSize,
        ecv,
        parkingStartFrom?.toISOString(),
        parkingStartTo?.toISOString(),
        parkingEndFrom?.toISOString(),
        parkingEndTo?.toISOString(),
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => nextPageParam(lastPage.data.paginationInfo),
  })
}

export const parkingCardsInfiniteOptions = (
  options?: { email: string | undefined } & PaginationOptions,
) => {
  const { email, pageSize } = options ?? {}

  return infiniteQueryOptions({
    queryKey: ['ParkingCardsInfinite', email, pageSize],
    enabled: !!email,
    queryFn: ({ pageParam }) =>
      clientApi.parkingCardsControllerGetParkingCards(email!, pageParam, pageSize),
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

export const getTicketOptions = (ticketId?: number) =>
  queryOptions({
    queryKey: ['ticket', ticketId],
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

export const vehiclesOptions = () =>
  queryOptions({
    queryKey: ['Vehicles'],
    queryFn: () => clientApi.vehiclesControllerVehiclesGetMany(),
  })
