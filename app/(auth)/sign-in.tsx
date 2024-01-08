import { useState } from 'react'
import { SafeAreaView, View } from 'react-native'

import TextInput from '@/components/inputs/TextInput'
import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import DismissKeyboard from '@/components/shared/DissmissKeyboard'
import Markdown from '@/components/shared/Markdown'
import Typography from '@/components/shared/Typography'
import { useIsOnboardingFinished } from '@/hooks/useIsOnboardingFinished'
import { useSignInOrSignUp } from '@/hooks/useSignInOrSignUp'
import { useTranslation } from '@/hooks/useTranslation'
import { isErrorWithName } from '@/utils/errorCognitoAuth'

const Page = () => {
  const t = useTranslation('Auth')
  const { attemptSignInOrSignUp } = useSignInOrSignUp()
  const [isOnboardingFinished] = useIsOnboardingFinished()

  const [loading, setLoading] = useState(false)
  const [errorCode, setErrorCode] = useState('')
  const [phone, setPhone] = useState('')

  const handleInputFocus = () => {
    if (errorCode) {
      setErrorCode('')
    }
  }

  const phoneWithoutSpaces = phone.replaceAll(/\s/g, '')

  const handleSignIn = async () => {
    try {
      setLoading(true)
      if (!phoneWithoutSpaces) {
        throw new Error('No phone number')
      }

      await attemptSignInOrSignUp(phoneWithoutSpaces)
    } catch (error) {
      if (isErrorWithName(error)) {
        setErrorCode(error.name)
      }
    }

    setLoading(false)
  }

  const handleChangeText = (value: string) => {
    if (errorCode) {
      setErrorCode('')
    }
    setPhone(value)
  }

  return (
    <DismissKeyboard>
      <ScreenView
        title={isOnboardingFinished ? undefined : ' '}
        hasBackButton={!isOnboardingFinished}
      >
        <ScreenContent>
          <SafeAreaView>
            <Typography variant="h1">{t('enterPhoneNumber')}</Typography>
          </SafeAreaView>

          <View className="g-1">
            {/* Note that `onSubmitEditing` on iOS isn't called when using keyboardType="phone-pad": https://reactnative.dev/docs/textinput#onsubmitediting */}
            {/* Adding returnKeyType="done" adds Done button above keyboard, otherwise, there is no "Enter" button */}
            <TextInput
              value={phone}
              onChangeText={handleChangeText}
              keyboardType="phone-pad"
              autoComplete="tel"
              hasError={!!errorCode}
              onFocus={handleInputFocus}
              autoFocus
              returnKeyType="done"
              placeholder="+421"
              onSubmitEditing={handleSignIn}
            />

            {errorCode ? (
              <Typography className="text-negative">{t(`errors.${errorCode}`)}</Typography>
            ) : null}
          </View>

          <Markdown>{t('consent')}</Markdown>

          <ContinueButton loading={loading} disabled={!phoneWithoutSpaces} onPress={handleSignIn} />
        </ScreenContent>
      </ScreenView>
    </DismissKeyboard>
  )
}

export default Page
