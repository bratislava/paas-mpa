import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useMemo,
  useState,
} from 'react'

type ContextProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signInResult: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSignInResult: Dispatch<SetStateAction<any>>
  signUpPhone: string | null
  setSignUpPhone: Dispatch<SetStateAction<string | null>>
}

export const GlobalStoreContext = createContext({} as ContextProps)
GlobalStoreContext.displayName = 'GlobalStoreContext'

const GlobalStoreProvider = ({ children }: PropsWithChildren) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [signInResult, setSignInResult] = useState<any>(null)

  const [signUpPhone, setSignUpPhone] = useState<string | null>(null)

  const value = useMemo(
    () => ({
      signInResult,
      setSignInResult,
      signUpPhone,
      setSignUpPhone,
    }),
    [signInResult, signUpPhone],
  )

  return <GlobalStoreContext.Provider value={value}>{children}</GlobalStoreContext.Provider>
}

export default GlobalStoreProvider
