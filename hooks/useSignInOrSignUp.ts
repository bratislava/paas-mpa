import { Auth } from 'aws-amplify'
import { router } from 'expo-router'

import { STATIC_TEMP_PASS } from '@/modules/cognito/amplify'
import { useGlobalStoreContext } from '@/state/GlobalStoreProvider/useGlobalStoreContext'
import { GENERIC_ERROR_MESSAGE, isError, isErrorWithCode } from '@/utils/errors'

export const useSignInOrSignUp = () => {
  const { setSignInResult, setSignUpPhone } = useGlobalStoreContext()

  const attemptSignInOrSignUp = async (phone: string) => {
    try {
      try {
        const loginResultInner = await Auth.signIn(phone, STATIC_TEMP_PASS)
        if (loginResultInner) {
          setSignInResult(loginResultInner)
          router.push('/confirm-signin')
        }
      } catch (error) {
        if (
          isError(error) &&
          isErrorWithCode(error) &&
          error.code === 'UserNotConfirmedException'
        ) {
          console.log('UserNotConfirmedException')
          // TODO @mpinter investigate autoSignIn after resendSignUp
          setSignUpPhone(phone)
          await Auth.resendSignUp(phone)
          router.push({ pathname: '/confirm-signup' })
        } else {
          // TODO @mpinter only sing up on some errors, not on all, throw the rest
          console.log('Other errors - TODO chose which to handle and which to throw.')

          setSignUpPhone(phone)
          await Auth.signUp({
            username: phone,
            password: STATIC_TEMP_PASS,
            // autoSignIn: {
            //   enabled: true,
            // },
          })
          router.push({ pathname: '/confirm-signup' })
        }
      }
    } catch (error) {
      if (isError(error)) {
        console.error(`Login Error:`, error)
      } else {
        console.error(`${GENERIC_ERROR_MESSAGE} - unexpected object thrown in signUp:`, error)
      }
    }
  }

  return { attemptSignInOrSignUp }
}
