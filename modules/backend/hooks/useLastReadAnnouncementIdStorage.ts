import { useMMKVNumber } from 'react-native-mmkv'

export const useLastReadAnnouncementIdStorage = () => {
  return useMMKVNumber('lastReadAnnouncementId')
}
