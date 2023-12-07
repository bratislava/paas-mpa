export class CognitoAuthError extends Error {
  name: string

  constructor(message: string, name: string) {
    super(message)
    this.name = name
  }
}

export const isErrorWithName = (error: unknown): error is CognitoAuthError =>
  typeof error === 'object' && error !== null && 'name' in error && typeof error.name === 'string'
