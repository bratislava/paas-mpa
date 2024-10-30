import { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react'

import { PaymentMethod } from '@/components/controls/payment-methods/types'
import { useDefaultPaymentMethod } from '@/hooks/useDefaultPaymentMethod'
import { ParkingCardDto } from '@/modules/backend/openapi-generated'
import { MapUdrZone } from '@/modules/map/types'

export type PurchaseContextVehicle = {
  id?: number
  vehiclePlateNumber: string
  name?: string
  isOneTimeUse?: boolean
}

type PurchaseStoreContextProps = {
  udr: MapUdrZone | null
  npk: ParkingCardDto | null
  vehicle: PurchaseContextVehicle | null
  rememberCard: boolean
  duration: number
  paymentMethod: PaymentMethod | null
}

interface Props {
  initialValues?: PurchaseStoreContextProps
}

export const PurchaseStoreContext = createContext<PurchaseStoreContextProps | null>(null)
PurchaseStoreContext.displayName = 'PurchaseStoreContext'

export const PurchaseStoreUpdateContext = createContext<
  ((newValues: Partial<PurchaseStoreContextProps>) => void) | null
>(null)

export const defaultInitialPurchaseStoreValues: PurchaseStoreContextProps = {
  udr: null,
  npk: null,
  vehicle: null,
  rememberCard: false,
  duration: 60 * 60, // 1 hour
  paymentMethod: null,
}

const PurchaseStoreProvider = ({ children, initialValues }: PropsWithChildren<Props>) => {
  const [values, setValues] = useState<PurchaseStoreContextProps>(
    initialValues ?? defaultInitialPurchaseStoreValues,
  )
  const [defaultPaymentMethod] = useDefaultPaymentMethod()

  useEffect(() => {
    setValues(initialValues ?? defaultInitialPurchaseStoreValues)
  }, [initialValues])

  useEffect(() => {
    setValues((prevValues) => ({
      ...prevValues,
      paymentMethod: defaultPaymentMethod,
    }))
  }, [defaultPaymentMethod])

  const onPurchaseStoreUpdate = useCallback(
    (newValues: Partial<PurchaseStoreContextProps>) => {
      setValues((prevValues) => ({ ...prevValues, ...newValues }))
    },
    [setValues],
  )

  return (
    <PurchaseStoreUpdateContext.Provider value={onPurchaseStoreUpdate}>
      <PurchaseStoreContext.Provider value={values}>{children}</PurchaseStoreContext.Provider>
    </PurchaseStoreUpdateContext.Provider>
  )
}

export default PurchaseStoreProvider
