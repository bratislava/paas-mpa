import { useMMKV } from 'react-native-mmkv'

import { useGlobalStoreContext } from '@/state/GlobalStoreProvider/useGlobalStoreContext'

export const useUserMMKVInstance = () => {
  const { user } = useGlobalStoreContext()

  return useMMKV({ id: user ? `${user?.getUsername()}.storage` : 'mmkv.default' })
}
