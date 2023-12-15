import { PRICINGAPIERROR } from '@/modules/backend/openapi-generated'
import { isError } from '@/utils/errors'

export class PricingApiError extends Error {
  status: PRICINGAPIERROR

  constructor(message: string, status: PRICINGAPIERROR) {
    super(message)
    this.status = status
  }
}

export const isPricingApiError = (error: unknown): error is PricingApiError =>
  isError(error) &&
  'errorName' in error &&
  'status' in error &&
  typeof error.status === 'string' &&
  error.status in PRICINGAPIERROR
