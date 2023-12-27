import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { router } from 'expo-router'
import { useState } from 'react'

import TextInput from '@/components/inputs/TextInput'
import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import DismissKeyboard from '@/components/shared/DissmissKeyboard'
import Field from '@/components/shared/Field'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { SERVICEERROR, VerifyEmailsDto } from '@/modules/backend/openapi-generated'
import { isServiceError } from '@/utils/errorService'
import { isValidEmail } from '@/utils/isValidEmail'

const Page = () => {
  const t = useTranslation('AddParkingCards')

  const [email, setEmail] = useState('')

  const [expectedError, setExpectedError] = useState<string | null>(null)

  // TODO deduplicate this mutation (it's also used in verification-result.tsx)
  const mutation = useMutation({
    mutationFn: (bodyInner: VerifyEmailsDto) =>
      clientApi.verifiedEmailsControllerSendEmailVerificationEmails(bodyInner),
    onSuccess: (res) => {
      const tmpVerificationToken = res.data[0].token

      router.push({
        pathname: '/parking-cards/verification/verification-sent',
        params: {
          email,
          tmpVerificationToken,
        },
      })
    },
    onError: (error) => {
      if (
        isAxiosError(error) &&
        isServiceError(error.response?.data) &&
        error.response?.data.errorName === SERVICEERROR.EmailAlreadyVerified
      )
        setExpectedError('EmailAlreadyVerified')
      else setExpectedError('GeneralError')
    },
  })

  const handleChangeText = (val: string) => {
    if (expectedError) {
      setExpectedError(null)
    }

    setEmail(val)
  }

  const handleSendVerificationEmail = () => {
    if (isValidEmail(email)) {
      const body: VerifyEmailsDto = {
        emails: [email],
      }

      mutation.mutate(body)
    } else {
      setExpectedError('InvalidEmail')
    }
  }

  return (
    <DismissKeyboard>
      <ScreenView title={t('addCardsTitle')} hasBackButton>
        <ScreenContent>
          <Field
            label={t('emailField')}
            errorMessage={expectedError ? t(`Errors.${expectedError}`) : undefined}
          >
            <TextInput
              value={email}
              onChangeText={handleChangeText}
              keyboardType="email-address"
              autoCapitalize="none"
              hasError={!!expectedError}
              autoComplete="email"
              autoCorrect={false}
              onSubmitEditing={handleSendVerificationEmail}
            />
          </Field>

          <Panel>
            <Typography>{t('instructions')}</Typography>
          </Panel>

          <ContinueButton onPress={handleSendVerificationEmail} loading={mutation.isPending} />
        </ScreenContent>
      </ScreenView>
    </DismissKeyboard>
  )
}

export default Page
