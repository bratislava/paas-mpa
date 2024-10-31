import PaymentMethodContent from '@/components/controls/payment-methods/rows/PaymentMethodContent'
import { PaymentMethod } from '@/components/controls/payment-methods/types'
import { useTranslation } from '@/hooks/useTranslation'

// Ensure that only one of these props is set at a time
export type CommonPaymentTypeProps =
  | {
      onContextMenuPress?: () => void
      selected?: never
      showControlChevron?: never
    }
  | {
      onContextMenuPress?: never
      selected?: boolean
      showControlChevron?: never
    }
  | {
      onContextMenuPress?: never
      selected?: never
      showControlChevron?: boolean
    }

type Props = CommonPaymentTypeProps & {
  method: PaymentMethod
}

const PaymentMethodRow = ({ method, ...props }: Props) => {
  const { t } = useTranslation()

  switch (method.type) {
    case 'apple-pay':
      return (
        <PaymentMethodContent
          variant="apple-pay"
          title={t('PaymentMethods.methods.apple-pay')}
          {...props}
        />
      )
    case 'card':
      return (
        <PaymentMethodContent
          variant={
            method.brandName === 'visa' || method.brandName === 'mastercard'
              ? method.brandName
              : 'payment-card'
          }
          title={method.mask ?? t('PaymentMethods.methods.payment-card')}
          {...props}
        />
      )
    case 'google-pay':
      return (
        <PaymentMethodContent
          variant="google-pay"
          title={t('PaymentMethods.methods.google-pay')}
          {...props}
        />
      )
    default:
      return (
        <PaymentMethodContent
          variant="payment-card"
          title={t('PaymentMethods.methods.payment-card')}
          {...props}
        />
      )
  }
}

export default PaymentMethodRow
