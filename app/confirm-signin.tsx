import { useState } from 'react'

import CodeInput from '@/components/inputs/CodeInput'
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

        <CodeInput autoFocus value={code} setValue={setCode} onBlur={() => confirmSignIn(code)} />

        <Typography>{t('instructions')}</Typography>

        <ContinueButton onPress={() => confirmSignIn(code)} />
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
