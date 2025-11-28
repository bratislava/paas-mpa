import { AuthUser } from 'aws-amplify/auth'
import { SplashScreen } from 'expo-router'
import { createContext, PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { configureExponea, getBloomreachId } from '@/components/notifications/utils'
import { useEffectOnce } from '@/hooks/useEffectOnce'
import { getCurrentAuthenticatedUser } from '@/modules/cognito/utils'

type GlobalContextProps = {
  signUpPhone: string | null
  user: AuthUser | null
  isLoading: boolean
}

export const AuthStoreContext = createContext<GlobalContextProps | null>(null)
AuthStoreContext.displayName = 'AuthStoreContext'

export const AuthStoreUpdateContext = createContext<
  ((newValues: Partial<GlobalContextProps>) => void) | null
>(null)

const AuthStoreProvider = ({ children }: PropsWithChildren) => {
  const { ready } = useTranslation()

  const [values, setValues] = useState<GlobalContextProps>({
    signUpPhone: null,
    user: null,
    isLoading: true,
  })

  const onAuthStoreUpdate = useCallback(
    (newValues: Partial<GlobalContextProps>) => {
      setValues((prevValues) => ({ ...prevValues, ...newValues }))
    },
    [setValues],
  )

  const onFetchUser = async () => {
    const currentUser = await getCurrentAuthenticatedUser()
    onAuthStoreUpdate({ user: currentUser, isLoading: false })
  }

  useEffectOnce(() => {
    onFetchUser()
  })

  const onConfigureExponea = useCallback(async () => {
    const bloomreachId = await getBloomreachId()
    if (values.user?.signInDetails?.loginId && bloomreachId) {
      await configureExponea(bloomreachId, values.user.signInDetails.loginId)
    }
  }, [values.user?.signInDetails?.loginId])

  useEffect(() => {
    onConfigureExponea()
  }, [onConfigureExponea])

  // Hide splash screen when user is loaded and translations are ready
  useEffect(() => {
    if (!values.isLoading && ready) {
      SplashScreen.hideAsync()
    }
  }, [ready, values.isLoading])

  return (
    <AuthStoreUpdateContext.Provider value={onAuthStoreUpdate}>
      <AuthStoreContext.Provider value={values}>{children}</AuthStoreContext.Provider>
    </AuthStoreUpdateContext.Provider>
  )
}

export default AuthStoreProvider
