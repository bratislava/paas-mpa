import { refreshAsync, TokenResponse } from 'expo-auth-session'
import { jwtDecode } from 'jwt-decode'

import { AUTH_SCOPES, discovery } from '@/modules/auth/hooks/useCityAccountAuthTokens'

type User = {
  name: string
  email: string
  roles: string[]
}

const clientId = '3ei88tn1gkvhfqpfckkd6plopr'

export const getUserFromTokens = (tokens: TokenResponse): User => {
  const { accessToken } = tokens

  const accessTokenUser: {
    name: string
    // eslint-disable-next-line babel/camelcase
    preferred_username: string
    roles: string[]
  } = jwtDecode(accessToken)

  return {
    name: accessTokenUser.name,
    email: accessTokenUser.preferred_username,
    roles: accessTokenUser.roles || [],
  }
}

/**
 * Refreshes the access token using the refresh token with OAuth2
 */
export const refreshToken = async (tokens: TokenResponse) => {
  if (tokens?.refreshToken) {
    const refreshedTokens = await refreshAsync(
      {
        refreshToken: tokens.refreshToken,
        clientId,
        scopes: [`api://${clientId}/user_auth`, ...AUTH_SCOPES],
      },
      discovery,
    )
    if (refreshedTokens) {
      return { refreshedTokens }
    }
  }

  return null
}
