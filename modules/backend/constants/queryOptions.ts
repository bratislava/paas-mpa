import { keepPreviousData, queryOptions } from '@tanstack/react-query'

import { clientApi } from '@/modules/backend/client-api'
import { GetTicketPriceRequestDto, ParkingCardDto } from '@/modules/backend/openapi-generated'
import { NormalizedUdrZone } from '@/modules/map/types'

type PaginationOptions = {
  page?: number
  pageSize?: number
}

export const notificationSettingsOptions = () =>
  queryOptions({
    queryKey: ['NotificationSetting'],
    queryFn: () => clientApi.usersControllerGetUserSettings(),
    select: (data) => data.data,
  })

export const ticketsOptions = ({ active }: { active: boolean } & PaginationOptions) =>
  queryOptions({
    queryKey: ['Tickets', active ? 'active' : 'past'],
    queryFn: () => clientApi.ticketsControllerTicketsGetMany(active),
    select: (data) => data.data,
  })

export const parkingCardsOptions = ({
  email,
  page = 1,
  pageSize = 10,
}: { email: string | undefined } & PaginationOptions) =>
  queryOptions({
    queryKey: ['ParkingCardsActive', email],
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

export const ticketPriceOptions = ({
  udr,
  licencePlate,
  duration,
  npk,
  requestBody,
}: {
  udr: NormalizedUdrZone | null
  licencePlate: string
  duration: number
  npk: ParkingCardDto | null
  requestBody: GetTicketPriceRequestDto
}) =>
  queryOptions({
    queryKey: ['TicketPrice', udr, licencePlate, duration, npk],
    queryFn: () => clientApi.ticketsControllerGetTicketPrice(requestBody),
    select: (res) => res.data,
    // https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5#removed-keeppreviousdata-in-favor-of-placeholderdata-identity-function
    placeholderData: keepPreviousData,
    enabled: !!udr && !!licencePlate && !!duration,
  })

export const visitorCardsOptions = () =>
  queryOptions({
    queryKey: ['VisitorCards'],
    queryFn: () => clientApi.parkingCardsControllerGetActiveVisitorCards(),
    select: (res) => res.data,
  })
