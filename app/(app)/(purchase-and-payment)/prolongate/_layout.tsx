import { router, Stack, useLocalSearchParams } from 'expo-router'
import { useMemo } from 'react'

import { useDefaultPaymentMethod } from '@/hooks/useDefaultPaymentMethod'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { getTicketOptions, visitorCardsOptions } from '@/modules/backend/constants/queryOptions'
import PurchaseStoreProvider from '@/state/PurchaseStoreProvider/PurchaseStoreProvider'
import TicketProvider from '@/state/TicketProvider/TicketProvider'
import colors from '@/tailwind.config.colors'

type ProlongateLocalSearchParams = {
  ticketId: string
}

const ProlongateLayout = () => {
  const { ticketId } = useLocalSearchParams<ProlongateLocalSearchParams>()

  const ticketIdParsed = ticketId ? parseInt(ticketId, 10) : undefined
  const [defaultPaymentMethod] = useDefaultPaymentMethod()

  const ticketQuery = useQueryWithFocusRefetch(getTicketOptions(ticketIdParsed))
  const visitorCardsQuery = useQueryWithFocusRefetch(visitorCardsOptions())

  const ticket = ticketQuery.data
  const visitorCards = visitorCardsQuery.data

  const initialValues = useMemo(
    () => ({
      duration: 60 * 60,
      vehicle: ticket?.ecv ? { vehiclePlateNumber: ticket?.ecv ?? '', isOneTimeUse: true } : null,
      npk: visitorCards?.find(({ identificator }) => ticket?.npkId === identificator) ?? null,
      paymentMethod: defaultPaymentMethod,
      udr: null,
      rememberCard: false,
    }),
    [defaultPaymentMethod, ticket?.ecv, ticket?.npkId, visitorCards],
  )

  if (!ticketIdParsed) {
    router.replace({
      pathname: '/purchase',
    })

    return null
  }

  return (
    <PurchaseStoreProvider initialValues={initialValues}>
      <TicketProvider ticket={ticket}>
        <Stack
          screenOptions={{
            headerTitleStyle: {
              fontFamily: 'BelfastGrotesk_700Bold',
            },
            headerTintColor: colors.dark.DEFAULT,
          }}
        >
          <Stack.Screen
            name="[ticketId]/choose-payment-method"
            options={{ presentation: 'modal' }}
          />
        </Stack>
      </TicketProvider>
    </PurchaseStoreProvider>
  )
}

export default ProlongateLayout
