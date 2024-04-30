import { router } from 'expo-router'

import { PaymentSearchParams } from '@/app/(app)/(purchase-and-payment)/purchase/payment'
import { TicketPurchaseSearchParams } from '@/app/(app)/(purchase-and-payment)/ticket-purchase'
import { PaymentOption } from '@/components/controls/payment-methods/types'
import { TicketInitDto } from '@/modules/backend/openapi-generated'

/**
 * Function to redirect to payment page
 * @param ticketInit response from backend
 * @param paymentOption type of payment method
 */
export const paymentRedirect = (ticketInit: TicketInitDto, paymentOption: PaymentOption | null) => {
  if (ticketInit.paymentUrls) {
    const paymentUrl =
      paymentOption === 'apple-pay'
        ? ticketInit.paymentUrls.paymentUrlAPAY
        : paymentOption === 'google-pay'
          ? ticketInit.paymentUrls.paymentUrlGPAY
          : ticketInit.paymentUrls.paymentUrlCard

    router.push({
      pathname: '/purchase/payment',
      params: {
        paymentUrl,
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
