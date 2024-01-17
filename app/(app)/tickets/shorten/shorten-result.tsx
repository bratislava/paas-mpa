import { Link, router, useLocalSearchParams } from 'expo-router'

import ContinueButton from '@/components/navigation/ContinueButton'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import { useTranslation } from '@/hooks/useTranslation'

/*
 * Figma: https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-mpa?node-id=1300%3A11943&mode=dev
 */

// TODO may need update depending on changes in figma
type VerificationResultSearchParams = {
  ticketId: string
  status: 'success' | 'error'
}

const ShortenResultPage = () => {
  const t = useTranslation('ShortenTicket')
  const { status, ticketId } = useLocalSearchParams<VerificationResultSearchParams>()

  return (
    <ScreenViewCentered
      options={{ headerShown: false }}
      backgroundVariant={status === 'error' ? 'dots' : undefined}
      actionButton={
        status === 'error' ? (
          <Link asChild replace href={{ pathname: '/tickets/shorten/', params: { ticketId } }}>
            <ContinueButton>{t(`${status}.actionButtonLabel`)}</ContinueButton>
          </Link>
        ) : (
          <ContinueButton onPress={router.back}>{t(`${status}.actionButtonLabel`)}</ContinueButton>
        )
      }
    >
      {status === 'error' ? (
        <ContentWithAvatar variant="error" title={t('failed')} text={t('failedText')} />
      ) : (
        // TODO
        <ContentWithAvatar variant="success" title={t('successful')} text={t('successfulText')}>
          {/* <BoughtTicket ticket={data} /> */}
        </ContentWithAvatar>
      )}
    </ScreenViewCentered>
  )
}

export default ShortenResultPage
