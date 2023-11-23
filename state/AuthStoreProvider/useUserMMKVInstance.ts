import { useMMKV } from 'react-native-mmkv'

import { useAuthStoreContext } from '@/state/AuthStoreProvider/useAuthStoreContext'

export const useUserMMKVInstance = () => {
  const { user } = useAuthStoreContext()

  return useMMKV({ id: user ? `${user?.getUsername()}.storage` : 'mmkv.default' })
}
