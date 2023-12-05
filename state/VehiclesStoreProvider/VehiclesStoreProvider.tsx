import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { createContext, PropsWithChildren, useCallback, useMemo } from 'react'

import { clientApi } from '@/modules/backend/client-api'
import { vehiclesOptions } from '@/modules/backend/constants/queryOptions'
import { CreateVehicleDto, UpdateVehicleDto, VehicleDto } from '@/modules/backend/openapi-generated'
import { isError } from '@/utils/errors'

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
  isInitialLoading?: boolean
}

export const VehiclesStoreContext = createContext<VehiclesStoreContextProps | null>(null)
VehiclesStoreContext.displayName = 'VehiclesStoreContext'

const VehiclesStoreProvider = ({ children }: PropsWithChildren) => {
  const { data, isPending } = useQuery(vehiclesOptions())

  const queryClient = useQueryClient()

  const vehicles = useMemo(() => data?.vehicles ?? [], [data?.vehicles])

  const defaultVehicle = vehicles?.find(({ isDefault }) => isDefault) ?? null

  const insertMutation = useMutation({
    mutationFn: (bodyInner: CreateVehicleDto) =>
      clientApi.vehiclesControllerInsertVehicle(bodyInner),
    onSuccess: async (response) => {
      if (response.data) {
        await queryClient.cancelQueries({ queryKey: vehiclesOptions().queryKey })
        const cacheData = queryClient.getQueryData(vehiclesOptions().queryKey)
        if (cacheData) {
          queryClient.setQueryData(vehiclesOptions().queryKey, {
            ...cacheData,
            vehicles: [response.data, ...cacheData.vehicles],
          })
        }
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => clientApi.vehiclesControllerDeleteVehicle(id),
    onSuccess: async (response) => {
      if (response.data.deleted) {
        await queryClient.cancelQueries({ queryKey: vehiclesOptions().queryKey })
        const cacheData = queryClient.getQueryData(vehiclesOptions().queryKey)

        if (cacheData) {
          queryClient.setQueryData(vehiclesOptions().queryKey, {
            ...cacheData,
            vehicles: cacheData.vehicles.filter(({ id }) => id !== response.data?.id),
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
        await queryClient.cancelQueries({ queryKey: vehiclesOptions().queryKey })
        const cacheData = queryClient.getQueryData(vehiclesOptions().queryKey)

        if (cacheData) {
          queryClient.setQueryData(vehiclesOptions().queryKey, {
            ...cacheData,
            vehicles: cacheData?.vehicles?.map((vehicle: VehicleDto) => ({
              ...vehicle,
              isDefault:
                vehicle.id === response.data?.id ? response.data?.isDefault : vehicle.isDefault,
            })),
          })
        }
      }
    },
  })

  const addVehicle = useCallback(
    async (vehicle: AddVehicle) => {
      try {
        await insertMutation.mutateAsync({
          vehiclePlateNumber: vehicle.licencePlate,
          name: vehicle.vehicleName,
          isDefault: vehicles.length === 0 || !!vehicle.isDefault,
        })
      } catch (error_) {
        console.log('isError', isError(error_))
        if (isAxiosError(error_)) {
          // TODO translation
          console.error(`Login Error:`, error_.response?.data)
        }
      }
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
      isInitialLoading: isPending,
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
      isPending,
    ],
  )

  return <VehiclesStoreContext.Provider value={values}>{children}</VehiclesStoreContext.Provider>
}

export default VehiclesStoreProvider
