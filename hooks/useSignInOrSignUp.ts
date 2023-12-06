import { Auth } from 'aws-amplify'
import { router } from 'expo-router'

import { useSnackbar } from '@/components/screen-layout/Snackbar/useSnackbar'
import { STATIC_TEMP_PASS } from '@/modules/cognito/amplify'
import { useAuthStoreContext } from '@/state/AuthStoreProvider/useAuthStoreContext'
import { useAuthStoreUpdateContext } from '@/state/AuthStoreProvider/useAuthStoreUpdateContext'
import { GENERIC_ERROR_MESSAGE, isError, isErrorWithCode } from '@/utils/errors'

const SHOWN_ERROR_CODES = new Set(['NotAuthorizedException', 'CodeMismatchException'])

/**
 * This hook is used to sign in user. If the user is not registered (it's the first time they entered their phone number),
 * we register them (sign up) and then we automatically fire sign in.
 *
 * Sign up is straightforward, user is auto-verified during sign up process.
 * Custom lambda function is used in "Pre Sign Up Trigger" - see Cognito console.
 *
 * We use MFA (multi-factor authentication) to verify the user on each sing in - verification code is sent in SMS.
 *
 * User's phone number is automatically verified during first sign in.
 * --> We can distinguish users that didn't finish the sign-up process (they entered the phone number, but never signed in)
 * by checking if their phone number is verified.
 *
 */
// TODO add explanation to comments
export const useSignInOrSignUp = () => {
  const snackbar = useSnackbar()

  const { signInResult } = useAuthStoreContext()
  const onAuthStoreUpdate = useAuthStoreUpdateContext()

  const signInAndRedirectToConfirm = async (phone: string) => {
    const signInResultInner = await Auth.signIn(phone, STATIC_TEMP_PASS)

    if (signInResultInner) {
      /* Sign in result is needed for `confirmSignIn` function */
      onAuthStoreUpdate({ signInResult: signInResultInner })

      router.push({ pathname: '/confirm-sign-in', params: { phone } })
    }
  }

  const attemptSignInOrSignUp = async (phone: string) => {
    try {
      try {
        /* Try to sign in the user */
        await signInAndRedirectToConfirm(phone)
      } catch (error) {
        /* If sign in throws error, try to sign up */
        // TODO NotAuthorizedException is thrown not only for unregistered users
        if (isErrorWithCode(error) && error.code === 'NotAuthorizedException') {
          await Auth.signUp({
            username: phone,
            password: STATIC_TEMP_PASS,
          })

          /* If sign didn't throw an error, try to immediately sign in */
          await signInAndRedirectToConfirm(phone)
        } else {
          throw error
        }
      }
    } catch (error) {
      if (isError(error)) {
        // TODO translation
        console.error(`Login Error:`, error)
        snackbar.show(`Login Error: ${error.message}`, { variant: 'danger' })
      } else {
        // TODO translation
        console.error(`${GENERIC_ERROR_MESSAGE} - unexpected object thrown in signUp:`, error)
        snackbar.show(`${GENERIC_ERROR_MESSAGE} - unexpected object thrown in signUp.`, {
          variant: 'danger',
        })
      }
    }
  }

  const confirmSignIn = async (code: string) => {
    try {
      if (signInResult) {
        await Auth.confirmSignIn(signInResult, code)
        /* If sign in didn't throw an error, set the user to context provider */
        onAuthStoreUpdate({ signInResult: null, user: signInResult })
        router.replace('/')
      } else {
        // TODO translation
        console.log('Unexpected error, no loginResult provided in AuthStore.')
      }
    } catch (error) {
      // [NotAuthorizedException: Invalid session for the user, session is expired.]
      // [CodeMismatchException: Invalid code or auth state for the user.]
      if (isErrorWithCode(error) && SHOWN_ERROR_CODES.has(error.code)) {
        throw error
      }

      if (isError(error)) {
        // TODO translation
        console.log('Confirm Error', error)
        snackbar.show(`Confirm Error: ${error.message}`, { variant: 'danger' })
      } else {
        // TODO translation
        snackbar.show(`${GENERIC_ERROR_MESSAGE} - unexpected object thrown in confirmSignIn.`, {
          variant: 'danger',
        })
        // TODO translation
        console.log(`${GENERIC_ERROR_MESSAGE} - unexpected object thrown in confirmSignIn:`, error)
      }
    }
  }

  const resendConfirmationCode = async (phone: string) => {
    const signInResultInner = await Auth.signIn(phone, STATIC_TEMP_PASS)

    if (signInResultInner) {
      /* Sign in result is needed for `confirmSignIn` function */
      onAuthStoreUpdate({ signInResult: signInResultInner })
    }
  }

  return { attemptSignInOrSignUp, confirmSignIn, resendConfirmationCode }
}
