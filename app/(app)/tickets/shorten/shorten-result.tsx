import { Link, router, useLocalSearchParams } from 'expo-router'

import ContinueButton from '@/components/navigation/ContinueButton'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import ScreenViewCentered from '@/components/screen-layout/ScreenViewCentered'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
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
      title={t('result')}
      hasBackButton
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
      {/* <Stack.Screen options={{ headerShown: false }} /> */}

      {status === 'error' ? (
        <ContentWithAvatar variant="error" title={t('failed')} text={t('failedText')}>
          <Panel className="bg-negative-light">
            <Typography>{t('failedMessage')}</Typography>
          </Panel>
        </ContentWithAvatar>
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
