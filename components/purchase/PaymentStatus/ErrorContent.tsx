import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

type Props = {
  message: string
  purchaseType?: 'payment' | 'prolongation'
}

const ErrorContent = ({
  message,
  // We cannot determine the purchaseType if useQuery has errored, because there is no `data`, so we display default payment error
  purchaseType = 'payment',
}: Props) => {
  const { t } = useTranslation()

  const translationMap = {
    payment: {
      title: t('PurchaseScreen.paymentStatus.failed.payment.title'),
      text: t('PurchaseScreen.paymentStatus.failed.payment.text'),
    },
    prolongation: {
      title: t('PurchaseScreen.paymentStatus.failed.prolongation.title'),
      text: t('PurchaseScreen.paymentStatus.failed.prolongation.text'),
    },
  }

  return (
    <ContentWithAvatar
      variant="error"
      title={translationMap[purchaseType].title}
      text={translationMap[purchaseType].text}
    >
      <Panel className="bg-negative-light">
        <Typography>{message}</Typography>
      </Panel>
    </ContentWithAvatar>
  )
}

export default ErrorContent
