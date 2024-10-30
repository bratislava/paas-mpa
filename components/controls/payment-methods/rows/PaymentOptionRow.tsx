import PaymentOptionContent from '@/components/controls/payment-methods/rows/PaymentOptionContent'
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

const PaymentOptionRow = ({ method, ...props }: Props) => {
  const { t } = useTranslation()

  switch (method.type) {
    case 'apple-pay':
      return (
        <PaymentOptionContent
          variant="apple-pay"
          title={t('PaymentMethods.methods.apple-pay')}
          {...props}
        />
      )
    case 'card':
      return (
        <PaymentOptionContent
          variant={
            method.brandName === 'visa' || method.brandName === 'mastercard'
              ? method.brandName
              : 'payment-card'
          }
          title={method.mask ?? t('PaymentMethods.paymentCard')}
          {...props}
        />
      )
    case 'google-pay':
      return (
        <PaymentOptionContent
          variant="google-pay"
          title={t('PaymentMethods.methods.google-pay')}
          {...props}
        />
      )
    default:
      return (
        <PaymentOptionContent
          variant="payment-card"
          title={t('PaymentMethods.methods.payment-card')}
          {...props}
        />
      )
  }
}

export default PaymentOptionRow
