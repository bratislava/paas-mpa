import { PermissionStatus } from 'expo-modules-core'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'

import CodeInput from '@/components/inputs/CodeInput'
import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import DismissKeyboard from '@/components/shared/DissmissKeyboard'
import Typography from '@/components/shared/Typography'
import { useSignInOrSignUp } from '@/hooks/useSignInOrSignUp'
import { useTranslation } from '@/hooks/useTranslation'
import { useLocationPermission } from '@/modules/map/hooks/useLocationPermission'
import { useNotificationPermission } from '@/modules/map/hooks/useNotificationPermission'
import { useAuthStoreContext } from '@/state/AuthStoreProvider/useAuthStoreContext'
import { isErrorWithCode } from '@/utils/errors'

type ConfirmAuthSearchParams = {
  phone: string
}

const Page = () => {
  const t = useTranslation('Auth')

  const { confirmSignIn, resendConfirmationCode } = useSignInOrSignUp()
  const { phone } = useLocalSearchParams<ConfirmAuthSearchParams>()

  const [locationPermissionStatus] = useLocationPermission()
  const [notificationsPermissionStatus] = useNotificationPermission()

  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState('')
  const [errorCode, setErrorCode] = useState('')

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

  const handleInputFocus = () => {
    if (errorCode) {
      setErrorCode('')
    }
  }

  const handleConfirmSignIn = async () => {
    try {
      setLoading(true)
      await confirmSignIn(code)
    } catch (error) {
      if (isErrorWithCode(error)) {
        setErrorCode(error.code)
      }
    }
    setLoading(false)
  }

  return (
    <DismissKeyboard>
      <ScreenView>
        <ScreenContent>
          <View className="flex-col g-2">
            <Typography variant="h1">{t('enterVerificationCode')}</Typography>

            <Typography>{t('verificationText')}</Typography>
          </View>

          <View className="flex-col g-4">
            <CodeInput
              autoFocus
              error={errorCode ? t(`errors.${errorCode}`) : undefined}
              value={code}
              setValue={setCode}
              onFocus={handleInputFocus}
              onBlur={handleConfirmSignIn}
            />

            <View className="flex-col g-3">
              {phone && errorCode === 'NotAuthorizedException' ? (
                <Button variant="secondary" onPress={() => resendConfirmationCode(phone)}>
                  {t('resendCode')}
                </Button>
              ) : null}
              <ContinueButton loading={loading} onPress={handleConfirmSignIn} />
            </View>
          </View>
        </ScreenContent>
      </ScreenView>
    </DismissKeyboard>
  )
}

export default Page
