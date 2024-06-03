import { useTicketPurchaseTranslation } from '@/components/purchase/PaymentStatus/useTicketPurchaseTranslation'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import BoughtTicket from '@/components/tickets/BoughtTicket'
import { TicketDto } from '@/modules/backend/openapi-generated'

type Props = {
  ticket: TicketDto
  purchaseType: 'payment' | 'prolongation'
}

const SuccessContent = ({ ticket, purchaseType }: Props) => {
  const translationMap = useTicketPurchaseTranslation()

  return (
    <ContentWithAvatar
      variant="success"
      title={translationMap[purchaseType].successTitle}
      text={translationMap[purchaseType].successText}
    >
      <BoughtTicket ticket={ticket} />
    </ContentWithAvatar>
  )
}

export default SuccessContent
