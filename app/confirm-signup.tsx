import { Auth } from 'aws-amplify'
import { router } from 'expo-router'
import { useState } from 'react'

import TextInput from '@/components/inputs/TextInput'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import Typography from '@/components/shared/Typography'
import { useSignInOrSignUp } from '@/hooks/useSignInOrSignUp'
import { useTranslation } from '@/hooks/useTranslation'
import { useGlobalStoreContext } from '@/state/GlobalStoreProvider/useGlobalStoreContext'
import { GENERIC_ERROR_MESSAGE, isError } from '@/utils/errors'

const Page = () => {
  const t = useTranslation()
  const [code, setCode] = useState('')

  const { signUpPhone, setSignUpPhone } = useGlobalStoreContext()
  const { attemptSignInOrSignUp } = useSignInOrSignUp()

  const confirmSignUp = async () => {
    try {
      if (signUpPhone) {
        await Auth.confirmSignUp(signUpPhone, code)
        /* Try to sign in (second sms code will be sent) */
        await attemptSignInOrSignUp(signUpPhone)
        setSignUpPhone(null)
        router.push('/confirm-signin')
      } else {
        console.log('Unexpected error, no signUpPhone provided in GlobalStore.')
      }
    } catch (error) {
      if (isError(error)) {
        console.log('CONFIRM: error', error)
      } else {
        console.error(
          `${GENERIC_ERROR_MESSAGE} - unexpected object thrown in onVerifyEmail:`,
          error,
        )
      }
    }
  }

  return (
    <ScreenView>
      <ScreenContent>
        <Typography variant="h1">{t('EnterVerificationCode.enterVerificationCode')}</Typography>

        <TextInput
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          autoComplete="one-time-code"
          textAlign="center"
          autoFocus
          onSubmitEditing={confirmSignUp}
        />

        <Typography>{t('EnterVerificationCode.instructions')}</Typography>

        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <Button onPress={confirmSignUp}>{t('Navigation.continue')}</Button>
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
