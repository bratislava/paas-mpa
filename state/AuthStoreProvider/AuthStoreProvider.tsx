import { CognitoUser } from '@aws-amplify/auth'
import { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react'

import { getCurrentAuthenticatedUser } from '@/modules/cognito/utils'

type GlobalContextProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  signInResult: any
  signUpPhone: string | null
  user: CognitoUser | null
}

export const AuthStoreContext = createContext<GlobalContextProps | null>(null)
AuthStoreContext.displayName = 'AuthStoreContext'

export const AuthStoreUpdateContext = createContext<
  ((newValues: Partial<GlobalContextProps>) => void) | null
>(null)

const AuthStoreProvider = ({ children }: PropsWithChildren) => {
  const [values, setValues] = useState<GlobalContextProps>({
    signInResult: null,
    signUpPhone: null,
    user: null,
  })

  const onAuthStoreUpdate = useCallback(
    (newValues: Partial<GlobalContextProps>) => {
      setValues((prevValues) => ({ ...prevValues, ...newValues }))
    },
    [setValues],
  )

  const onFetchUser = async () => {
    const currentUser = await getCurrentAuthenticatedUser()
    onAuthStoreUpdate({ user: currentUser as CognitoUser })
  }

  useEffect(() => {
    onFetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthStoreUpdateContext.Provider value={onAuthStoreUpdate}>
      <AuthStoreContext.Provider value={values}>{children}</AuthStoreContext.Provider>
    </AuthStoreUpdateContext.Provider>
  )
}

export default AuthStoreProvider
