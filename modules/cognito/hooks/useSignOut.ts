import { signOut } from 'aws-amplify/auth'
import { router } from 'expo-router'

import { useAuthStoreUpdateContext } from '@/state/AuthStoreProvider/useAuthStoreUpdateContext'

/**
 * Sign out from Cognito, set AuthStore user to null and redirect to sign in page
 * Docs: https://docs.amplify.aws/react-native/build-a-backend/auth/enable-sign-up/#sign-out
 */
export const useSignOut = () => {
  const onAuthStoreUpdate = useAuthStoreUpdateContext()

  return async () => {
    try {
      await signOut()
      onAuthStoreUpdate({ user: null })
      router.push('/sign-in')
    } catch (error) {
      console.log('error signing out', error)
    }
  }
}
