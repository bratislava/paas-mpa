import { SERVICEERROR } from '@/modules/backend/openapi-generated'
import { isError } from '@/utils/errors'

type ValueOf<T> = T[keyof T]

type ServiceErrorValues = ValueOf<typeof SERVICEERROR>

export class ServiceError extends Error {
  errorName: ServiceErrorValues

  constructor(message: string, errorName: ServiceErrorValues) {
    super(message)
    this.errorName = errorName
  }
}

export const isServiceError = (error: unknown): error is { errorName: ServiceErrorValues } => {
  return (
    isError(error) &&
    'errorName' in error &&
    typeof error.errorName === 'string' &&
    (Object.values(SERVICEERROR) as string[]).includes(error.errorName)
  )
}
