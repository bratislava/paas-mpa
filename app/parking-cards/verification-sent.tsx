import { useMutation } from '@tanstack/react-query'
import { Link, router, useLocalSearchParams } from 'expo-router'
import React from 'react'

import AvatarCircle from '@/components/info/AvatarCircle'
import ContinueButton from '@/components/navigation/ContinueButton'
import Button from '@/components/shared/Button'
import CenteredScreenView from '@/components/shared/CenteredScreenView'
import ScreenContent from '@/components/shared/ScreenContent'
import Typography from '@/components/shared/Typography'
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

  return <Button onPress={handlePressVerify}>Verify</Button>
}

/*
 * TODO
 * - [ ] add nextHref page after verification email is sent
 *
 * figma: https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-(mobile-app)-%5BWIP%5D?node-id=4232%3A6109&mode=dev
 */
const Page = () => {
  const t = useTranslation('AddParkingCards')
  const { emailToVerify } = useLocalSearchParams()

  return (
    // TODO add dynamic href
    <CenteredScreenView
      actionButton={
        <Link asChild href={{ pathname: '/parking-cards' }}>
          <ContinueButton />
        </Link>
      }
    >
      <ScreenContent variant="center">
        {/* TODO replace by icon */}
        <AvatarCircle variant="info" />
        <Typography variant="h1">{t('verifyYourEmail')}</Typography>

        <Typography>{t('verifyYourEmailInfo', { email: emailToVerify })}</Typography>

        <TmpVerifyButton />
      </ScreenContent>
    </CenteredScreenView>
  )
}

export default Page
