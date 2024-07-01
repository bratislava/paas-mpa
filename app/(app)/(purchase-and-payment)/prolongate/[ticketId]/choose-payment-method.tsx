import React from 'react'

import ChoosePaymentMethodContent from '@/components/tickets/ChoosePaymentMethodContent'
import { useTicketContext } from '@/state/TicketProvider/useTicketContext'

const Page = () => {
  const ticket = useTicketContext()

  return <ChoosePaymentMethodContent isBpkUsedInProlongation={!!ticket?.bpkId} />
}

export default Page
