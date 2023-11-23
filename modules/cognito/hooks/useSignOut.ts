import { Auth } from 'aws-amplify'
import { router } from 'expo-router'

import { useAuthStoreUpdateContext } from '@/state/AuthStoreProvider/useAuthStoreUpdateContext'

export const useSignOut = () => {
  const onAuthStoreUpdate = useAuthStoreUpdateContext()

  return async () => {
    try {
      await Auth.signOut()
      onAuthStoreUpdate({ user: null })
      router.push('/sign-in')
    } catch (error) {
      console.log('error signing out', error)
    }
  }
}
