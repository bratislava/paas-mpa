import ErrorContent from '@/components/purchase/PaymentStatus/ErrorContent'
import PendingContent from '@/components/purchase/PaymentStatus/PendingContent'
import SuccessContent from '@/components/purchase/PaymentStatus/SuccessContent'
import { PaymentStatus, TicketDto } from '@/modules/backend/openapi-generated'
import { isDefined } from '@/utils/isDefined'

type Props = {
  ticket: TicketDto
}

const PaymentStatusContent = ({ ticket }: Props) => {
  const isProlongation = isDefined(ticket.lastProlongationTicketId)
  const purchaseType = isProlongation ? 'prolongation' : 'payment'

  switch (ticket.paymentStatus) {
    case PaymentStatus.Pending:
      return <PendingContent />

    case PaymentStatus.Success:
      return <SuccessContent ticket={ticket} purchaseType={purchaseType} />

    // Other statuses (Fail, Error) and unexpected states are handled by ErrorComponent
    default:
      return <ErrorContent purchaseType={purchaseType} />
  }
}

export default PaymentStatusContent
