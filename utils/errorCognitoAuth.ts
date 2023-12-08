import { isError } from '@/utils/errors'

export class ErrorWithName extends Error {
  name: string

  constructor(message: string, name: string) {
    super(message)
    this.name = name
  }
}

export const isErrorWithName = (error: unknown): error is ErrorWithName =>
  isError(error) && 'name' in error && typeof error.name === 'string'
