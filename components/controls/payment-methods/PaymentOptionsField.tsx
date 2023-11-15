import { router } from 'expo-router'
import { Platform } from 'react-native'

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
  const { setNpk, paymentOption, setPaymentOption, npk } = usePurchaseStoreContext()
  const [defaultPaymentOption] = useDefaultPaymentOption()

  const handlePanelPress = (variant: PaymentOption) => {
    setNpk(null)
    setPaymentOption(variant)
    router.push('/purchase')
  }

  const panels: PaymentOption[] = [
    'payment-card',
    ...(Platform.OS === 'ios' ? (['apple-pay'] as const) : []),
    'google-pay',
    // 'e-wallet'
  ]

  return (
    <Field label={t('fieldPaymentMethods')}>
      {panels.map((panel) => {
        return (
          <PressableStyled key={panel} onPress={() => handlePanelPress(panel)}>
            <PaymentOptionRow
              variant={panel}
              selected={!npk && (paymentOption ?? defaultPaymentOption) === panel}
            />
          </PressableStyled>
        )
      })}
    </Field>
  )
}

export default PaymentOptionsField
