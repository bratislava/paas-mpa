import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useMemo,
  useState,
} from 'react'

import { MapZoneHashMapValue, TicketPriceRequest } from '@/state/types'

type MapFeatureHashMap = Map<number, MapZoneHashMapValue>

type ContextProps = {
  mapZones: MapFeatureHashMap | null
  setMapZones: Dispatch<SetStateAction<MapFeatureHashMap | null>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signInResult: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSignInResult: Dispatch<SetStateAction<any>>
  signUpPhone: string | null
  setSignUpPhone: Dispatch<SetStateAction<string | null>>
  ticketPriceRequest: TicketPriceRequest | null
  setTicketPriceRequest: Dispatch<SetStateAction<TicketPriceRequest | null>>
}

export const GlobalStoreContext = createContext({} as ContextProps)

const GlobalStoreProvider = ({ children }: PropsWithChildren) => {
  const [mapZones, setMapZones] = useState<MapFeatureHashMap | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [signInResult, setSignInResult] = useState<any>(null)

  const [signUpPhone, setSignUpPhone] = useState<string | null>(null)

  const [ticketPriceRequest, setTicketPriceRequest] = useState<TicketPriceRequest | null>(null)

  const value = useMemo(
    () => ({
      mapZones,
      setMapZones,
      signInResult,
      setSignInResult,
      signUpPhone,
      setSignUpPhone,
      ticketPriceRequest,
      setTicketPriceRequest,
    }),
    [mapZones, signInResult, signUpPhone, ticketPriceRequest],
  )

  return <GlobalStoreContext.Provider value={value}>{children}</GlobalStoreContext.Provider>
}

export default GlobalStoreProvider
