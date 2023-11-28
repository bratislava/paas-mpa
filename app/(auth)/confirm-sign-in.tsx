import { router } from 'expo-router'
import { useState } from 'react'

import CodeInput from '@/components/inputs/CodeInput'
import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Typography from '@/components/shared/Typography'
import { useSignInOrSignUp } from '@/hooks/useSignInOrSignUp'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuthStoreContext } from '@/state/AuthStoreProvider/useAuthStoreContext'

const Page = () => {
  const t = useTranslation('Auth')
  const { confirmSignIn } = useSignInOrSignUp()

  const [code, setCode] = useState('')

  /* Redirect to home screen if user is logged in */
  const { user } = useAuthStoreContext()
  if (user) {
    router.replace('/')
  }

  return (
    <ScreenView>
      <ScreenContent>
        <Typography variant="h1">{t('enterVerificationCode')}</Typography>

        <CodeInput autoFocus value={code} setValue={setCode} onBlur={() => confirmSignIn(code)} />

        <Typography>{t('verificationText')}</Typography>

        <ContinueButton onPress={() => confirmSignIn(code)} />
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
