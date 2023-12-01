import { createContext, PropsWithChildren, useCallback, useState } from 'react'

import { PaymentOption } from '@/components/controls/payment-methods/types'
import { useVehicles } from '@/hooks/useVehicles'
import { ParkingCardDto } from '@/modules/backend/openapi-generated'
import { NormalizedUdrZone } from '@/modules/map/types'

interface PurchaseStoreContextProps {
  udr: NormalizedUdrZone | null
  npk: ParkingCardDto | null
  licencePlate: string
  duration: number
  paymentOption: PaymentOption | null
}

interface Props extends PropsWithChildren {
  initialValues?: PurchaseStoreContextProps
}

export const PurchaseStoreContext = createContext<PurchaseStoreContextProps | null>(null)
PurchaseStoreContext.displayName = 'PurchaseStoreContext'

export const PurchaseStoreUpdateContext = createContext<
  ((newValues: Partial<PurchaseStoreContextProps>) => void) | null
>(null)

const PurchaseStoreProvider = ({ children, initialValues }: Props) => {
  const { defaultVehicle } = useVehicles()

  const [values, setValues] = useState<PurchaseStoreContextProps>(
    initialValues || {
      udr: null,
      npk: null,
      licencePlate: defaultVehicle?.licencePlate || '',
      duration: 60 * 60, // 1 hour
      paymentOption: null,
    },
  )

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
