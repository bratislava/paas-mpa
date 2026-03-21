import { useMMKVNumber } from 'react-native-mmkv'

import { useUserMMKVInstance } from '@/state/AuthStoreProvider/useUserMMKVInstance'

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000

export const useBloomreachNotificationModalStorage = () => {
  const storage = useUserMMKVInstance()
  const [snoozedUntil, setSnoozedUntil] = useMMKVNumber(
    'bloomreachNotificationModalSnoozedUntil',
    storage,
  )

  const shouldShowModal = !snoozedUntil || Date.now() > snoozedUntil

  const snoozeForWeek = () => setSnoozedUntil(Date.now() + ONE_WEEK_MS)
  const dismissPermanently = () => setSnoozedUntil(Number.MAX_SAFE_INTEGER)

  return { shouldShowModal, snoozeForWeek, dismissPermanently }
}
