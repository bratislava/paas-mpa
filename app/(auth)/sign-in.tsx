import { router } from 'expo-router'
import { useState } from 'react'

import TextInput from '@/components/inputs/TextInput'
import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Typography from '@/components/shared/Typography'
import { useSignInOrSignUp } from '@/hooks/useSignInOrSignUp'
import { useTranslation } from '@/hooks/useTranslation'
import { useGlobalStoreContext } from '@/state/GlobalStoreProvider/useGlobalStoreContext'

const Page = () => {
  const t = useTranslation('Auth')
  const { attemptSignInOrSignUp } = useSignInOrSignUp()

  const [phone, setPhone] = useState('+')

  /* Redirect to home screen if user is logged in */
  const { user } = useGlobalStoreContext()
  if (user) {
    router.replace('/')
  }

  return (
    <ScreenView>
      <ScreenContent>
        <Typography variant="h1">{t('enterPhoneNumber')}</Typography>

        {/* Note that `onSubmitEditing` on iOS isn't called when using keyboardType="phone-pad". */}
        {/* https://reactnative.dev/docs/textinput#onsubmitediting  */}
        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          autoComplete="tel"
          autoFocus
          onSubmitEditing={() => attemptSignInOrSignUp(phone)}
        />

        <Typography>{t('consent')}</Typography>

        <ContinueButton onPress={() => attemptSignInOrSignUp(phone)} />
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
