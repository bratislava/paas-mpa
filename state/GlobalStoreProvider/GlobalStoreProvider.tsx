import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useMemo,
  useState,
} from 'react'

import { ParkingCardDto } from '@/modules/backend/openapi-generated'
import { NormalizedUdrZone } from '@/modules/map/types'

type ContextProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signInResult: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSignInResult: Dispatch<SetStateAction<any>>
  signUpPhone: string | null
  setSignUpPhone: Dispatch<SetStateAction<string | null>>

  udr: NormalizedUdrZone | null
  setUdr: (udr: NormalizedUdrZone) => void

  npk: ParkingCardDto | null
  setNpk: (npk: ParkingCardDto | null) => void

  licencePlate: string
  setLicencePlate: (licencePlate: string) => void

  duration: number
  setDuration: (duration: number) => void
}

export const GlobalStoreContext = createContext({} as ContextProps)
GlobalStoreContext.displayName = 'GlobalStoreContext'

const GlobalStoreProvider = ({ children }: PropsWithChildren) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [signInResult, setSignInResult] = useState<any>(null)

  const [signUpPhone, setSignUpPhone] = useState<string | null>(null)

  const [udr, setUdr] = useState<NormalizedUdrZone | null>(null)
  const [npk, setNpk] = useState<ParkingCardDto | null>(null)
  const [licencePlate, setLicencePlate] = useState<string>('')
  const [duration, setDuration] = useState<number>(60)

  const value = useMemo(
    () => ({
      signInResult,
      setSignInResult,
      signUpPhone,
      setSignUpPhone,
      udr,
      setUdr,
      npk,
      setNpk,
      licencePlate,
      setLicencePlate,
      duration,
      setDuration,
    }),
    [duration, licencePlate, npk, signInResult, signUpPhone, udr],
  )

  return <GlobalStoreContext.Provider value={value}>{children}</GlobalStoreContext.Provider>
}

export default GlobalStoreProvider
