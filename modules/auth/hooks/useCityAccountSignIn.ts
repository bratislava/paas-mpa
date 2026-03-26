import { exchangeCodeAsync, makeRedirectUri, Prompt, useAuthRequest } from 'expo-auth-session'

import { environment } from '@/environment'
import {
  AUTH_SCOPES,
  discovery,
  useCityAccountAuthTokens,
} from '@/modules/auth/hooks/useCityAccountAuthTokens'

export const useCityAccountSignIn = () => {
  const [, setTokens] = useCityAccountAuthTokens()

  const redirectUri = makeRedirectUri({
    scheme: 'paasmpa',
    path: 'settings/notifications/city-account-login',
  })

  const [request, , promptAsync] = useAuthRequest(
    {
      clientId: environment.cityAccountOAuthClientId,
      scopes: AUTH_SCOPES,
      redirectUri,
      // prompt value is here to force user to login with credentials to get rid of the issue with multiple accounts on one device.
      prompt: Prompt.Login,
    },
    discovery,
  )

  // eslint-disable-next-line consistent-return
  const signIn = async () => {
    const codeResponse = await promptAsync()

    if (request && codeResponse?.type === 'success' && discovery) {
      const res = await exchangeCodeAsync(
        {
          clientId: environment.cityAccountOAuthClientId,
          scopes: [`api://${environment.cityAccountOAuthClientId}/user_auth`, ...AUTH_SCOPES],
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
  }

  return { isReady: !!request, signIn }
}
