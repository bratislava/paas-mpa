import { AuthUser } from 'aws-amplify/auth'
import { SplashScreen } from 'expo-router'
import { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react'

import { getCurrentAuthenticatedUser } from '@/modules/cognito/utils'

type GlobalContextProps = {
  signUpPhone: string | null
  user: AuthUser | null
}

export const AuthStoreContext = createContext<GlobalContextProps | null>(null)
AuthStoreContext.displayName = 'AuthStoreContext'

export const AuthStoreUpdateContext = createContext<
  ((newValues: Partial<GlobalContextProps>) => void) | null
>(null)

const AuthStoreProvider = ({ children }: PropsWithChildren) => {
  const [values, setValues] = useState<GlobalContextProps>({
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
    onAuthStoreUpdate({ user: currentUser })
    SplashScreen.hideAsync()
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
