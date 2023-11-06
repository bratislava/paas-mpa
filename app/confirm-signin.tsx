import { useState } from 'react'

import TextInput from '@/components/inputs/TextInput'
import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Typography from '@/components/shared/Typography'
import { useSignInOrSignUp } from '@/hooks/useSignInOrSignUp'
import { useTranslation } from '@/hooks/useTranslation'

const Page = () => {
  const t = useTranslation('EnterVerificationCode')

  const [code, setCode] = useState('')

  const { confirmSignIn } = useSignInOrSignUp()

  return (
    <ScreenView>
      <ScreenContent>
        <Typography variant="h1">{t('enterVerificationCode')}</Typography>

        <TextInput
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          autoComplete="one-time-code"
          textAlign="center"
          autoFocus
          onSubmitEditing={() => confirmSignIn(code)}
        />

        <Typography>{t('instructions')}</Typography>

        <ContinueButton onPress={() => confirmSignIn(code)} />
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
