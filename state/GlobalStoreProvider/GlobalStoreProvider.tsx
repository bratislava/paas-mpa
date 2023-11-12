import { CognitoUser } from '@aws-amplify/auth'
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useMemo,
  useState,
} from 'react'
import { MMKV } from 'react-native-mmkv'

type ContextProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signInResult: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSignInResult: Dispatch<SetStateAction<any>>
  signUpPhone: string | null
  setSignUpPhone: Dispatch<SetStateAction<string | null>>
  user: CognitoUser | null
  setUser: Dispatch<SetStateAction<CognitoUser | null>>
  mmkvStorage: MMKV
}

export const GlobalStoreContext = createContext({} as ContextProps)
GlobalStoreContext.displayName = 'GlobalStoreContext'

const GlobalStoreProvider = ({ children }: PropsWithChildren) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [signInResult, setSignInResult] = useState<any>(null)

  const [signUpPhone, setSignUpPhone] = useState<string | null>(null)

  const [user, setUser] = useState<CognitoUser | null>(null)

  const mmkvStorage = useMemo(() => {
    if (user) {
      const username = user.getUsername()

      return new MMKV({ id: `user-${username}-storage` })
    }

    return new MMKV()
  }, [user])

  const value = useMemo(
    () => ({
      signInResult,
      setSignInResult,
      signUpPhone,
      setSignUpPhone,
      user,
      setUser,
      mmkvStorage,
    }),
    [signInResult, signUpPhone, user, mmkvStorage],
  )

  return <GlobalStoreContext.Provider value={value}>{children}</GlobalStoreContext.Provider>
}

export default GlobalStoreProvider
