import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, router, Stack, useLocalSearchParams } from 'expo-router'
import React from 'react'

import ContinueButton from '@/components/navigation/ContinueButton'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { verifiedEmailsOptions } from '@/modules/backend/constants/queryOptions'
import { VerifyEmailsDto } from '@/modules/backend/openapi-generated'

/**
 * This page handles redirects from BE to show email verification result.
 *
 * Do not change the path unless it's changed in BE as well!
 *
 * Figma: https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-mpa?node-id=1300%3A11943&mode=dev
 */

type VerificationResultSearchParams = {
  email: string
  status: 'verified' | 'verified-no-cards' | 'link-expired'
}

const VerificationResultPage = () => {
  const t = useTranslation('VerificationResult')
  const queryClient = useQueryClient()
  const { email, status } = useLocalSearchParams<VerificationResultSearchParams>()

  queryClient.refetchQueries({ queryKey: verifiedEmailsOptions().queryKey, type: 'active' })

  // TODO deduplicate this mutation (it's also used in ./index.tsx)
  const mutation = useMutation({
    mutationFn: (bodyInner: VerifyEmailsDto) =>
      clientApi.verifiedEmailsControllerSendEmailVerificationEmails(bodyInner),
    onSuccess: (res) => {
      const tmpVerificationToken = res.data[0].token
      const tmpVerificationKey = res.data[0].key

      router.push({
        pathname: '/parking-cards/verification/verification-sent',
        params: {
          emailToVerify: email,
          tmpVerificationKey,
          tmpVerificationToken,
        },
      })
    },
  })

  const handleResendVerification = () => {
    const body: VerifyEmailsDto = {
      emails: [email ?? ''],
    }

    mutation.mutate(body)
  }

  return (
    <ScreenViewCentered
      actionButton={
        status === 'link-expired' ? (
          <ContinueButton onPress={handleResendVerification}>
            {t(`${status}.actionButtonLabel`)}
          </ContinueButton>
        ) : (
          <Link asChild replace href={{ pathname: '/parking-cards' }}>
            <ContinueButton>{t(`${status}.actionButtonLabel`)}</ContinueButton>
          </Link>
        )
      }
    >
      <Stack.Screen options={{ headerShown: false }} />

      {email && status ? (
        <ContentWithAvatar
          variant={status.startsWith('verified') ? 'success' : 'error'}
          title={t(`${status}.title`)}
          text={t(`${status}.text`, { email })}
        />
      ) : (
        // TODO
        <ContentWithAvatar variant="error" title="Unexpected error" />
      )}
    </ScreenViewCentered>
  )
}

export default VerificationResultPage
