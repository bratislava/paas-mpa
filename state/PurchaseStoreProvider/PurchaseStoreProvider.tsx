import { useGlobalSearchParams } from 'expo-router'
import { createContext, PropsWithChildren, useCallback, useState } from 'react'

import { PurchaseSearchParams } from '@/app/(purchase-and-payment)/purchase'
import { PaymentOption } from '@/components/controls/payment-methods/types'
import { useVehicles } from '@/hooks/useVehicles'
import { ParkingCardDto } from '@/modules/backend/openapi-generated'
import { NormalizedUdrZone } from '@/modules/map/types'

import { useMapZone } from '../MapZonesProvider/useMapZone'

interface PurchaseStoreContextProps {
  udr: NormalizedUdrZone | null
  npk: ParkingCardDto | null
  licencePlate: string
  duration: number
  paymentOption: PaymentOption | null
}

export const PurchaseStoreContext = createContext<PurchaseStoreContextProps | null>(null)
PurchaseStoreContext.displayName = 'PurchaseStoreContext'

export const PurchaseStoreUpdateContext = createContext<
  ((newValues: Partial<PurchaseStoreContextProps>) => void) | null
>(null)

const PurchaseStoreProvider = ({ children }: PropsWithChildren) => {
  const { defaultVehicle } = useVehicles()
  const { udrId: udrIdSearchParam } = useGlobalSearchParams<PurchaseSearchParams>()
  const newUdrZone = useMapZone(udrIdSearchParam ?? null, true)

  const [values, setValues] = useState<PurchaseStoreContextProps>({
    udr: newUdrZone?.udrId ? newUdrZone : null,
    npk: null,
    licencePlate: defaultVehicle?.licencePlate || '',
    duration: 60 * 60, // 1 hour
    paymentOption: null,
  })

  const handleStoreUpdate = useCallback(
    (newValues: Partial<PurchaseStoreContextProps>) => {
      setValues((prevValues) => ({ ...prevValues, ...newValues }))
    },
    [setValues],
  )

  return (
    <PurchaseStoreUpdateContext.Provider value={handleStoreUpdate}>
      <PurchaseStoreContext.Provider value={values}>{children}</PurchaseStoreContext.Provider>
    </PurchaseStoreUpdateContext.Provider>
  )
}

export default PurchaseStoreProvider
