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
  const { tmpVerificationToken, verificationKey } = useLocalSearchParams<{
    tmpVerificationToken: string
    verificationKey: string
  }>()

  const mutation = useMutation({
    mutationFn: () =>
      clientApi.verifiedEmailsControllerVerifyEmail(
        tmpVerificationToken ?? '',
        verificationKey ?? '',
      ),
    onError: (error) => {
      // TODO handle error, show snackbar?
      // Handled in mutation to be sure that snackbar is shown on error
      console.log('error', error)
    },
  })

  const handlePressVerify = () => {
    mutation.mutate(undefined, {
      onSuccess: (res) => {
        console.log('success', res.status)
        router.push('/parking-cards')
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
