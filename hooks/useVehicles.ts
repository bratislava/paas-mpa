import { useVehiclesStorage, Vehicle } from '@/hooks/useVehiclesStorage'

export const useVehicles = () => {
  const [vehicles = [], setVehicles] = useVehiclesStorage()

  const addVehicle = (vehicle: Vehicle) => {
    setVehicles([...vehicles, vehicle])
  }

  const deleteVehicle = (licencePlate: string) => {
    setVehicles(vehicles.filter((vehicle) => vehicle.licencePlate !== licencePlate))
  }

  const setDefaultVehicle = (licencePlate: string) => {
    const vehicleToBeDefault = vehicles.find((vehicle) => vehicle.licencePlate === licencePlate)
    if (vehicleToBeDefault) {
      deleteVehicle(licencePlate)
      setVehicles([
        vehicleToBeDefault,
        ...vehicles.filter((vehicle) => vehicle.licencePlate !== licencePlate),
      ])
    }
  }

  const getDefaultVehicle = () => {
    return vehicles[0]
  }

  const isVehiclePresent = (licencePlate: string) => {
    return vehicles.some((vehicle) => vehicle.licencePlate === licencePlate)
  }

  return {
    vehicles,
    setVehicles,
    addVehicle,
    deleteVehicle,
    setDefaultVehicle,
    getDefaultVehicle,
    isVehiclePresent,
  }
}
