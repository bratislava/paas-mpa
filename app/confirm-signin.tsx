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

  const { signInResult, setSignInResult } = useGlobalStoreContext()

  const confirmSignIn = async () => {
    try {
      if (signInResult) {
        await Auth.confirmSignIn(signInResult, code)
        setSignInResult(null)
        router.push('/')
      } else {
        console.log('Unexpected error, no loginResult provided in GlobalStore.')
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
        <Button onPress={confirmSignIn}>{t('Navigation.continue')}</Button>
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
