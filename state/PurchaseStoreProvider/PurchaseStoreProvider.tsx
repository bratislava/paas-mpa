import { createContext, PropsWithChildren, useCallback, useState } from 'react'

import { PaymentOption } from '@/components/controls/payment-methods/types'
import { ParkingCardDto } from '@/modules/backend/openapi-generated'
import { NormalizedUdrZone } from '@/modules/map/types'

export type PurchaseContextVehicle = {
  id?: number
  vehiclePlateNumber: string
  name?: string
  isOneTimeUse?: boolean
}

type PurchaseStoreContextProps = {
  udr: NormalizedUdrZone | null
  npk: ParkingCardDto | null
  vehicle: PurchaseContextVehicle | null
  duration: number
  paymentOption: PaymentOption | null
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
  duration: 60 * 60, // 1 hour
  paymentOption: null,
}

const PurchaseStoreProvider = ({ children }: PropsWithChildren) => {
  const [values, setValues] = useState<PurchaseStoreContextProps>(defaultInitialPurchaseStoreValues)

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
