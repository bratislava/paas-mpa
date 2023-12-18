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
import { useIsOnboardingFinished } from '@/hooks/useIsOnboardingFinished'
import { useSignInOrSignUp } from '@/hooks/useSignInOrSignUp'
import { useTranslation } from '@/hooks/useTranslation'
import { useLocationPermission } from '@/modules/map/hooks/useLocationPermission'
import { useNotificationPermission } from '@/modules/map/hooks/useNotificationPermission'
import { useAuthStoreContext } from '@/state/AuthStoreProvider/useAuthStoreContext'
import { isErrorWithName } from '@/utils/errorCognitoAuth'

type ConfirmAuthSearchParams = {
  phone: string
}

const Page = () => {
  const t = useTranslation('Auth')

  const { attemptConfirmSignIn, resendConfirmationCode } = useSignInOrSignUp()
  const { phone } = useLocalSearchParams<ConfirmAuthSearchParams>()

  const [locationPermissionStatus] = useLocationPermission()
  const [notificationsPermissionStatus] = useNotificationPermission()
  const [isOnboardingFinished, setIsOnboardingFinished] = useIsOnboardingFinished()

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
    if (code.length === 6) {
      try {
        setLoading(true)
        if (!phone) {
          throw new Error('Phone was not found in URL params')
        }
        await attemptConfirmSignIn(code, phone)
      } catch (error) {
        if (isErrorWithName(error)) {
          setErrorCode(error.name)
        }
      }

      if (!isOnboardingFinished) {
        setIsOnboardingFinished(true)
      }
      setLoading(false)
    }
  }

  return (
    <DismissKeyboard>
      <ScreenView title=" " hasBackButton>
        <ScreenContent>
          <View className="g-2">
            <Typography variant="h1">{t('enterVerificationCode')}</Typography>

            <Typography>{t('verificationText')}</Typography>
          </View>

          <View className="g-4">
            <CodeInput
              autoFocus
              error={errorCode ? t(`errors.${errorCode}`) : undefined}
              value={code}
              setValue={setCode}
              onFocus={handleInputFocus}
              onBlur={handleConfirmSignIn}
            />

            <View className="g-3">
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
