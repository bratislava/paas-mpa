import { CognitoUser } from '@aws-amplify/auth'
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { getCurrentAuthenticatedUser } from '@/modules/cognito/utils'

type ContextProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signInResult: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSignInResult: Dispatch<SetStateAction<any>>
  signUpPhone: string | null
  setSignUpPhone: Dispatch<SetStateAction<string | null>>
  user: CognitoUser | null
  setUser: Dispatch<SetStateAction<CognitoUser | null>>
}

export const GlobalStoreContext = createContext({} as ContextProps)
GlobalStoreContext.displayName = 'GlobalStoreContext'

const GlobalStoreProvider = ({ children }: PropsWithChildren) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [signInResult, setSignInResult] = useState<any>(null)

  const [signUpPhone, setSignUpPhone] = useState<string | null>(null)

  const [user, setUser] = useState<CognitoUser | null>(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    ;(async () => {
      const currentUser = await getCurrentAuthenticatedUser()
      setUser(currentUser as CognitoUser)
    })()
  }, [])

  const value = useMemo(
    () => ({
      signInResult,
      setSignInResult,
      signUpPhone,
      setSignUpPhone,
      user,
      setUser,
    }),
    [signInResult, signUpPhone, user],
  )

  return <GlobalStoreContext.Provider value={value}>{children}</GlobalStoreContext.Provider>
}

export default GlobalStoreProvider
