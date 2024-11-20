import { useMutation } from '@tanstack/react-query'
import { createContext, PropsWithChildren, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { localPaymentMethods } from '@/components/controls/payment-methods/constants'
import { PaymentMethod } from '@/components/controls/payment-methods/types'
import { Section } from '@/components/shared/List/SectionList'
import { useDefaultPaymentMethod } from '@/hooks/useDefaultPaymentMethod'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { clientApi } from '@/modules/backend/client-api'
import { paymentMethodsOptions } from '@/modules/backend/constants/queryOptions'

type PaymentMethodsStoreContextProps = {
  sections: Section<PaymentMethod, string>[]
  deletePaymentMethod: (id: PaymentMethod) => void
  refetch: () => void
  isLoading?: boolean
}

const comparePaymentMethods = (
  paymentMethod?: PaymentMethod,
  comparedPaymentMethod?: PaymentMethod,
) =>
  paymentMethod?.id === comparedPaymentMethod?.id &&
  paymentMethod?.type === comparedPaymentMethod?.type

export const PaymentMethodsStoreContext = createContext<PaymentMethodsStoreContextProps | null>(
  null,
)
PaymentMethodsStoreContext.displayName = 'PaymentMethodsStoreContext'

const PaymentMethodsStoreProvider = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation()

  const paymentMethodsQuery = useQueryWithFocusRefetch(paymentMethodsOptions())

  const deleteMutation = useMutation({
    mutationFn: (id: number) => clientApi.ticketsControllerRevokePaymentMethod24Pay(id),
    onSuccess: async (response) => {
      if (response.data) {
        await paymentMethodsQuery.refetch()
      }
    },
  })

  const [defaultPaymentMethod, setDefaultPaymentMethod] = useDefaultPaymentMethod()

  const paymentMethods = useMemo(() => {
    const serverPaymentMethods: PaymentMethod[] =
      paymentMethodsQuery.data?.map((option) => ({
        type: 'card',
        ...option,
      })) || []

    return [...serverPaymentMethods, ...localPaymentMethods]
  }, [paymentMethodsQuery.data])

  useEffect(() => {
    if (!paymentMethods.some((method) => comparePaymentMethods(method, defaultPaymentMethod))) {
      setDefaultPaymentMethod(undefined)
    }
  }, [paymentMethods, defaultPaymentMethod, setDefaultPaymentMethod])

  const sections = useMemo(
    () =>
      [
        {
          title: t('PaymentMethods.defaultPaymentMethod'),
          data:
            defaultPaymentMethod &&
            paymentMethods.some((method) => comparePaymentMethods(method, defaultPaymentMethod))
              ? [defaultPaymentMethod]
              : [],
        },
        {
          title: t('PaymentMethods.otherPaymentMethods'),
          data: paymentMethods.filter(
            (method) => !comparePaymentMethods(method, defaultPaymentMethod),
          ),
        },
      ].filter(({ data }) => data.length > 0),
    [paymentMethods, defaultPaymentMethod, t],
  )

  const deletePaymentMethod = useCallback(
    async (paymentMethodToDelete: PaymentMethod) => {
      if (!paymentMethodToDelete.id) return

      const res = await deleteMutation.mutateAsync(paymentMethodToDelete.id)

      if (res.data && comparePaymentMethods(defaultPaymentMethod, paymentMethodToDelete)) {
        setDefaultPaymentMethod(undefined)
      }
    },
    [defaultPaymentMethod, deleteMutation, setDefaultPaymentMethod],
  )

  const values = useMemo(
    () => ({
      sections,
      deletePaymentMethod,
      isLoading: paymentMethodsQuery.isPending,
      refetch: paymentMethodsQuery.refetch,
    }),
    [sections, deletePaymentMethod, paymentMethodsQuery.isPending, paymentMethodsQuery.refetch],
  )

  return (
    <PaymentMethodsStoreContext.Provider value={values}>
      {children}
    </PaymentMethodsStoreContext.Provider>
  )
}

export default PaymentMethodsStoreProvider
