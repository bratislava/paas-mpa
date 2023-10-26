import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useMemo,
  useState,
} from 'react'

import { TicketPriceRequest } from '@/state/GlobalStoreProvider/types'

type ContextProps = {
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
GlobalStoreContext.displayName = 'GlobalStoreContext'

const GlobalStoreProvider = ({ children }: PropsWithChildren) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [signInResult, setSignInResult] = useState<any>(null)

  const [signUpPhone, setSignUpPhone] = useState<string | null>(null)

  const [ticketPriceRequest, setTicketPriceRequest] = useState<TicketPriceRequest | null>(null)

  const value = useMemo(
    () => ({
      signInResult,
      setSignInResult,
      signUpPhone,
      setSignUpPhone,
      ticketPriceRequest,
      setTicketPriceRequest,
    }),
    [signInResult, signUpPhone, ticketPriceRequest],
  )

  return <GlobalStoreContext.Provider value={value}>{children}</GlobalStoreContext.Provider>
}

export default GlobalStoreProvider
