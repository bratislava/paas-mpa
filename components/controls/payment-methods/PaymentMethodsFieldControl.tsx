import React from 'react'

import PaymentGateMethod from '@/components/controls/payment-methods/PaymentGateMethod'
import VisitorCardMethod from '@/components/controls/payment-methods/VisitorCardMethod'
import { ParkingCardDto } from '@/modules/backend/openapi-generated'
import { formatPeriodOfTime } from '@/utils/formatPeriodOfTime'

type Props = {
  card: ParkingCardDto | null
}

const PaymentMethodsFieldControl = ({ card }: Props) => {
  return card ? (
    <VisitorCardMethod
      email={card.name ?? ''}
      balance={formatPeriodOfTime(card.balance)}
      showControlChevron
    />
  ) : (
    <PaymentGateMethod showControlChevron />
  )
}

export default PaymentMethodsFieldControl
