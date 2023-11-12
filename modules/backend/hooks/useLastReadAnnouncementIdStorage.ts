import { useMMKVNumber } from 'react-native-mmkv'

import { useUserMMKVInstance } from '@/state/GlobalStoreProvider/useUserMMKVInstance'

export const useLastReadAnnouncementIdStorage = () => {
  return useMMKVNumber('lastReadAnnouncementId', useUserMMKVInstance())
}
