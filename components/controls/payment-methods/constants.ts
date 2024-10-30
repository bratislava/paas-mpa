import { Platform } from 'react-native'

import { PaymentMethod } from '@/components/controls/payment-methods/types'

export const paymentMethodTypes = new Set(['payment-card', 'apple-pay', 'google-pay', 'card'])

export const localPaymentMethods: PaymentMethod[] = [
  { type: 'payment-card' },
  ...(Platform.OS === 'ios' ? [{ type: 'apple-pay' as const }] : [{ type: 'google-pay' as const }]),
  {
    type: 'card',
    id: 'local-card-1',
    mask: '1231 2222 **** 3234',
    status: 'active',
    brandName: 'visa',
  },
  {
    type: 'card',
    id: 'local-card-2',
    mask: '1231 2222 **** 1234',
    status: 'active',
    brandName: 'mastercard',
  },
  {
    type: 'card',
    id: 'local-card-3',
    mask: '1231 2222 **** 1234',
    status: 'active',
    brandName: 'ane',
  },
  { type: 'google-pay' },
  { type: 'apple-pay' },
]
