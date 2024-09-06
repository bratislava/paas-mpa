import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { ScrollView, View } from 'react-native'

import ParkingCardTypeRow from '@/components/controls/payment-methods/rows/ParkingCardTypeRow'
import TextInput from '@/components/inputs/TextInput'
import ContinueButton from '@/components/navigation/ContinueButton'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import AccessibilityField from '@/components/shared/AccessibilityField'
import DismissKeyboard from '@/components/shared/DismissKeyboard'
import Field from '@/components/shared/Field'
import Markdown from '@/components/shared/Markdown'
import Panel from '@/components/shared/Panel'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { SERVICEERROR, VerifyEmailsDto } from '@/modules/backend/openapi-generated'
import { isServiceError } from '@/utils/errorService'
import { isValidEmail } from '@/utils/isValidEmail'

export type VerificationIndexSearchParams = {
  // "Boolean" is not supported by expo-router, so we parse it as string
  // GitHub discussion: https://github.com/expo/router/discussions/806
  isFirstPurchase?: string
}

const Page = () => {
  const { t } = useTranslation()

  const { isFirstPurchase: isFirstPurchaseParam } =
    useLocalSearchParams<VerificationIndexSearchParams>()
  const isFirstPurchase = isFirstPurchaseParam === 'true'

  const [email, setEmail] = useState('')
  const [cardType, setCardType] = useState<VerifyEmailsDto['type'] | null>(null)

  const [expectedError, setExpectedError] = useState<string | null>(null)

  const translationMap = {
    EmailAlreadyVerified: t('AddParkingCards.Errors.EmailAlreadyVerified'),
    GeneralError: t('AddParkingCards.Errors.GeneralError'),
    InvalidEmail: t('AddParkingCards.Errors.InvalidEmail'),
  }

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
        setExpectedError(translationMap.EmailAlreadyVerified)
      else {
        setExpectedError(translationMap.GeneralError)
      }
    },
  })

  const handleChangeText = (value: string) => {
    if (expectedError) {
      setExpectedError(null)
    }

    setEmail(value.toLowerCase())
  }

  const handleSendVerificationEmail = () => {
    if (isValidEmail(email)) {
      const body: VerifyEmailsDto = {
        emails: [email.toLowerCase().trim()], // double check before sending to the backend
        type: cardType ?? undefined,
      }

      mutation.mutate(body)
    } else {
      setExpectedError(translationMap.InvalidEmail)
    }
  }

  const handlePanelPress = (cardTypeInner: VerifyEmailsDto['type'] | null) => {
    setCardType(cardTypeInner)
  }

  const cardTypePanels = ['all', 'bonus-cards', 'visitor-cards'] as const

  return (
    <ScreenView title={t('AddParkingCards.addCardsTitle')}>
      {/* alwaysBounceVertical disables bouncing when view doesn't exceed parents height (when there is not need for scrolling) */}
      <ScrollView alwaysBounceVertical={false}>
        <DismissKeyboard>
          <ScreenContent>
            <AccessibilityField
              label={t('AddParkingCards.emailField')}
              errorMessage={expectedError ?? undefined}
            >
              <TextInput
                value={email}
                onChangeText={handleChangeText}
                keyboardType="email-address"
                autoCapitalize="none"
                hasError={!!expectedError}
                autoComplete="email"
                autoCorrect={false}
                autoFocus
                onSubmitEditing={handleSendVerificationEmail}
              />
            </AccessibilityField>

            <Field
              label={t('AddParkingCards.fieldParkingCardType.label')}
              helptext={t('AddParkingCards.fieldParkingCardType.helptext')}
            >
              {cardTypePanels.map((panel) => {
                let cardTypeInner: VerifyEmailsDto['type'] | undefined | null

                if (panel === 'bonus-cards') cardTypeInner = 'BPK'
                if (panel === 'visitor-cards') cardTypeInner = 'NPK'
                if (panel === 'all') cardTypeInner = null // null for ALL types

                return (
                  <PressableStyled key={panel} onPress={() => handlePanelPress(cardTypeInner)}>
                    <ParkingCardTypeRow
                      variant={panel}
                      selected={
                        cardType === cardTypeInner ?? (panel === 'all' && cardTypeInner === null)
                      }
                    />
                  </PressableStyled>
                )
              })}
            </Field>

            <Panel>
              <Typography>{t('AddParkingCards.instructions')}</Typography>
              {isFirstPurchase ? (
                <Typography>
                  {`\n`}
                  {t('AddParkingCards.instructions.firstPurchaseAdditionalInfo')}
                </Typography>
              ) : null}
            </Panel>

            <View className="g-10">
              <ContinueButton onPress={handleSendVerificationEmail} loading={mutation.isPending} />

              {isFirstPurchase ? (
                <View className="g-2">
                  <Typography variant="h2">{t('AddParkingCards.noParkingCard')}</Typography>
                  <Markdown>{t('AddParkingCards.noParkingCardDescription')}</Markdown>
                </View>
              ) : null}
            </View>
          </ScreenContent>
        </DismissKeyboard>
      </ScrollView>
    </ScreenView>
  )
}

export default Page
