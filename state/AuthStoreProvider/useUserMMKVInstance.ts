import { useMMKV } from 'react-native-mmkv'

import { useAuthStoreContext } from '@/state/AuthStoreProvider/useAuthStoreContext'

export const useUserMMKVInstance = () => {
  const { user } = useAuthStoreContext()

  return useMMKV({ id: user ? `${user?.username}.storage` : 'mmkv.default' })
}
