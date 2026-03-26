import { fetchAuthSession, getCurrentUser, signIn } from 'aws-amplify/auth'
import { router } from 'expo-router'
import Exponea from 'react-native-exponea-sdk'

import { STATIC_TEMP_PASS } from '@/modules/cognito/amplify'

export const STATIC_PHONE = '+42100000000'

/**
 * Docs: https://docs.amplify.aws/react-native/build-a-backend/auth/manage-user-session/#retrieve-a-user-session
 */
export const getAccessToken = async () => {
  try {
    const session = await fetchAuthSession()
    const { accessToken } = session.tokens ?? {}

    if (!accessToken) {
      throw new Error('no jwt token found in current session')
    }

    return accessToken
  } catch (error) {
    console.log('error getting access token', error)

    return null
  }
}

/**
 * This helper function ignores error thrown by `getCurrentUser` when not authenticated
 * Docs: https://docs.amplify.aws/react-native/build-a-backend/auth/manage-user-session/#retrieve-your-current-authenticated-user
 */
export const getCurrentAuthenticatedUser = async () => {
  try {
    const user = await getCurrentUser()
    console.log(`The username: ${user.username}`)
    console.log(`The userId: ${user.userId}`)
    console.log(`The signInDetails:`, user.signInDetails)

    return user
  } catch (error) {
    return null
  }
}

export type SignInInput = {
  phone: string
  prefix: string
  token: string
  captchaErrorCode?: string
}

export const signInAndRedirectToConfirm = async ({
  phone,
  prefix,
  token,
  captchaErrorCode = '',
}: SignInInput) => {
  const { isSignedIn, nextStep } = await signIn({
    username: phone,
    ...(phone === STATIC_PHONE
      ? { options: { authFlowType: 'CUSTOM_WITHOUT_SRP' } }
      : {
          password: STATIC_TEMP_PASS,
          options: {
            clientMetadata: { token, captchaErrorCode, prefix },
          },
        }),
  })

  console.log('signInOutput', { isSignedIn, nextStep })
  if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE') {
    /* Sign in result is needed for `confirmSignIn` function */
    router.push({ pathname: '/confirm-sign-in', params: { phone } })
  }
  if (nextStep.signInStep === 'DONE') {
    router.push({ pathname: '/confirm-sign-in', params: { phone } })
  }
}

export const clearExponea = async () => {
  const isConfigured = await Exponea.isConfigured()
  if (!isConfigured) {
    return
  }
  try {
    await Exponea.stopIntegration()
    await Exponea.clearLocalCustomerData()
  } catch (error) {
    console.log('error clearing exponea', error)
  }
}
