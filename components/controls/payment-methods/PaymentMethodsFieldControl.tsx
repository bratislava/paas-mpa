import React from 'react'

import PaymentOptionRow from '@/components/controls/payment-methods/rows/PaymentOptionRow'
import VisitorCardRow from '@/components/controls/payment-methods/rows/VisitorCardRow'
import { PaymentOption } from '@/components/controls/payment-methods/types'
import { ParkingCardDto } from '@/modules/backend/openapi-generated'
import { formatBalance } from '@/utils/formatBalance'

type Props = {
  visitorCard: ParkingCardDto | null
  paymentOption: PaymentOption | undefined
  showControlChevron?: boolean
}

const PaymentMethodsFieldControl = ({
  visitorCard,
  paymentOption = 'payment-card',
  showControlChevron = true,
}: Props) => {
  return visitorCard ? (
    <VisitorCardRow
      email={visitorCard.name ?? ''}
      balance={
        visitorCard.balanceSeconds
          ? formatBalance(visitorCard.balanceSeconds, visitorCard.originalBalanceSeconds)
          : ''
      }
      showControlChevron={showControlChevron}
    />
  ) : (
    <PaymentOptionRow variant={paymentOption} showControlChevron={showControlChevron} />
  )
}

export default PaymentMethodsFieldControl
