import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'

import { clientApi } from '@/modules/backend/client-api'
import {
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleDto,
  VehiclesResponseDto,
} from '@/modules/backend/openapi-generated'

export type AddVehicle = {
  licencePlate: string
  vehicleName: string
  isDefault?: boolean
}

export const useVehicles = () => {
  const { data } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => clientApi.vehiclesControllerVehiclesGetMany(),
    placeholderData: keepPreviousData,
  })

  const queryClient = useQueryClient()

  const vehicles = data?.data.vehicles ?? []

  const insertMutation = useMutation({
    mutationFn: (bodyInner: CreateVehicleDto) =>
      clientApi.vehiclesControllerInsertVehicle(bodyInner),
    onSuccess: async (response) => {
      if (response.data) {
        await queryClient.cancelQueries({ queryKey: ['vehicles'] })
        const cacheData = queryClient.getQueryData([
          'vehicles',
        ]) as AxiosResponse<VehiclesResponseDto>
        if (cacheData) {
          queryClient.setQueryData(['vehicles'], {
            data: {
              vehicles: [response.data, ...cacheData.data.vehicles],
            },
          })
        }
      }
    },
  })
  const deleteMutation = useMutation({
    mutationFn: (id: number) => clientApi.vehiclesControllerDeleteVehicle(id),
    onSuccess: async (response) => {
      if (response.data.deleted) {
        await queryClient.cancelQueries({ queryKey: ['vehicles'] })
        const cacheData = queryClient.getQueryData([
          'vehicles',
        ]) as AxiosResponse<VehiclesResponseDto>

        if (cacheData) {
          queryClient.setQueryData(['vehicles'], {
            data: {
              vehicles: cacheData.data.vehicles.filter(({ id }) => id !== response.data?.id),
            },
          })
        }
      }
    },
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, updateVehicleDto }: { id: number; updateVehicleDto: UpdateVehicleDto }) =>
      clientApi.vehiclesControllerUpdateVehicle(id, updateVehicleDto),
    onSuccess: async (response) => {
      if (response.data) {
        await queryClient.cancelQueries({ queryKey: ['vehicles'] })
        const cacheData = queryClient.getQueryData([
          'vehicles',
        ]) as AxiosResponse<VehiclesResponseDto>

        if (cacheData) {
          queryClient.setQueryData(['vehicles'], {
            data: {
              vehicles: cacheData?.data?.vehicles?.map((vehicle: VehicleDto) => ({
                ...vehicle,
                isDefault:
                  vehicle.id === response.data?.id ? response.data?.isDefault : vehicle.isDefault,
              })),
            },
          })
        }
      }
    },
  })

  const addVehicle = (vehicle: AddVehicle) => {
    insertMutation.mutate({
      vehiclePlateNumber: vehicle.licencePlate,
      name: vehicle.vehicleName,
      isDefault: vehicles.length === 0 || !!vehicle.isDefault,
    })
  }

  const deleteVehicle = async (id: number) => {
    if (defaultVehicle?.id === id) {
      const newDefaultVehicle = vehicles.find((vehicle) => vehicle.id !== defaultVehicle?.id)
      if (newDefaultVehicle) {
        await setDefaultVehicle(newDefaultVehicle.id)
      }
    }
    deleteMutation.mutate(id)
  }
  const defaultVehicle = vehicles?.find(({ isDefault }) => isDefault) || null

  const setDefaultVehicle = async (vehicleId: number) => {
    const vehicle = vehicles.find(({ id }) => vehicleId === id)
    if (vehicle) {
      if (defaultVehicle && defaultVehicle?.id !== vehicleId) {
        await updateMutation.mutateAsync({
          id: defaultVehicle.id,
          updateVehicleDto: {
            vehiclePlateNumber: defaultVehicle.vehiclePlateNumber,
            name: defaultVehicle.name,
            isDefault: false,
          },
        })
      }

      await updateMutation.mutateAsync({
        id: vehicleId,
        updateVehicleDto: {
          vehiclePlateNumber: vehicle.vehiclePlateNumber,
          name: vehicle.name,
          isDefault: true,
        },
      })
    }
  }

  const isVehiclePresent = (licencePlate: string) => {
    return vehicles.some((vehicle) => vehicle.vehiclePlateNumber === licencePlate)
  }

  const getVehicle = (id?: number | null) => {
    return id ? vehicles.find((vehicle) => vehicle.id === id) : null
  }

  return {
    vehicles,
    addVehicle,
    deleteVehicle,
    setDefaultVehicle,
    defaultVehicle,
    isVehiclePresent,
    getVehicle,
  }
}
