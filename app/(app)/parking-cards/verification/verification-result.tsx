import { useMutation, useQueryClient } from '@tanstack/react-query'
import { router, useLocalSearchParams } from 'expo-router'

import ContinueButton from '@/components/navigation/ContinueButton'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { verifiedEmailsInfiniteOptions } from '@/modules/backend/constants/queryOptions'
import { VerifyEmailsDto } from '@/modules/backend/openapi-generated'

/*
 * Figma: https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-mpa?node-id=1300%3A11943&mode=dev
 */

type StatusType = 'verified' | 'verified-no-cards' | 'link-expired'

// TODO may need update depending on changes in figma
type VerificationResultSearchParams = {
  email: string
  status: StatusType
  licencePlatesString?: string
}

// TODO translation
const VerificationResultPage = () => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { email, status, licencePlatesString } =
    useLocalSearchParams<VerificationResultSearchParams>()

  const translationsMapStatuses = {
    verified: {
      actionButtonLabel: t('VerificationResult.verified.actionButtonLabel'),
      text: t('VerificationResult.verified.text', { email }),
      title: t('VerificationResult.verified.title', { email }),
    },
    'verified-no-cards': {
      actionButtonLabel: t('VerificationResult.verified-no-cards.actionButtonLabel'),
      text: t('VerificationResult.verified-no-cards.text', { email }),
      title: t('VerificationResult.verified-no-cards.title', { email }),
    },
    'link-expired': {
      actionButtonLabel: t('VerificationResult.link-expired.actionButtonLabel'),
      text: t('VerificationResult.link-expired.text', { email }),
      title: t('VerificationResult.link-expired.title', { email }),
    },
  } satisfies Record<StatusType, { actionButtonLabel: string; text: string; title: string }>

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

  if (!status) {
    return <Typography>No status provided in url.</Typography>
  }

  const getContentText = () => {
    let { text } = translationsMapStatuses[status]

    if (status === 'verified' && licencePlatesString) {
      text += `\n\n${t('VerificationResult.verified.vehicleText', {
        licencePlatesString,
        count: licencePlatesString.split(', ').length,
      })}`
    }

    return text
  }

  return (
    <ScreenViewCentered
      options={{ headerTransparent: true }}
      actionButton={
        status === 'link-expired' ? (
          <ContinueButton onPress={handleResendVerification}>
            {translationsMapStatuses[status].actionButtonLabel}
          </ContinueButton>
        ) : (
          <ContinueButton onPress={router.back}>
            {translationsMapStatuses[status].actionButtonLabel}
          </ContinueButton>
        )
      }
    >
      {email && status ? (
        <ContentWithAvatar
          variant={status.startsWith('verified') ? 'success' : 'error'}
          title={translationsMapStatuses[status].title}
          text={getContentText()}
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
