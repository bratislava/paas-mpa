import { useMutation } from '@tanstack/react-query'
import { Link, router, useLocalSearchParams } from 'expo-router'
import React from 'react'

import { EmailAvatar } from '@/assets/avatars'
import ContinueButton from '@/components/navigation/ContinueButton'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import Button from '@/components/shared/Button'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'

// TODO remove - this button simulates email verification
const TmpVerifyButton = () => {
  const { tmpVerificationToken, tmpVerificationKey, emailToVerify } = useLocalSearchParams<{
    emailToVerify: string
    tmpVerificationToken: string
    tmpVerificationKey: string
  }>()

  const mutation = useMutation({
    mutationFn: () =>
      clientApi.verifiedEmailsControllerVerifyEmail(
        tmpVerificationToken ?? '',
        tmpVerificationKey ?? '',
      ),
  })

  const handlePressVerify = () => {
    mutation.mutate(undefined, {
      onSuccess: (res) => {
        console.log('success', res.status)
        router.push({
          pathname: '/parking-cards/verification/verification-result',
          params: { email: emailToVerify, status: 'verified' },
        })
      },
    })
  }

  return (
    <Button variant="plain" onPress={handlePressVerify}>
      Verify
    </Button>
  )
}

/*
 * Figma: https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-(mobile-app)-%5BWIP%5D?node-id=4232%3A6109&mode=dev
 */
const Page = () => {
  const t = useTranslation('AddParkingCards')
  const { emailToVerify } = useLocalSearchParams()

  return (
    <ScreenViewCentered
      actionButton={
        <Link asChild href={{ pathname: '/parking-cards' }}>
          <ContinueButton />
        </Link>
      }
    >
      <ContentWithAvatar
        title={t('verifyYourEmail')}
        text={t('verifyYourEmailInfo', { email: emailToVerify })}
        customAvatarComponent={<EmailAvatar />}
        actionButton={<TmpVerifyButton />}
      />
    </ScreenViewCentered>
  )
}

export default Page
