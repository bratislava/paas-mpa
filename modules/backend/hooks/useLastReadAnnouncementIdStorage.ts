import { useMMKVNumber } from 'react-native-mmkv'

import { useUserMMKVInstance } from '@/state/AuthStoreProvider/useUserMMKVInstance'

export const useLastReadAnnouncementIdStorage = () => {
  const storage = useUserMMKVInstance()

  return useMMKVNumber('lastReadAnnouncementId', storage)
}
