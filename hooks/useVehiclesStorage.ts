import { useMMKVObject } from 'react-native-mmkv'

import { useUserMMKVInstance } from '@/state/AuthStoreProvider/useUserMMKVInstance'

export type Vehicle = {
  licencePlate: string
  vehicleName?: string | null
  oneTimeUse?: boolean
}

export const useVehiclesStorage = () => {
  const storage = useUserMMKVInstance()

  return useMMKVObject<Vehicle[]>('vehicles', storage)
}
