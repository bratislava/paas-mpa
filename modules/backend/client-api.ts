import { environment } from '@/environment'

import { axiosInstance } from './axios-instance'
import {
  AnnouncementsApiFactory,
  Configuration,
  DefaultApiFactory,
  FeedbackFormsApiFactory,
  MobileDevicesApiFactory,
  ParkingCardsApiFactory,
  SystemApiFactory,
  TicketsApiFactory,
  UserApiFactory,
  VehiclesApiFactory,
  VerifiedEmailsApiFactory,
} from './openapi-generated'

const args = [{} as Configuration, environment.apiUrl, axiosInstance] as const

export const clientApi = {
  ...DefaultApiFactory(...args),
  ...UserApiFactory(...args),
  ...TicketsApiFactory(...args),
  ...VehiclesApiFactory(...args),
  ...SystemApiFactory(...args),
  ...ParkingCardsApiFactory(...args),
  ...VerifiedEmailsApiFactory(...args),
  ...AnnouncementsApiFactory(...args),
  ...MobileDevicesApiFactory(...args),
  ...FeedbackFormsApiFactory(...args),
}
