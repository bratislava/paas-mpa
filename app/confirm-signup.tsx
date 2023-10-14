import { Auth } from 'aws-amplify'
import { router } from 'expo-router'
import { useState } from 'react'

import TextInput from '@/components/inputs/TextInput'
import Button from '@/components/shared/Button'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { useGlobalStoreContext } from '@/state/hooks/useGlobalStoreContext'
import { GENERIC_ERROR_MESSAGE, isError } from '@/utils/errors'

const Page = () => {
  const t = useTranslation()
  const [code, setCode] = useState('')

  const { signUpPhone, setSignUpPhone } = useGlobalStoreContext()

  const confirmSignUp = async () => {
    try {
      if (signUpPhone) {
        await Auth.confirmSignUp(signUpPhone, code)
        setSignUpPhone(null)
        router.push('/')
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

        <TextInput keyboardType="number-pad" value={code} onChangeText={setCode} />

        <Typography>{t('EnterVerificationCode.instructions')}</Typography>

        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <Button onPress={confirmSignUp}>{t('Navigation.continue')}</Button>
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
