import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import BoughtTicket from '@/components/tickets/BoughtTicket'
import { useEffectOnce } from '@/hooks/useEffectOnce'
import { useLiveActivities } from '@/hooks/useLiveActivities'
import { useTranslation } from '@/hooks/useTranslation'
import { TicketDto } from '@/modules/backend/openapi-generated'

type Props = {
  ticket: TicketDto
  purchaseType: 'payment' | 'prolongation'
}

const SuccessContent = ({ ticket, purchaseType }: Props) => {
  const { t } = useTranslation()

  const { startLiveActivity, updateLiveActivity } = useLiveActivities()

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

  useEffectOnce(() => {
    if (purchaseType === 'payment') {
      startLiveActivity(ticket)
    } else updateLiveActivity(ticket)
  })

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
