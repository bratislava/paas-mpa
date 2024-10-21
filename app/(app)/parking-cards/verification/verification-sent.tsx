import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'

import { EmailAvatar } from '@/assets/avatars'
import CodeInput from '@/components/inputs/CodeInput'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import Button from '@/components/shared/Button'
import DismissKeyboard from '@/components/shared/DismissKeyboard'
import Typography from '@/components/shared/Typography'
import { environment } from '@/environment'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { vehiclesInfiniteOptions } from '@/modules/backend/constants/queryOptions'
import { SERVICEERROR } from '@/modules/backend/openapi-generated'
import { isServiceError } from '@/utils/errorService'

/*
 * Figma: https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-(mobile-app)-%5BWIP%5D?node-id=4232%3A6109&mode=dev
 */
const Page = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { email, tmpVerificationToken } = useLocalSearchParams()

  const [code, setCode] = useState('')
  const [expectedError, setExpectedError] = useState<string>()

  const SERVICE_ERROR_TRANSLATION_KEY_MAP: Partial<Record<SERVICEERROR, string>> = {
    [SERVICEERROR.EmailVerificationTokenIncorrect]: t('AddParkingCards.Errors.TokenIncorrect'),
    [SERVICEERROR.EmailVerificationTokenExpired]: t('AddParkingCards.Errors.TokenExpired'),
  }

  // TODO handle expired token, token mismatch, add resend token button, etc.
  const mutation = useMutation({
    mutationFn: (verificationCode: string) =>
      clientApi.verifiedEmailsControllerVerifyEmail(verificationCode),
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({ queryKey: vehiclesInfiniteOptions().queryKey })

      const licencePlates = res.data.map((item) => item.vehiclePlateNumber).filter(Boolean)

      router.replace({
        pathname: '/parking-cards/verification/verification-result',
        params: {
          email,
          status: 'verified',
          licencePlates: licencePlates.join(', '),
        },
      })
    },
    onError: (error) => {
      const translation =
        isAxiosError(error) && isServiceError(error.response?.data)
          ? SERVICE_ERROR_TRANSLATION_KEY_MAP[error.response.data.errorName]
          : t('AddParkingCards.Errors.GeneralError')

      setExpectedError(translation)
    },
  })

  const handleVerify = () => {
    if (code.length === 6) {
      mutation.mutate(code)
    }
  }

  const handleFocus = () => {
    if (expectedError) {
      setExpectedError('')
    }
  }

  return (
    <KeyboardAvoidingView
      className="h-full"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <DismissKeyboard>
        <ScreenViewCentered options={{ headerTransparent: true }}>
          <ContentWithAvatar
            title={t('AddParkingCards.verifyYourEmail')}
            text={t('AddParkingCards.verifyYourEmailInfo', { email })}
            asMarkdown
            customAvatarComponent={<EmailAvatar />}
            actionButton={
              <Button onPress={handleVerify} loading={mutation.isPending}>
                {t('AddParkingCards.verifyButton')}
              </Button>
            }
          >
            {/* eslint-disable-next-line unicorn/no-negated-condition */}
            {environment.deployment !== 'production' ? (
              <Typography testID="tmpVerificationToken">{tmpVerificationToken}</Typography>
            ) : null}
            <CodeInput
              autoFocus
              accessibilityLabel={t('AddParkingCards.codeInputLabel')}
              value={code}
              setValue={setCode}
              onFocus={handleFocus}
              onBlur={handleVerify}
              error={expectedError}
            />
          </ContentWithAvatar>
        </ScreenViewCentered>
      </DismissKeyboard>
    </KeyboardAvoidingView>
  )
}

export default Page
