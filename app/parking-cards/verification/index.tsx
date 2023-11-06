import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useState } from 'react'

import TextInput from '@/components/inputs/TextInput'
import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Field from '@/components/shared/Field'
import Panel from '@/components/shared/Panel'
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

  // TODO deduplicate this mutation (it's also used in link-expired.tsx)
  const mutation = useMutation({
    mutationFn: (bodyInner: VerifyEmailsDto) =>
      clientApi.verifiedEmailsControllerSendEmailVerificationEmails(bodyInner),
    onSuccess: (res) => {
      const tmpVerificationToken = res.data[0].token

      router.replace({
        pathname: '/parking-cards/verification/verification-sent',
        params: {
          email,
          tmpVerificationToken,
        },
      })
    },
  })

  const handleSendVerificationEmail = () => {
    const body: VerifyEmailsDto = {
      emails: [email],
    }

    mutation.mutate(body)
  }

  return (
    <ScreenView title={t('addCardsTitle')}>
      <ScreenContent>
        <Field label={t('emailField')}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            onSubmitEditing={handleSendVerificationEmail}
          />
        </Field>

        <Panel>
          <Typography>{t('instructions')}</Typography>
        </Panel>

        <ContinueButton
          onPress={handleSendVerificationEmail}
          disabled={!isValid}
          loading={mutation.isPending}
        />
      </ScreenContent>
    </ScreenView>
  )
}

export default Page
