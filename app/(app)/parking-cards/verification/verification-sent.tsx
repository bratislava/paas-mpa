import { useMutation } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'

import { EmailAvatar } from '@/assets/avatars'
import CodeInput from '@/components/inputs/CodeInput'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import Button from '@/components/shared/Button'
import DismissKeyboard from '@/components/shared/DissmissKeyboard'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'

/*
 * Figma: https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-(mobile-app)-%5BWIP%5D?node-id=4232%3A6109&mode=dev
 */
const Page = () => {
  const t = useTranslation('AddParkingCards')
  const { email, tmpVerificationToken } = useLocalSearchParams()

  const [code, setCode] = useState('')

  // TODO handle expired token, token mismatch, add resend token button, etc.
  const mutation = useMutation({
    mutationFn: () => clientApi.verifiedEmailsControllerVerifyEmail(code),
  })

  const handleVerify = () => {
    mutation.mutate(undefined, {
      onSuccess: (res) => {
        console.log('success', res.status)
        router.replace({
          pathname: '/parking-cards/verification/verification-result',
          params: { email, status: 'verified' },
        })
      },
    })
  }

  return (
    <KeyboardAvoidingView
      className="h-full"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <DismissKeyboard>
        <ScreenViewCentered actionButton={<Button onPress={handleVerify}>Verify</Button>}>
          <ContentWithAvatar
            title={t('verifyYourEmail')}
            text={t('verifyYourEmailInfo', { email })}
            customAvatarComponent={<EmailAvatar />}
          >
            <Typography>{tmpVerificationToken}</Typography>
            <CodeInput value={code} setValue={setCode} onBlur={handleVerify} />
          </ContentWithAvatar>
        </ScreenViewCentered>
      </DismissKeyboard>
    </KeyboardAvoidingView>
  )
}

export default Page
