import { useMMKVObject } from 'react-native-mmkv'

import { useUserMMKVInstance } from '@/state/GlobalStoreProvider/useUserMMKVInstance'

export type Vehicle = {
  licencePlate: string
  vehicleName: string | null
}

export const useVehiclesStorage = () => {
  return useMMKVObject<Vehicle[]>('vehicles', useUserMMKVInstance())
}
