import { router, useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'

import ProlongTicketForm from '@/components/prolongate/ProlongateTicketForm'
import { useDefaultPaymentOption } from '@/hooks/useDefaultPaymentOption'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { getTicketOptions, visitorCardsOptions } from '@/modules/backend/constants/queryOptions'
import PurchaseStoreProvider from '@/state/PurchaseStoreProvider/PurchaseStoreProvider'

type ProlongateLocalSearchParams = {
  ticketId: string
}

const ProlongScreen = () => {
  const { ticketId } = useLocalSearchParams<ProlongateLocalSearchParams>()
  const ticketIdParsed = ticketId ? parseInt(ticketId, 10) : undefined
  const [defaultPaymentOption] = useDefaultPaymentOption()

  const { data: ticket } = useQueryWithFocusRefetch(getTicketOptions(ticketIdParsed))
  const { data: visitorCards } = useQueryWithFocusRefetch(visitorCardsOptions())

  const initialValues = useMemo(
    () => ({
      duration: 60 * 60,
      vehicle: ticket?.ecv ? { vehiclePlateNumber: ticket?.ecv ?? '', isOneTimeUse: true } : null,
      npk: visitorCards?.find(({ identificator }) => ticket?.npkId === identificator) ?? null,
      paymentOption: defaultPaymentOption,
      udr: null,
    }),
    [defaultPaymentOption, ticket?.ecv, ticket?.npkId, visitorCards],
  )

  if (!ticketIdParsed) {
    router.replace({
      pathname: '/purchase',
    })

    return null
  }

  return ticket ? (
    <PurchaseStoreProvider initialValues={initialValues}>
      <ProlongTicketForm ticket={ticket} />
    </PurchaseStoreProvider>
  ) : null
}

export default ProlongScreen
