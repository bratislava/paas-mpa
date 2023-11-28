import { router, Stack } from 'expo-router'
import { useState } from 'react'

import TextInput from '@/components/inputs/TextInput'
import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Markdown from '@/components/shared/Markdown'
import Typography from '@/components/shared/Typography'
import { useSignInOrSignUp } from '@/hooks/useSignInOrSignUp'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuthStoreContext } from '@/state/AuthStoreProvider/useAuthStoreContext'

const Page = () => {
  const t = useTranslation('Auth')
  const { attemptSignInOrSignUp } = useSignInOrSignUp()

  const [phone, setPhone] = useState('+')

  /* Redirect to home screen if user is logged in */
  const { user } = useAuthStoreContext()
  if (user) {
    router.replace('/')
  }

  const phoneWithoutSpaces = phone.replaceAll(/\s/g, '')

  return (
    <ScreenView>
      <Stack.Screen options={{ headerBackVisible: false }} />

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
          onSubmitEditing={() => attemptSignInOrSignUp(phoneWithoutSpaces)}
        />

        <Markdown>{t('consent')}</Markdown>

        <ContinueButton onPress={() => attemptSignInOrSignUp(phoneWithoutSpaces)} />
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
