import { router } from 'expo-router'
import { useState } from 'react'
import { SafeAreaView } from 'react-native'

import TextInput from '@/components/inputs/TextInput'
import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import StackScreenWithHeader from '@/components/screen-layout/StackScreenWithHeader'
import DismissKeyboard from '@/components/shared/DissmissKeyboard'
import Markdown from '@/components/shared/Markdown'
import Typography from '@/components/shared/Typography'
import { useIsOnboardingFinished } from '@/hooks/useIsOnboardingFinished'
import { useSignInOrSignUp } from '@/hooks/useSignInOrSignUp'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuthStoreContext } from '@/state/AuthStoreProvider/useAuthStoreContext'

const Page = () => {
  const t = useTranslation('Auth')
  const { attemptSignInOrSignUp } = useSignInOrSignUp()
  const [isOnboardingFinished] = useIsOnboardingFinished()

  const [phone, setPhone] = useState('')

  /* Redirect to home screen if user is logged in */
  const { user } = useAuthStoreContext()
  if (user) {
    router.replace('/')
  }

  const phoneWithoutSpaces = phone.replaceAll(/\s/g, '')

  return (
    <DismissKeyboard>
      <ScreenView>
        <SafeAreaView>
          <StackScreenWithHeader
            options={{
              title: '',
              headerShown: !isOnboardingFinished,
            }}
          />

          <ScreenContent>
            <Typography variant="h1">{t('enterPhoneNumber')}</Typography>

            {/* Note that `onSubmitEditing` on iOS isn't called when using keyboardType="phone-pad": https://reactnative.dev/docs/textinput#onsubmitediting */}
            {/* Adding returnKeyType="done" adds Done button above keyboard, otherwise, there is no "Enter" button */}
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoComplete="tel"
              autoFocus
              returnKeyType="done"
              placeholder="+421"
              onSubmitEditing={() => attemptSignInOrSignUp(phoneWithoutSpaces)}
            />

            <Markdown>{t('consent')}</Markdown>

            <ContinueButton onPress={() => attemptSignInOrSignUp(phoneWithoutSpaces)} />
          </ScreenContent>
        </SafeAreaView>
      </ScreenView>
    </DismissKeyboard>
  )
}

export default Page
