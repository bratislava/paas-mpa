import { useNetInfo } from '@react-native-community/netinfo'
import { AuthUser } from 'aws-amplify/auth'
import { SplashScreen } from 'expo-router'
import { createContext, PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { configureExponea, getBloomreachId } from '@/components/notifications/utils'
import { getCurrentAuthenticatedUser } from '@/modules/cognito/utils'

type GlobalStateProps = {
  signUpPhone: string | null
  user: AuthUser | null
  isLoading: boolean
  bloomreachId: string | null
  isBloomreachInitialized: boolean
}

type GlobalContextProps = GlobalStateProps & {
  onFetchUser: () => Promise<void>
}

export const AuthStoreContext = createContext<GlobalContextProps | null>(null)
AuthStoreContext.displayName = 'AuthStoreContext'

export const AuthStoreUpdateContext = createContext<
  ((newValues: Partial<GlobalStateProps>) => void) | null
>(null)

const AuthStoreProvider = ({ children }: PropsWithChildren) => {
  const { ready } = useTranslation()

  const { isInternetReachable } = useNetInfo()
  const hasFetchedUser = useRef(false)

  const [values, setValues] = useState<GlobalStateProps>({
    signUpPhone: null,
    user: null,
    isLoading: true,
    bloomreachId: null,
    isBloomreachInitialized: false,
  })

  const onAuthStoreUpdate = useCallback(
    (newValues: Partial<GlobalStateProps>) => {
      setValues((prevValues) => ({ ...prevValues, ...newValues }))
    },
    [setValues],
  )

  const onFetchUser = useCallback(async () => {
    const currentUser = await getCurrentAuthenticatedUser()
    onAuthStoreUpdate({ user: currentUser, isLoading: false })
  }, [onAuthStoreUpdate])

  useEffect(() => {
    if (hasFetchedUser.current) return
    if (isInternetReachable) {
      hasFetchedUser.current = true
      onFetchUser()
    }
  }, [isInternetReachable, onFetchUser])

  const onConfigureExponea = useCallback(async () => {
    const bloomreachId = await getBloomreachId()
    onAuthStoreUpdate({ bloomreachId: bloomreachId ?? null, isBloomreachInitialized: true })
    if (values.user?.signInDetails?.loginId && bloomreachId) {
      await configureExponea(bloomreachId, values.user.signInDetails.loginId)
    }
  }, [onAuthStoreUpdate, values.user?.signInDetails?.loginId])

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
      <AuthStoreContext.Provider value={{ ...values, onFetchUser }}>
        {children}
      </AuthStoreContext.Provider>
    </AuthStoreUpdateContext.Provider>
  )
}

export default AuthStoreProvider
