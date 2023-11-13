import React from 'react'

import PaymentOptionRow from '@/components/controls/payment-methods/rows/PaymentOptionRow'
import VisitorCardRow from '@/components/controls/payment-methods/rows/VisitorCardRow'
import { PaymentOption } from '@/components/controls/payment-methods/types'
import { ParkingCardDto } from '@/modules/backend/openapi-generated'
import { formatBalance } from '@/utils/formatBalance'

type Props = {
  visitorCard: ParkingCardDto | null
  paymentOption: PaymentOption | undefined
}

const PaymentMethodsFieldControl = ({ visitorCard, paymentOption = 'payment-card' }: Props) => {
  return visitorCard ? (
    <VisitorCardRow
      email={visitorCard.name ?? ''}
      balance={
        visitorCard.balanceSeconds
          ? formatBalance(visitorCard.balanceSeconds, visitorCard.originalBalanceSeconds)
          : ''
      }
      showControlChevron
    />
  ) : (
    <PaymentOptionRow variant={paymentOption} showControlChevron />
  )
}

export default PaymentMethodsFieldControl
