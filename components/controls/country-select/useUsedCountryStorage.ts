import { useMMKVString } from 'react-native-mmkv'

import { useUserMMKVInstance } from '@/state/AuthStoreProvider/useUserMMKVInstance'

/**
 * Hook for getting and setting used country for phone number prefix (for example 421) in MMKV storage
 */
export const useUsedCountryStorage = () => {
  const storage = useUserMMKVInstance()

  return useMMKVString('usedCountry', storage)
}
