import { createContext, PropsWithChildren, useMemo, useState } from 'react'

import { ParkingCardDto } from '@/modules/backend/openapi-generated'
import { NormalizedUdrZone } from '@/modules/map/types'

type ContextProps = {
  udr: NormalizedUdrZone | null
  setUdr: (udr: NormalizedUdrZone) => void

  npk: ParkingCardDto | null
  setNpk: (npk: ParkingCardDto | null) => void

  licencePlate: string
  setLicencePlate: (licencePlate: string) => void

  duration: number
  setDuration: (duration: number) => void
}

export const PurchaseStoreContext = createContext({} as ContextProps)
PurchaseStoreContext.displayName = 'PurchaseStoreContext'

const PurchaseStoreProvider = ({ children }: PropsWithChildren) => {
  const [udr, setUdr] = useState<NormalizedUdrZone | null>(null)
  const [npk, setNpk] = useState<ParkingCardDto | null>(null)
  const [licencePlate, setLicencePlate] = useState<string>('')
  const [duration, setDuration] = useState<number>(60)

  const value = useMemo(
    () => ({
      udr,
      setUdr,
      npk,
      setNpk,
      licencePlate,
      setLicencePlate,
      duration,
      setDuration,
    }),
    [duration, licencePlate, npk, udr],
  )

  return <PurchaseStoreContext.Provider value={value}>{children}</PurchaseStoreContext.Provider>
}

export default PurchaseStoreProvider
