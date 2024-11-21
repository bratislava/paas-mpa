import { Platform } from 'react-native'

import { PaymentMethod } from '@/components/controls/payment-methods/types'

export const paymentMethodTypes = new Set(['payment-card', 'apple-pay', 'google-pay', 'card'])

export const localPaymentMethods: PaymentMethod[] = [
  { type: 'payment-card' },
  ...(Platform.OS === 'ios' ? [{ type: 'apple-pay' as const }] : [{ type: 'google-pay' as const }]),
]
