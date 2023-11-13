import { router } from 'expo-router'

import PaymentOptionRow from '@/components/controls/payment-methods/rows/PaymentOptionRow'
import { PaymentOption } from '@/components/controls/payment-methods/types'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import { useDefaultPaymentOption } from '@/hooks/useDefaultPaymentOption'
import { useTranslation } from '@/hooks/useTranslation'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'

const PaymentOptionsField = () => {
  const t = useTranslation('PaymentMethods')

  // TODO potentially get value and setValue functions by props
  const { setNpk, paymentOption, setPaymentOption } = usePurchaseStoreContext()
  const [defaultPaymentOption] = useDefaultPaymentOption()

  const handlePanelPress = (variant: PaymentOption) => {
    setNpk(null)
    setPaymentOption(variant)
    router.push('/purchase')
  }

  const panels = ['payment-card', 'apple-pay', 'google-pay'] as const

  return (
    <Field label={t('fieldPaymentMethods')}>
      {panels.map((panel) => {
        return (
          <PressableStyled key={panel} onPress={() => handlePanelPress(panel)}>
            <PaymentOptionRow
              variant={panel}
              selected={(paymentOption ?? defaultPaymentOption) === panel}
            />
          </PressableStyled>
        )
      })}
    </Field>
  )
}

export default PaymentOptionsField
