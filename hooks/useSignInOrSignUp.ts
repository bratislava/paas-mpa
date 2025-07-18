import { useMutation } from '@tanstack/react-query'
import { confirmSignIn, signIn, signOut, signUp } from 'aws-amplify/auth'
import * as Location from 'expo-location'
import { router } from 'expo-router'

import { useSnackbar } from '@/components/screen-layout/Snackbar/useSnackbar'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { SaveUserSettingsDto } from '@/modules/backend/openapi-generated'
import { STATIC_TEMP_PASS } from '@/modules/cognito/amplify'
import {
  getCurrentAuthenticatedUser,
  signInAndRedirectToConfirm,
  SignInInput,
  STATIC_PHONE,
} from '@/modules/cognito/utils'
import { useLocationPermission } from '@/modules/map/hooks/useLocationPermission'
import { useNotificationPermission } from '@/modules/map/hooks/useNotificationPermission'
import { useAuthStoreUpdateContext } from '@/state/AuthStoreProvider/useAuthStoreUpdateContext'
import { isErrorWithName } from '@/utils/errorCognitoAuth'
import { isError } from '@/utils/errors'
import { UnifiedPermissionStatus } from '@/utils/types'

import { useIsOnboardingFinished } from './useIsOnboardingFinished'

const CONFIRM_ERROR_CODES_TO_SHOW = new Set(['NotAuthorizedException', 'CodeMismatchException'])
const SIGNIN_ERROR_CODES_TO_SHOW = new Set(['InvalidParameterException'])

// TODO simplify, unify error handling, consider to move `useSignOut` to this file or move to /modules/cognito...
// TODO add static code verification for static phone

/**
 * This hook is used to sign up and sing in the user.
 *
 *
 * Sign up  process is straightforward.
 * If the user enters the phone number for the first time,
 * we register them (sign up) and then we automatically fire sign in.
 * In addition, we use custom lambda function to auto-verify the user during sing up process.
 * See Cognito "Pre Sign Up Trigger" for the custom lambda function.
 *
 * To sign in, we use MFA - verification code is sent in SMS.
 *
 * User's phone number is automatically verified during first sign in.
 * --> We can distinguish users that didn't finish the sign-up process (they entered the phone number, but never signed in)
 * by checking if their phone number is verified.
 *
 * In both cases, we use static password, because it is required by Cognito.
 *
 * Docs: https://docs.amplify.aws/react-native/build-a-backend/auth/
 * API: https://aws-amplify.github.io/amplify-js/api/globals.html
 */
export const useSignInOrSignUp = () => {
  const { t } = useTranslation()
  const snackbar = useSnackbar()

  const [isOnboardingFinished, setIsOnboardingFinished] = useIsOnboardingFinished()

  const { locationPermissionStatus } = useLocationPermission()
  const { notificationPermissionStatus, requestNotificationPermissionAndRegisterDevice } =
    useNotificationPermission()

  const { mutate: mutateSaveSetting } = useMutation({
    mutationFn: (body: SaveUserSettingsDto) => clientApi.usersControllerSaveUserSettings(body),
  })

  const updateAuthStore = useAuthStoreUpdateContext()

  const attemptSignInOrSignUp = async (signInInput: SignInInput) => {
    try {
      try {
        /** Try to sign in the user. Cognito will throw an error for non-registered user. */
        await signInAndRedirectToConfirm(signInInput)
      } catch (error) {
        // Expected error 'UserNotFoundException' means non-registered user
        if (isErrorWithName(error) && error.name === 'UserNotFoundException') {
          /**
           * If user does not exist (UserNotFoundException is thrown), try to sign up.
           * Note: "Prevent user existence errors" must be disabled in Cognito user pool settings.
           */

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const signUpOutput = await signUp({
            username: signInInput.phone,
            password: STATIC_TEMP_PASS,
          })

          /**
           * If sign-up didn't throw an error, try to immediately sign in.
           *
           * Note: Potentially, we should check if "signUpOutput.nextStep.signUpStep === 'DONE'", but other cases should
           * not happen at all - we don't use autoSignIn and users are auto-verified in lambda.
           * */
          await signInAndRedirectToConfirm(signInInput)
        } else if (isErrorWithName(error) && error.name === 'UserAlreadyAuthenticatedException') {
          /**
           * If user is already authenticated, sign them out and try to sign in again.
           * This should not happen, but if so, we want to handle it, otherwise user would be stuck on sing-in screen.
           */
          await signOut()
          updateAuthStore({ user: null })
          // Run the process again after sign out automatically. Now user have to press the button again.
          await attemptSignInOrSignUp(signInInput)
        } else {
          /**
           * Pass other errors to the next catch block.
           */
          throw error
        }
      }
    } catch (error) {
      // [InvalidParameterException: Invalid phone number.]
      if (isErrorWithName(error) && SIGNIN_ERROR_CODES_TO_SHOW.has(error.name)) {
        /**
         * Pass the errors we want to handle on FE to the next catch block.
         */
        throw error
      }
      // TODO Logging
      /** Log unexpected errors and show generic error message to the user */
      if (isError(error)) {
        console.error(t('useSignInOrSignUp.signInError'), error)
        snackbar.show(t('useSignInOrSignUp.signInError'), {
          variant: 'danger',
        })
      } else {
        console.error(t('useSignInOrSignUp.unexpectedErrorObjectInSignIn'), error)
        snackbar.show(t('useSignInOrSignUp.unexpectedErrorObjectInSignIn'), { variant: 'danger' })
      }
    }
  }

  const attemptConfirmSignIn = async (code: string, phone: string) => {
    try {
      if (phone !== STATIC_PHONE) {
        await confirmSignIn({ challengeResponse: code })
      }

      // TODO add static code verification

      /** If sign in didn't throw an error, set the user to context provider and redirect to home screen */
      const user = await getCurrentAuthenticatedUser()
      updateAuthStore({ user })
      if (!isOnboardingFinished) {
        setIsOnboardingFinished(true)
      }

      if (
        locationPermissionStatus === Location.PermissionStatus.UNDETERMINED ||
        notificationPermissionStatus === UnifiedPermissionStatus.UNDETERMINED
      ) {
        router.dismissAll()
        router.replace('/permissions')
      } else {
        // After successful sign in, register device for notifications - this is needed when user disallows notifications in phone settings
        // This happens on /permissions screen too, so we call it only here
        // TODO this should probably be called on every app focus?
        const result = await requestNotificationPermissionAndRegisterDevice()
        if (result === UnifiedPermissionStatus.GRANTED) {
          mutateSaveSetting({ pushNotificationsAboutToEnd: true, pushNotificationsToEnd: true })
        }

        router.dismissAll()
        router.replace('/')
      }
    } catch (error) {
      // [NotAuthorizedException: Invalid session for the user, session is expired.]
      // [CodeMismatchException: Invalid code or auth state for the user.]
      if (isErrorWithName(error) && CONFIRM_ERROR_CODES_TO_SHOW.has(error.name)) {
        /**
         * Pass the errors we want to handle on FE to the next catch block.
         */
        throw error
      }

      // TODO Logging
      /** Log unexpected errors and show generic error message to the user */
      if (isError(error)) {
        console.log(
          t('useSignInOrSignUp.confirmError', { message: error.message }),
          error,
          JSON.stringify(error),
        )
        snackbar.show(t('useSignInOrSignUp.confirmError', { message: error.message }), {
          variant: 'danger',
        })
      } else {
        snackbar.show(t('useSignInOrSignUp.unexpectedErrorObjectInConfirm'), { variant: 'danger' })
        console.error(t('useSignInOrSignUp.unexpectedErrorObjectInConfirm'), error)
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
