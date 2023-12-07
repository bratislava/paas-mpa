import { confirmSignIn, signIn, signOut, signUp } from 'aws-amplify/auth'
import { router } from 'expo-router'

import { useSnackbar } from '@/components/screen-layout/Snackbar/useSnackbar'
import { STATIC_TEMP_PASS } from '@/modules/cognito/amplify'
import { getCurrentAuthenticatedUser } from '@/modules/cognito/utils'
import { useAuthStoreUpdateContext } from '@/state/AuthStoreProvider/useAuthStoreUpdateContext'
import { GENERIC_ERROR_MESSAGE, isError, isErrorWithCode } from '@/utils/errors'

const SHOWN_ERROR_CODES = new Set(['NotAuthorizedException', 'CodeMismatchException'])

const STATIC_PHONE = '+42100000000'

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

  const onAuthStoreUpdate = useAuthStoreUpdateContext()

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const signInAndRedirectToConfirm = async (phone: string) => {
    const user = await getCurrentAuthenticatedUser()
    console.log('user', user)

    const { isSignedIn, nextStep } = await signIn({
      username: phone,
      ...(phone === STATIC_PHONE
        ? { options: { authFlowType: 'CUSTOM_WITHOUT_SRP' } }
        : { password: STATIC_TEMP_PASS }),
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

  const attemptSignInOrSignUp = async (phone: string) => {
    try {
      try {
        /* Try to sign in the user */
        await signInAndRedirectToConfirm(phone)
      } catch (error) {
        console.log('signInError', error, JSON.stringify(error))
        /* If sign in throws error, try to sign up */
        // TODO NotAuthorizedException is thrown not only for unregistered users
        if (
          typeof error === 'object' &&
          error !== null &&
          'name' in error &&
          typeof error.name === 'string' &&
          error.name === 'NotAuthorizedException'
        ) {
          const signUpOutput = await signUp({
            username: phone,
            password: STATIC_TEMP_PASS,
          })

          console.log('signUpOutput', signUpOutput)

          // if (signUpOutput.nextStep === 'DONE') {
          /* If sign didn't throw an error, try to immediately sign in */
          await signInAndRedirectToConfirm(phone)
          // }
        } else if (
          typeof error === 'object' &&
          error !== null &&
          'name' in error &&
          typeof error.name === 'string' &&
          error.name === 'UserAlreadyAuthenticatedException'
        ) {
          await signOut()
          onAuthStoreUpdate({ user: null })
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

  const attemptConfirmSignIn = async (code: string, phone: string) => {
    try {
      if (phone !== STATIC_PHONE) {
        await confirmSignIn({ challengeResponse: code })
      }

      /* If sign in didn't throw an error, set the user to context provider */
      const user = await getCurrentAuthenticatedUser()
      onAuthStoreUpdate({ user })

      router.replace('/')
    } catch (error) {
      // [NotAuthorizedException: Invalid session for the user, session is expired.]
      // [CodeMismatchException: Invalid code or auth state for the user.]
      if (isErrorWithCode(error) && SHOWN_ERROR_CODES.has(error.code)) {
        throw error
      }

      if (isError(error)) {
        // TODO translation
        console.log('Confirm Error', error, JSON.stringify(error))
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

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const resendConfirmationCode = async (phone: string) => {
    await signIn({
      username: phone,
      ...(phone === STATIC_PHONE
        ? { options: { authFlowType: 'CUSTOM_WITHOUT_SRP' } }
        : { password: STATIC_TEMP_PASS }),
    })
  }

  return {
    attemptSignInOrSignUp,
    attemptConfirmSignIn,
    resendConfirmationCode,
  }
}
