import { Auth } from 'aws-amplify'
import { router } from 'expo-router'
import { useState } from 'react'

import TextInput from '@/components/inputs/TextInput'
import Button from '@/components/shared/Button'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { STATIC_TEMP_PASS } from '@/modules/cognito/amplify'
import { useGlobalStoreContext } from '@/state/hooks/useGlobalStoreContext'
import { GENERIC_ERROR_MESSAGE, isError, isErrorWithCode } from '@/utils/errors'

const Page = () => {
  const t = useTranslation()

  const [phone, setPhone] = useState('+421')

  const { setSignInResult, setSignUpPhone } = useGlobalStoreContext()

  const attemptSignInOrSignUp = async () => {
    try {
      try {
        const loginResultInner = await Auth.signIn(phone, STATIC_TEMP_PASS)
        if (loginResultInner) {
          setSignInResult(loginResultInner)
          router.push('/confirm-signin')
        }
      } catch (error) {
        if (
          isError(error) &&
          isErrorWithCode(error) &&
          error.code === 'UserNotConfirmedException'
        ) {
          console.log('UserNotConfirmedException')
          // TODO @mpinter investigate autoSignIn after resendSignUp
          const resendSignUpResult = await Auth.resendSignUp(phone)
          router.push({
            pathname: '/confirm-signup',
            params: { loginResult: JSON.stringify(resendSignUpResult) },
          })
        } else {
          // TODO @mpinter only sing up on some errors, not on all, throw the rest
          console.log('Other errors - TODO chose which to handle and which to throw.')

          setSignUpPhone(phone)
          await Auth.signUp({
            username: phone,
            password: STATIC_TEMP_PASS,
            autoSignIn: {
              enabled: true,
            },
          })
          router.push({ pathname: '/confirm-signup' })
        }
      }
    } catch (error) {
      if (isError(error)) {
        console.error(`Login Error:`, error)
      } else {
        console.error(`${GENERIC_ERROR_MESSAGE} - unexpected object thrown in signUp:`, error)
      }
    }
  }

  return (
    <ScreenView>
      <ScreenContent>
        <Typography variant="h1">{t('EnterPhoneNumber.enterPhoneNumber')}</Typography>

        <TextInput keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

        <Typography>{t('EnterPhoneNumber.consent')}</Typography>

        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <Button onPress={attemptSignInOrSignUp}>{t('Navigation.continue')}</Button>
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
