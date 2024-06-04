import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import BoughtTicket from '@/components/tickets/BoughtTicket'
import { useTranslation } from '@/hooks/useTranslation'
import { TicketDto } from '@/modules/backend/openapi-generated'

type Props = {
  ticket: TicketDto
  purchaseType: 'payment' | 'prolongation'
}

const SuccessContent = ({ ticket, purchaseType }: Props) => {
  const { t } = useTranslation()

  const translationMap = {
    payment: {
      title: t('PurchaseScreen.paymentStatus.successful.payment.title'),
      text: t('PurchaseScreen.paymentStatus.successful.payment.text'),
    },
    prolongation: {
      title: t('PurchaseScreen.paymentStatus.successful.prolongation.title'),
      text: t('PurchaseScreen.paymentStatus.successful.prolongation.text'),
    },
  }

  return (
    <ContentWithAvatar
      variant="success"
      title={translationMap[purchaseType].title}
      text={translationMap[purchaseType].text}
    >
      <BoughtTicket ticket={ticket} />
    </ContentWithAvatar>
  )
}

export default SuccessContent
