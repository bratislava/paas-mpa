import { Auth } from 'aws-amplify'
import { router } from 'expo-router'

import { useGlobalStoreUpdateContext } from '@/state/GlobalStoreProvider/useGlobalStoreUpdateContext'

export const useSignOut = () => {
  const onGlobalStoreUpdate = useGlobalStoreUpdateContext()

  return async () => {
    try {
      await Auth.signOut()
      onGlobalStoreUpdate({ user: null })
      router.push('/sign-in')
    } catch (error) {
      console.log('error signing out', error)
    }
  }
}
