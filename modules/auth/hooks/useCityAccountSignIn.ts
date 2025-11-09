import { exchangeCodeAsync, makeRedirectUri, Prompt, useAuthRequest } from 'expo-auth-session'

import {
  AUTH_SCOPES,
  discovery,
  useCityAccountAuthTokens,
} from '@/modules/auth/hooks/useCityAccountAuthTokens'
import { environment } from '@/environment'

export const useCityAccountSignIn = () => {
  const [, setTokens] = useCityAccountAuthTokens()

  const redirectUri = makeRedirectUri({
    scheme: 'paasmpa',
    path: 'settings/notifications/city-account-login',
  })

  const [request, , promptAsync] = useAuthRequest(
    {
      clientId: environment.cityAccountCognitoClientId,
      scopes: AUTH_SCOPES,
      redirectUri,
      // prompt value is here to force user to login with credentials to get rid of the issue with multiple accounts on one device.
      prompt: Prompt.Login,
    },
    discovery,
  )

  const signIn = async () => {
    try {
      const codeResponse = await promptAsync()

      if (request && codeResponse?.type === 'success' && discovery) {
        const res = await exchangeCodeAsync(
          {
            clientId: environment.cityAccountCognitoClientId,
            scopes: [`api://${environment.cityAccountCognitoClientId}/user_auth`, ...AUTH_SCOPES],
            code: codeResponse.params.code,
            extraParams: request.codeVerifier
              ? {
                  code_verifier: request.codeVerifier,
                }
              : undefined,
            redirectUri,
          },
          discovery,
        )

        if (res.accessToken) {
          setTokens(res)

          return res
        }
      }
    } catch (error) {
      console.error('Error during City Account sign-in:', error)
      throw error
    }
  }

  return { isReady: !!request, signIn }
}
