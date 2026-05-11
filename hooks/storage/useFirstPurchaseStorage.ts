import { useMMKVBoolean } from 'react-native-mmkv'

import { useUserMMKVInstance } from '@/state/AuthStoreProvider/useUserMMKVInstance'

export const useFirstPurchaseStorage = () => {
  const storage = useUserMMKVInstance()

  return useMMKVBoolean('firstPurchaseOpened', storage)
}
