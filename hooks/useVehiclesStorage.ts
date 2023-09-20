import { useMMKVObject } from 'react-native-mmkv'

export type Vehicle = {
  licencePlate: string
  vehicleName: string | null
}

export const useVehiclesStorage = () => {
  return useMMKVObject<Vehicle[]>('vehicles')
}
