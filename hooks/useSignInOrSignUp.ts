import { Auth } from 'aws-amplify'
import { router } from 'expo-router'

import { useSnackbar } from '@/components/screen-layout/Snackbar/useSnackbar'
import { STATIC_TEMP_PASS } from '@/modules/cognito/amplify'
import { useGlobalStoreContext } from '@/state/GlobalStoreProvider/useGlobalStoreContext'
import { GENERIC_ERROR_MESSAGE, isError, isErrorWithCode } from '@/utils/errors'

export const useSignInOrSignUp = () => {
  const snackbar = useSnackbar()

  const { signInResult, setSignInResult } = useGlobalStoreContext()

  const signInAndRedirectToConfirm = async (phone: string) => {
    const signInResultInner = await Auth.signIn(phone, STATIC_TEMP_PASS)

    if (signInResultInner) {
      setSignInResult(signInResultInner)
      router.push('/confirm-signin')
    }
  }

  const attemptSignInOrSignUp = async (phone: string) => {
    try {
      try {
        await signInAndRedirectToConfirm(phone)
      } catch (error) {
        // TODO NotAuthorizedException is thrown not only for unregistered users
        if (isErrorWithCode(error) && error.code === 'NotAuthorizedException') {
          await Auth.signUp({
            username: phone,
            password: STATIC_TEMP_PASS,
          })

          await signInAndRedirectToConfirm(phone)
        } else {
          throw error
        }
      }
    } catch (error) {
      if (isError(error)) {
        console.error(`Login Error:`, error)
        snackbar.show(`Login Error: ${error.message}`, { variant: 'danger' })
      } else {
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
        setSignInResult(null)
        router.push('/')
      } else {
        console.log('Unexpected error, no loginResult provided in GlobalStore.')
      }
    } catch (error) {
      // TODO
      // [NotAuthorizedException: Invalid session for the user, session is expired.]
      // [CodeMismatchException: Invalid code or auth state for the user.]
      if (isErrorWithCode(error) && error.code === 'CodeMismatchException') {
        console.log('Code mismatch', error)
        snackbar.show(`Code mismatch: ${error.message}`, { variant: 'warning' })
      } else if (isError(error)) {
        console.log('Confirm Error', error)
        snackbar.show(`Confirm Error: ${error.message}`, { variant: 'danger' })
      } else {
        snackbar.show(`${GENERIC_ERROR_MESSAGE} - unexpected object thrown in confirmSignIn.`, {
          variant: 'danger',
        })

        console.log(`${GENERIC_ERROR_MESSAGE} - unexpected object thrown in confirmSignIn:`, error)
      }
    }
  }

  return { attemptSignInOrSignUp, confirmSignIn }
}
