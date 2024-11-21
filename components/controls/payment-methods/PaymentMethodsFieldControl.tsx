import React from 'react'

import PaymentMethodRow from '@/components/controls/payment-methods/rows/PaymentMethodRow'
import VisitorCardRow from '@/components/controls/payment-methods/rows/VisitorCardRow'
import { PaymentMethod } from '@/components/controls/payment-methods/types'
import { useDefaultPaymentMethod } from '@/hooks/useDefaultPaymentMethod'
import { ParkingCardDto } from '@/modules/backend/openapi-generated'
import { formatBalance } from '@/utils/formatBalance'

type Props = {
  visitorCard: ParkingCardDto | null
  paymentMethod: PaymentMethod | null
  showControlChevron?: boolean
}

const PaymentMethodsFieldControl = ({
  visitorCard,
  paymentMethod,
  showControlChevron = true,
}: Props) => {
  const [defaultPaymentMethod] = useDefaultPaymentMethod()

  return visitorCard ? (
    <VisitorCardRow
      email={visitorCard.name ?? ''}
      // TODO originalBalanceSeconds temporarily removed to be confirmed
      balance={visitorCard.balanceSeconds ? formatBalance(visitorCard.balanceSeconds) : ''}
      showControlChevron={showControlChevron}
    />
  ) : (
    <PaymentMethodRow
      method={paymentMethod ?? defaultPaymentMethod}
      showControlChevron={showControlChevron}
    />
  )
}

export default PaymentMethodsFieldControl
