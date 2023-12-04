import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { createContext, PropsWithChildren, useCallback, useMemo } from 'react'

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
type VehiclesStoreContextProps = {
  vehicles: VehicleDto[]
  addVehicle: (vehicle: AddVehicle) => Promise<void>
  deleteVehicle: (id: number) => Promise<void>
  setDefaultVehicle: (id: number) => Promise<void>
  defaultVehicle: VehicleDto | null
  isVehiclePresent: (licencePlate: string) => boolean
  getVehicle: (id?: number | null) => VehicleDto | null | undefined
  isLoading?: boolean
}

export const VehiclesStoreContext = createContext<VehiclesStoreContextProps | null>(null)
VehiclesStoreContext.displayName = 'VehiclesStoreContext'

const VehiclesStoreProvider = ({ children }: PropsWithChildren) => {
  const { data } = useQuery({
    queryKey: ['vehicles'],
    queryFn: () => clientApi.vehiclesControllerVehiclesGetMany(),
    placeholderData: keepPreviousData,
  })

  const queryClient = useQueryClient()

  const vehicles = useMemo(() => data?.data.vehicles ?? [], [data?.data.vehicles])

  const defaultVehicle = vehicles?.find(({ isDefault }) => isDefault) || null

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

  const addVehicle = useCallback(
    async (vehicle: AddVehicle) => {
      await insertMutation.mutateAsync({
        vehiclePlateNumber: vehicle.licencePlate,
        name: vehicle.vehicleName,
        isDefault: vehicles.length === 0 || !!vehicle.isDefault,
      })
    },
    [insertMutation, vehicles],
  )

  const setDefaultVehicle = useCallback(
    async (vehicleId: number) => {
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
    },
    [defaultVehicle, updateMutation, vehicles],
  )

  const deleteVehicle = useCallback(
    async (id: number) => {
      if (defaultVehicle?.id === id) {
        const newDefaultVehicle = vehicles.find((vehicle) => vehicle.id !== defaultVehicle?.id)
        if (newDefaultVehicle) {
          await setDefaultVehicle(newDefaultVehicle.id)
        }
      }
      deleteMutation.mutate(id)
    },
    [defaultVehicle, deleteMutation, setDefaultVehicle, vehicles],
  )

  const isVehiclePresent = useCallback(
    (licencePlate: string) => {
      return vehicles.some((vehicle) => vehicle.vehiclePlateNumber === licencePlate)
    },
    [vehicles],
  )

  const getVehicle = useCallback(
    (id?: number | null) => {
      return id ? vehicles.find((vehicle) => vehicle.id === id) : null
    },
    [vehicles],
  )

  const values = useMemo(
    () => ({
      vehicles,
      addVehicle,
      deleteVehicle,
      setDefaultVehicle,
      defaultVehicle,
      isVehiclePresent,
      isLoading: insertMutation.isPending || deleteMutation.isPending || updateMutation.isPending,
      getVehicle,
    }),
    [
      addVehicle,
      defaultVehicle,
      deleteVehicle,
      getVehicle,
      isVehiclePresent,
      setDefaultVehicle,
      vehicles,
      insertMutation.isPending,
      deleteMutation.isPending,
      updateMutation.isPending,
    ],
  )

  return <VehiclesStoreContext.Provider value={values}>{children}</VehiclesStoreContext.Provider>
}

export default VehiclesStoreProvider
