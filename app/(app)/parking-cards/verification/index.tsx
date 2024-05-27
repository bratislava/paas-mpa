import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { router } from 'expo-router'
import { useState } from 'react'
import { ScrollView, View } from 'react-native'

import TextInput from '@/components/inputs/TextInput'
import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import AccessibilityField from '@/components/shared/AccessibilityField'
import DismissKeyboard from '@/components/shared/DismissKeyboard'
import Markdown from '@/components/shared/Markdown'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { SERVICEERROR, VerifyEmailsDto } from '@/modules/backend/openapi-generated'
import { isServiceError } from '@/utils/errorService'
import { isValidEmail } from '@/utils/isValidEmail'

const Page = () => {
  const { t } = useTranslation()

  const [email, setEmail] = useState('')

  const [expectedError, setExpectedError] = useState<string | null>(null)

  // TODO deduplicate this mutation (it's also used in verification-result.tsx)
  const mutation = useMutation({
    mutationFn: (bodyInner: VerifyEmailsDto) =>
      clientApi.verifiedEmailsControllerSendEmailVerificationEmails(bodyInner),
    onSuccess: (res) => {
      // purposefully removed from DTO, just for development purposes
      // @ts-ignore
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

    setEmail(val?.toLowerCase())
  }

  const handleSendVerificationEmail = () => {
    if (isValidEmail(email)) {
      const body: VerifyEmailsDto = {
        emails: [email.toLowerCase()], // double check before sending to the backend
      }

      mutation.mutate(body)
    } else {
      setExpectedError('InvalidEmail')
    }
  }

  // TODO translations
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const translationKeys = [
    t('AddParkingCards.Errors.EmailAlreadyVerified'),
    t('AddParkingCards.Errors.GeneralError'),
    t('AddParkingCards.Errors.InvalidEmail'),
  ]

  return (
    <ScreenView title={t('AddParkingCards.addCardsTitle')}>
      {/* alwaysBounceVertical disables bouncing when view doesn't exceed parents height (when there is not need for scrolling) */}
      <ScrollView alwaysBounceVertical={false}>
        <DismissKeyboard>
          <ScreenContent>
            <AccessibilityField
              label={t('AddParkingCards.emailField')}
              errorMessage={
                expectedError ? t(`AddParkingCards.Errors.${expectedError}`) : undefined
              }
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
            </AccessibilityField>

            <Panel>
              <Typography>{t('AddParkingCards.instructions')}</Typography>
            </Panel>

            <View className="g-10">
              <ContinueButton onPress={handleSendVerificationEmail} loading={mutation.isPending} />

              <View className="g-2">
                <Typography variant="h2">{t('AddParkingCards.noParkingCard')}</Typography>
                <Markdown>{t('AddParkingCards.noParkingCardDescription')}</Markdown>
              </View>
            </View>
          </ScreenContent>
        </DismissKeyboard>
      </ScrollView>
    </ScreenView>
  )
}

export default Page
