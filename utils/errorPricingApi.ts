import { PRICINGAPIERROR } from '@/modules/backend/openapi-generated'
import { isError } from '@/utils/errors'

export class PricingApiError extends Error {
  errorName: PRICINGAPIERROR

  constructor(message: string, errorName: PRICINGAPIERROR) {
    super(message)
    this.errorName = errorName
  }
}

export const isPricingApiError = (error: unknown): error is PricingApiError =>
  isError(error) &&
  'errorName' in error &&
  typeof error.errorName === 'string' &&
  error.errorName in PRICINGAPIERROR
