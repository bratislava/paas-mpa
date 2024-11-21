import { router } from 'expo-router'

import { PaymentSearchParams } from '@/app/(app)/(purchase-and-payment)/purchase/payment'
import { TicketPurchaseSearchParams } from '@/app/(app)/(purchase-and-payment)/ticket-purchase'
import { TicketInit24PayDto } from '@/modules/backend/openapi-generated'

/**
 * Function to redirect to payment page
 * @param ticketInit response from backend
 */
export const paymentRedirect = async (ticketInit: TicketInit24PayDto) => {
  if (ticketInit.paymentUrl) {
    router.push({
      pathname: '/purchase/payment',
      params: {
        paymentUrl: encodeURI(ticketInit.paymentUrl),
        params: JSON.stringify(ticketInit.params),
        ticketId: ticketInit.id.toString(),
      } satisfies PaymentSearchParams,
    })
    /** Handle payment without payment gate (NPK, BPK with 0€ ticket) */
  } else {
    router.push({
      pathname: '/ticket-purchase',
      params: { ticketId: ticketInit.id.toString() } satisfies TicketPurchaseSearchParams,
    })
  }
}
