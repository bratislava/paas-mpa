import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { useTranslation as useLibTranslation } from 'react-i18next'
import { View } from 'react-native'
import { useMMKVString } from 'react-native-mmkv'

import CodeInput from '@/components/inputs/CodeInput'
import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import DismissKeyboard from '@/components/shared/DismissKeyboard'
import Typography from '@/components/shared/Typography'
import { useSignInOrSignUp } from '@/hooks/useSignInOrSignUp'
import { useTranslation } from '@/hooks/useTranslation'
import { isErrorWithName } from '@/utils/errorCognitoAuth'
import { getAndChangeUserLanguage } from '@/utils/getAndChangeUserLanguage'
import { STORAGE_LANGUAGE_KEY } from '@/utils/mmkv'

type ConfirmAuthSearchParams = {
  phone: string
}

const Page = () => {
  const { t } = useTranslation()
  const { i18n } = useLibTranslation()
  const [, setMmkvLocale] = useMMKVString(STORAGE_LANGUAGE_KEY)

  const { attemptConfirmSignIn, resendConfirmationCode } = useSignInOrSignUp()
  const { phone } = useLocalSearchParams<ConfirmAuthSearchParams>()

  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState('')
  const [expectedError, setExpectedError] = useState('')

  const handleInputFocus = () => {
    if (expectedError) {
      setExpectedError('')
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

        const newLanguage = await getAndChangeUserLanguage()

        if (newLanguage) {
          await i18n.changeLanguage(newLanguage)
          setMmkvLocale(newLanguage)
        }
      } catch (error) {
        if (isErrorWithName(error)) {
          setExpectedError(error.name)
        }
        // TODO handle error
      }
      setLoading(false)
    }
  }

  return (
    <DismissKeyboard>
      <ScreenView>
        <ScreenContent>
          <View className="g-2">
            <Typography variant="h1">{t('Auth.enterVerificationCode')}</Typography>

            <Typography>{t('Auth.verificationText', { phone })}</Typography>
          </View>

          <View className="g-4">
            <CodeInput
              autoFocus
              accessibilityLabel={t('Auth.codeInputLabel')}
              // TODO translation
              error={expectedError ? t(`Auth.errors.${expectedError}`) : undefined}
              value={code}
              setValue={setCode}
              onFocus={handleInputFocus}
              onBlur={handleConfirmSignIn}
            />

            <View className="g-3">
              {phone && expectedError === 'NotAuthorizedException' ? (
                <Button variant="secondary" onPress={() => resendConfirmationCode(phone)}>
                  {t('Auth.resendCode')}
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
