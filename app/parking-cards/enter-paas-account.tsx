import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useState } from 'react'

import TextInput from '@/components/inputs/TextInput'
import ContinueButton from '@/components/navigation/ContinueButton'
import Field from '@/components/shared/Field'
import Panel from '@/components/shared/Panel'
import ScreenContent from '@/components/shared/ScreenContent'
import ScreenView from '@/components/shared/ScreenView'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { VerifyEmailsDto } from '@/modules/backend/openapi-generated'

/*
 * TODO
 * - [ ] add email validation
 * - [ ] handle error on mutation (email not sent)
 */

const Page = () => {
  const t = useTranslation('AddParkingCards')

  const [email, setEmail] = useState('')

  // TODO add email validation
  const isValid = email.includes('@')

  const mutation = useMutation({
    mutationFn: (bodyInner: VerifyEmailsDto) =>
      clientApi.verifiedEmailsControllerSendEmailVerificationEmails(bodyInner),
    onError: (error) => {
      // TODO handle error, show snackbar?
      // Handled in mutation to be sure that snackbar is shown on error
      console.log('error', error)
    },
  })

  const handlePress = () => {
    const body: VerifyEmailsDto = {
      emails: [email],
    }

    mutation.mutate(body, {
      onSuccess: (res) => {
        const tmpVerificationToken = res.data[0].token
        console.log('success', res.data[0].token)
        router.push({
          pathname: '/parking-cards/verification-sent',
          params: { emailToVerify: email, tmpVerificationToken },
        })
      },
    })
  }

  return (
    <ScreenView title={t('addCardsTitle')}>
      <ScreenContent>
        <Field label={t('emailField')}>
          <TextInput
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </Field>

        <Panel>
          <Typography>{t('instructions')}</Typography>
        </Panel>

        <ContinueButton onPress={handlePress} disabled={!isValid} loading={mutation.isPending} />
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
