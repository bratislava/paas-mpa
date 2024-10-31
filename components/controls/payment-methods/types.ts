import { StoredPaymentMethodDto } from '@/modules/backend/openapi-generated'

type PaymentMethodType = 'payment-card' | 'apple-pay' | 'google-pay' | 'card'

export type PaymentMethod =
  | {
      type: Exclude<PaymentMethodType, 'card'>
      id?: number
    }
  | (StoredPaymentMethodDto & {
      type: 'card'
      id?: number
    })
