import { useContext } from 'react'

import { PaymentMethodsStoreContext } from '@/state/PaymentMethodsStoreProvider/PaymentMethodsStoreProvider'

export const usePaymentMethodsStoreContext = () => {
  const context = useContext(PaymentMethodsStoreContext)

  if (!context) {
    throw new Error(
      'usePaymentMethodsStoreContext must be used within a PaymentMethodsStoreProvider',
    )
  }

  return context
}
