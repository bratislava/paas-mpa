import { createContext, PropsWithChildren, useCallback, useState } from 'react'

import { PaymentOption } from '@/components/controls/payment-methods/types'
import { useVehicles } from '@/hooks/useVehicles'
import { ParkingCardDto } from '@/modules/backend/openapi-generated'
import { NormalizedUdrZone } from '@/modules/map/types'

interface PurchaseStoreContextProps {
  udr: NormalizedUdrZone | null
  npk: ParkingCardDto | null
  licencePlateId: number | null
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
  licencePlateId: null,
  duration: 60 * 60, // 1 hour
  paymentOption: null,
}

const PurchaseStoreProvider = ({ children }: PropsWithChildren) => {
  const { defaultVehicle } = useVehicles()

  const [values, setValues] = useState<PurchaseStoreContextProps>({
    ...defaultInitialPurchaseStoreValues,
    licencePlateId: defaultVehicle?.id || null,
  })

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
