import { useMutation } from '@tanstack/react-query'
import { createContext, PropsWithChildren, useCallback, useMemo } from 'react'

import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { clientApi } from '@/modules/backend/client-api'
import { vehiclesOptions } from '@/modules/backend/constants/queryOptions'
import { CreateVehicleDto, UpdateVehicleDto, VehicleDto } from '@/modules/backend/openapi-generated'
import { sanitizeLicencePlate } from '@/utils/licencePlate'

export type AddVehicle = {
  licencePlate: string
  vehicleName: string
  isDefault?: boolean
}

export type EditVehicle = {
  id: number
  vehicleName?: string
}

type VehiclesStoreContextProps = {
  vehicles: VehicleDto[]
  addVehicle: (vehicle: AddVehicle) => Promise<void>
  editVehicle: (vehicle: EditVehicle) => Promise<void>
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
  const { data, isPending, refetch } = useQueryWithFocusRefetch(vehiclesOptions())

  const vehicles = useMemo(() => data?.data.vehicles ?? [], [data?.data.vehicles])

  const defaultVehicle = vehicles?.find(({ isDefault }) => isDefault) ?? null

  const insertMutation = useMutation({
    mutationFn: (bodyInner: CreateVehicleDto) =>
      clientApi.vehiclesControllerInsertVehicle(bodyInner),
    onSuccess: async (response) => {
      if (response.data) {
        await refetch()
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => clientApi.vehiclesControllerDeleteVehicle(id),
    onSuccess: async (response) => {
      if (response.data.deleted) {
        await refetch()
      }
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, updateVehicleDto }: { id: number; updateVehicleDto: UpdateVehicleDto }) =>
      clientApi.vehiclesControllerUpdateVehicle(id, updateVehicleDto),
    onSuccess: async (response) => {
      if (response.data) {
        await refetch()
      }
    },
  })

  const addVehicle = useCallback(
    async (vehicle: AddVehicle) => {
      await insertMutation.mutateAsync({
        vehiclePlateNumber: sanitizeLicencePlate(vehicle.licencePlate),
        name: vehicle.vehicleName,
        isDefault: vehicles.length === 0 || !!vehicle.isDefault,
      })
    },
    [insertMutation, vehicles],
  )

  const editVehicle = useCallback(
    async (vehicle: EditVehicle) => {
      await updateMutation.mutateAsync({
        id: vehicle.id,
        updateVehicleDto: {
          name: vehicle.vehicleName,
        },
      })
    },
    [updateMutation],
  )

  const setDefaultVehicle = useCallback(
    async (vehicleId: number) => {
      const vehicle = vehicles.find(({ id }) => vehicleId === id)
      if (vehicle) {
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
    [updateMutation, vehicles],
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
      editVehicle,
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
      editVehicle,
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
