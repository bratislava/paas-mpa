import { useMMKVBoolean } from 'react-native-mmkv'

import { useUserMMKVInstance } from '@/state/AuthStoreProvider/useUserMMKVInstance'

export const useBloomreachNotificationModalStorage = () => {
  const storage = useUserMMKVInstance()

  return useMMKVBoolean('bloomreachNotificationModalShown', storage)
}
