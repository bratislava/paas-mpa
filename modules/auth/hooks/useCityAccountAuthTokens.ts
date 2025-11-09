import { TokenResponse } from 'expo-auth-session'
import { useMMKVObject } from 'react-native-mmkv'

import { environment } from '@/environment'

export const AUTHENTICATION_TOKENS_KEY = 'authentication_tokens'
export const AUTH_SCOPES = ['user.read', 'offline_access']

const baseOauth2Url = `${environment.cityAccountApiUrl}/oauth2`

export const discovery = {
  authorizationEndpoint: `${baseOauth2Url}/authorize`,
  tokenEndpoint: `${baseOauth2Url}/token`,
}

export const useCityAccountAuthTokens = () =>
  useMMKVObject<TokenResponse | null>(AUTHENTICATION_TOKENS_KEY)
