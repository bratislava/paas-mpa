import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { localPaymentMethods } from '@/components/controls/payment-methods/constants'
import { PaymentMethod } from '@/components/controls/payment-methods/types'
import { useDefaultPaymentMethod } from '@/hooks/useDefaultPaymentMethod'
import { useTranslation } from '@/hooks/useTranslation'
import { paymentMethodsOptions } from '@/modules/backend/constants/queryOptions'

export const usePaymentMethods = () => {
  const { t } = useTranslation()

  const paymentMethodsQuery = useQuery(paymentMethodsOptions())

  const [defaultPaymentMethod] = useDefaultPaymentMethod()

  const paymentOptions = useMemo(() => {
    const mappedPaymentOptions: PaymentMethod[] =
      paymentMethodsQuery.data?.map((option) => ({
        type: 'card',
        ...option,
      })) || []

    return [...mappedPaymentOptions, ...localPaymentMethods]
  }, [paymentMethodsQuery.data])

  const sections = [
    {
      title: t('PaymentMethods.defaultPaymentOption'),
      data: [defaultPaymentMethod],
    },
    {
      title: t('PaymentMethods.otherPaymentOptions'),
      data: paymentOptions.filter(
        (option) =>
          !(option.id === defaultPaymentMethod.id && option.type === defaultPaymentMethod.type),
      ),
    },
  ]

  return {
    sections,
    isLoading: paymentMethodsQuery.isPending,
  }
}
