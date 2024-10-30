import { StoredPaymentMethodDto } from '@/modules/backend/openapi-generated'

type PaymentMethodType = 'payment-card' | 'apple-pay' | 'google-pay' | 'card'

export type PaymentMethod =
  | {
      type: Exclude<PaymentMethodType, 'card'>
      id?: string
    }
  | (StoredPaymentMethodDto & {
      type: 'card'
      id?: string
    })
