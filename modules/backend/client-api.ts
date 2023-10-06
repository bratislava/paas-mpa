import { axiosInstance } from './axios-instance'
import {
  Configuration,
  DefaultApiFactory,
  SystemApiFactory,
  TicketsApiFactory,
  UserApiFactory,
  VehiclesApiFactory,
  VerifiedEmailsApiFactory,
  VisitorCardsApiFactory,
} from './openapi-generated'

export const apiUrl = 'https://paas-mpa-backend.dev.bratislava.sk' // TODO move to env

const args = [{} as Configuration, apiUrl, axiosInstance] as const

export const clientApi = {
  ...DefaultApiFactory(...args),
  ...UserApiFactory(...args),
  ...TicketsApiFactory(...args),
  ...VehiclesApiFactory(...args),
  ...SystemApiFactory(...args),
  ...VisitorCardsApiFactory(...args),
  ...VerifiedEmailsApiFactory(...args),
}
