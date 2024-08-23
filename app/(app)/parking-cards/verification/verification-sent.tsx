import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { vehiclesOptions } from '@/modules/backend/constants/queryOptions'

/*
 * Figma: https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-(mobile-app)-%5BWIP%5D?node-id=4232%3A6109&mode=dev
 */
const Page = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { email, tmpVerificationToken } = useLocalSearchParams()

  const [code, setCode] = useState('')

  // TODO handle expired token, token mismatch, add resend token button, etc.
  const mutation = useMutation({
    mutationFn: () => clientApi.verifiedEmailsControllerVerifyEmail(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehiclesOptions().queryKey })
    },
  })

  const handleVerify = () => {
    if (code.length === 6) {
      // TODO handle error
      mutation.mutate(undefined, {
        onSuccess: (res) => {
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
      })
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
              <Typography>DEV {tmpVerificationToken}</Typography>
            ) : null}
            <CodeInput
              autoFocus
              accessibilityLabel={t('AddParkingCards.codeInputLabel')}
              value={code}
              setValue={setCode}
              onBlur={handleVerify}
            />
          </ContentWithAvatar>
        </ScreenViewCentered>
      </DismissKeyboard>
    </KeyboardAvoidingView>
  )
}

export default Page
