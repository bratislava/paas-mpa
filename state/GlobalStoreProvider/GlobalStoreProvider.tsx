import { CognitoUser } from '@aws-amplify/auth'
import { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react'

import { getCurrentAuthenticatedUser } from '@/modules/cognito/utils'

type GlobalContextProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signInResult: any
  signUpPhone: string | null
  user: CognitoUser | null
}

export const GlobalStoreContext = createContext<GlobalContextProps | null>(null)
GlobalStoreContext.displayName = 'GlobalStoreContext'

export const GlobalStoreUpdateContext = createContext<
  ((newValues: Partial<GlobalContextProps>) => void) | null
>(null)

const GlobalStoreProvider = ({ children }: PropsWithChildren) => {
  const [values, setValues] = useState<GlobalContextProps>({
    signInResult: null,
    signUpPhone: null,
    user: null,
  })

  const onGlobalStoreUpdate = useCallback(
    (newValues: Partial<GlobalContextProps>) => {
      setValues((prevValues) => ({ ...prevValues, ...newValues }))
    },
    [setValues],
  )

  const onFetchUser = async () => {
    const currentUser = await getCurrentAuthenticatedUser()
    onGlobalStoreUpdate({ user: currentUser as CognitoUser })
  }

  useEffect(() => {
    onFetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <GlobalStoreUpdateContext.Provider value={onGlobalStoreUpdate}>
      <GlobalStoreContext.Provider value={values}>{children}</GlobalStoreContext.Provider>
    </GlobalStoreUpdateContext.Provider>
  )
}

export default GlobalStoreProvider
