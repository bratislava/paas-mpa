import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, router, useLocalSearchParams } from 'expo-router'

import ContinueButton from '@/components/navigation/ContinueButton'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { verifiedEmailsInfiniteOptions } from '@/modules/backend/constants/queryOptions'
import { VerifyEmailsDto } from '@/modules/backend/openapi-generated'

/*
 * Figma: https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-mpa?node-id=1300%3A11943&mode=dev
 */

// TODO may need update depending on changes in figma
type VerificationResultSearchParams = {
  email: string
  status: 'verified' | 'verified-no-cards' | 'link-expired'
}

const VerificationResultPage = () => {
  const t = useTranslation('VerificationResult')
  const queryClient = useQueryClient()
  const { email, status } = useLocalSearchParams<VerificationResultSearchParams>()

  queryClient.refetchQueries({ queryKey: verifiedEmailsInfiniteOptions().queryKey, type: 'active' })

  // TODO deduplicate this mutation (it's also used in ./index.tsx)
  const mutation = useMutation({
    mutationFn: (bodyInner: VerifyEmailsDto) =>
      clientApi.verifiedEmailsControllerSendEmailVerificationEmails(bodyInner),
    onSuccess: () => {
      router.replace({
        pathname: '/parking-cards/verification/verification-sent',
        params: { email },
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
      {/* <Stack.Screen options={{ headerShown: false }} /> */}

      {email && status ? (
        <ContentWithAvatar
          variant={status.startsWith('verified') ? 'success' : 'error'}
          title={t(`${status}.title`)}
          text={t(`${status}.text`, { email })}
          asMarkdown
        />
      ) : (
        // TODO
        <ContentWithAvatar variant="error" title="Unexpected error" />
      )}
    </ScreenViewCentered>
  )
}

export default VerificationResultPage
