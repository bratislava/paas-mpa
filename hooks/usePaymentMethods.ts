import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { localPaymentMethods } from '@/components/controls/payment-methods/constants'
import { PaymentMethod } from '@/components/controls/payment-methods/types'
import { useDefaultPaymentMethod } from '@/hooks/useDefaultPaymentMethod'
import { useTranslation } from '@/hooks/useTranslation'
import { paymentMethodsOptions } from '@/modules/backend/constants/queryOptions'

const comparePaymentMethods = (
  paymentMethod: PaymentMethod,
  comparedPaymentMethod: PaymentMethod,
) =>
  paymentMethod.id === comparedPaymentMethod.id && paymentMethod.type === comparedPaymentMethod.type

export const usePaymentMethods = () => {
  const { t } = useTranslation()

  const paymentMethodsQuery = useQuery(paymentMethodsOptions())

  const [defaultPaymentMethod] = useDefaultPaymentMethod()

  const paymentMethods = useMemo(() => {
    const serverPaymentMethods: PaymentMethod[] =
      paymentMethodsQuery.data?.map((option) => ({
        type: 'card',
        ...option,
      })) || []

    return [...serverPaymentMethods, ...localPaymentMethods]
  }, [paymentMethodsQuery.data])

  const sections = [
    {
      title: t('PaymentMethods.defaultPaymentMethod'),
      data: paymentMethods.some((method) => comparePaymentMethods(method, defaultPaymentMethod))
        ? [defaultPaymentMethod]
        : [],
    },
    {
      title: t('PaymentMethods.otherPaymentMethods'),
      data: paymentMethods.filter((method) => !comparePaymentMethods(method, defaultPaymentMethod)),
    },
  ]

  return {
    sections,
    isLoading: paymentMethodsQuery.isPending,
  }
}
