import React from 'react'

import PaymentGateMethod from '@/components/controls/payment-methods/PaymentGateMethod'
import VisitorCardMethod from '@/components/controls/payment-methods/VisitorCardMethod'
import { ParkingCardDto } from '@/modules/backend/openapi-generated'
import { formatBalance } from '@/utils/formatBalance'

type Props = {
  card: ParkingCardDto | null
}

const PaymentMethodsFieldControl = ({ card }: Props) => {
  return card ? (
    <VisitorCardMethod
      email={card.name ?? ''}
      balance={
        card.balanceSeconds ? formatBalance(card.balanceSeconds, card.originalBalanceSeconds) : ''
      }
      showControlChevron
    />
  ) : (
    <PaymentGateMethod showControlChevron />
  )
}

export default PaymentMethodsFieldControl
