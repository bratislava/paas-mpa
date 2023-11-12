import { Auth } from 'aws-amplify'
import { router } from 'expo-router'

import { useGlobalStoreContext } from '@/state/GlobalStoreProvider/useGlobalStoreContext'

export const useSignOut = () => {
  const { setUser } = useGlobalStoreContext()

  return async () => {
    try {
      await Auth.signOut()
      setUser(null)
      router.push('/')
    } catch (error) {
      console.log('error signing out', error)
    }
  }
}
