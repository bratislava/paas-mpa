import { StoredPaymentMethodDto } from '@/modules/backend/openapi-generated'

type PaymentMethodType = 'payment-card' | 'apple-pay' | 'google-pay' | 'card'

// ID should come from API... so this won't work until API is fixed
export type PaymentMethod =
  | {
      type: Exclude<PaymentMethodType, 'card'>
      id?: number
    }
  | (StoredPaymentMethodDto & {
      type: 'card'
      id?: number
    })
