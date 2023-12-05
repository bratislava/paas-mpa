import { PermissionStatus } from 'expo-modules-core'
import { router } from 'expo-router'
import { useState } from 'react'

import CodeInput from '@/components/inputs/CodeInput'
import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import DismissKeyboard from '@/components/shared/DissmissKeyboard'
import Typography from '@/components/shared/Typography'
import { useSignInOrSignUp } from '@/hooks/useSignInOrSignUp'
import { useTranslation } from '@/hooks/useTranslation'
import { useLocationPermission } from '@/modules/map/hooks/useLocationPermission'
import { useNotificationPermission } from '@/modules/map/hooks/useNotificationPermission'
import { useAuthStoreContext } from '@/state/AuthStoreProvider/useAuthStoreContext'

const Page = () => {
  const t = useTranslation('Auth')
  const { confirmSignIn } = useSignInOrSignUp()
  const [locationPermissionStatus] = useLocationPermission()
  const [notificationsPermissionStatus] = useNotificationPermission()

  const [code, setCode] = useState('')

  /* Redirect to home screen if user is logged in */
  const { user } = useAuthStoreContext()
  if (user) {
    if (
      locationPermissionStatus === PermissionStatus.UNDETERMINED ||
      notificationsPermissionStatus === PermissionStatus.UNDETERMINED
    ) {
      router.replace('/permissions')
    } else {
      router.replace('/')
    }
  }

  return (
    <DismissKeyboard>
      <ScreenView>
        <ScreenContent>
          <Typography variant="h1">{t('enterVerificationCode')}</Typography>

          <Typography>{t('verificationText')}</Typography>

          <CodeInput autoFocus value={code} setValue={setCode} onBlur={() => confirmSignIn(code)} />

          <ContinueButton onPress={() => confirmSignIn(code)} />
        </ScreenContent>
      </ScreenView>
    </DismissKeyboard>
  )
}

export default Page
