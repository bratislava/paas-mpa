import { useTicketPurchaseTranslation } from '@/components/purchase/PaymentStatus/useTicketPurchaseTranslation'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'

type Props = {
  message: string
  purchaseType?: 'payment' | 'prolongation'
}

const ErrorContent = ({
  message,
  // We cannot determine the purchaseType if useQuery has errored, because there is no `data`, so we display default payment error
  purchaseType = 'payment',
}: Props) => {
  const translationMap = useTicketPurchaseTranslation()

  return (
    <ContentWithAvatar
      variant="error"
      title={translationMap[purchaseType].failedTitle}
      text={translationMap[purchaseType].failedText}
    >
      <Panel className="bg-negative-light">
        <Typography>{message}</Typography>
      </Panel>
    </ContentWithAvatar>
  )
}

export default ErrorContent
