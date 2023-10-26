import React from 'react'

import PaymentGateMethod from '@/components/controls/payment-methods/PaymentGateMethod'
import VisitorCardMethod from '@/components/controls/payment-methods/VisitorCardMethod'
import { useGlobalStoreContext } from '@/state/GlobalStoreProvider/useGlobalStoreContext'

const PaymentMethodsFieldControl = () => {
  const { ticketPriceRequest } = useGlobalStoreContext()

  return ticketPriceRequest?.npkId ? (
    <VisitorCardMethod email={ticketPriceRequest.npkId} balance="TODO" showControlChevron />
  ) : (
    <PaymentGateMethod showControlChevron />
  )
}

export default PaymentMethodsFieldControl
