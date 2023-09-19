import { useMMKVObject } from 'react-native-mmkv'

export type Vehicle = {
  licencePlate: string
  vehicleName: string | null
}

export const useStorageVehicles = () => {
  return useMMKVObject<Vehicle[]>('vehicles')
}
