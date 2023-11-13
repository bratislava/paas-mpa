import { useMMKVString } from 'react-native-mmkv'

import { allPaymentOptions, PaymentOption } from '@/components/controls/payment-methods/types'

/**
 * Define a custom type guard to assert whether an unknown object is a PaymentOption.
 */
function isPaymentOption(paymentOption: unknown): paymentOption is PaymentOption {
  return typeof paymentOption === 'string' && allPaymentOptions.includes(paymentOption)
}

export const useDefaultPaymentOption = () => {
  const [defaultOption, setDefaultOption] = useMMKVString('default-payment-method')

  if (!isPaymentOption(defaultOption)) {
    setDefaultOption(allPaymentOptions[0])
  }

  return [defaultOption as PaymentOption, setDefaultOption] as const
}
