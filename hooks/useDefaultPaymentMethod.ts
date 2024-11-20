import { useMMKVObject } from 'react-native-mmkv'

import { paymentMethodTypes } from '@/components/controls/payment-methods/constants'
import { PaymentMethod } from '@/components/controls/payment-methods/types'

/**
 * Define a custom type guard to assert whether an unknown object is a PaymentMethod.
 */
function isPaymentMethod(paymentMethod: unknown): paymentMethod is PaymentMethod {
  return !!(
    paymentMethod &&
    typeof paymentMethod === 'object' &&
    'type' in paymentMethod &&
    typeof paymentMethod.type === 'string' &&
    paymentMethodTypes.has(paymentMethod?.type)
  )
}

export const useDefaultPaymentMethod = (): [PaymentMethod, (value?: PaymentMethod) => void] => {
  const [defaultMethod, setDefaultMethod] = useMMKVObject<PaymentMethod>('default-payment')

  if (!isPaymentMethod(defaultMethod)) {
    const newDefaultMethod: PaymentMethod = { type: 'payment-card' }
    setDefaultMethod(newDefaultMethod)

    return [newDefaultMethod, setDefaultMethod]
  }

  return [defaultMethod, setDefaultMethod]
}
