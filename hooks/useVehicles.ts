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
      setVehicles([
        vehicleToBeDefault,
        ...vehicles.filter((vehicle) => vehicle.licencePlate !== licencePlate),
      ])
    }
  }

  const defaultVehicle = vehicles?.[0] || null

  const isVehiclePresent = (licencePlate: string) => {
    return vehicles.some((vehicle) => vehicle.licencePlate === licencePlate)
  }

  const getVehicle = (licencePlate: string) => {
    return licencePlate
      ? vehicles.find((vehicle) => vehicle.licencePlate === licencePlate) ?? {
          licencePlate,
          oneTimeUse: true,
        }
      : null
  }

  return {
    vehicles,
    setVehicles,
    addVehicle,
    deleteVehicle,
    setDefaultVehicle,
    defaultVehicle,
    isVehiclePresent,
    getVehicle,
  }
}
