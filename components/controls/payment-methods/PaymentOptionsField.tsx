import { router } from 'expo-router'
import { Platform } from 'react-native'

import PaymentOptionRow from '@/components/controls/payment-methods/rows/PaymentOptionRow'
import { PaymentOption } from '@/components/controls/payment-methods/types'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import { useDefaultPaymentOption } from '@/hooks/useDefaultPaymentOption'
import { useTranslation } from '@/hooks/useTranslation'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { usePurchaseStoreUpdateContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreUpdateContext'

const PaymentOptionsField = () => {
  const { t } = useTranslation()

  // TODO potentially get value and setValue functions by props
  const { paymentOption, npk } = usePurchaseStoreContext()
  const onPurchaseStoreUpdate = usePurchaseStoreUpdateContext()

  const [defaultPaymentOption] = useDefaultPaymentOption()

  const handlePanelPress = (variant: PaymentOption) => {
    onPurchaseStoreUpdate({ paymentOption: variant, npk: null })
    router.back()
  }

  const panels: PaymentOption[] = [
    'payment-card',
    ...(Platform.OS === 'ios' ? (['apple-pay'] as const) : []),
    ...(Platform.OS === 'android' ? (['google-pay'] as const) : []),
    // 'e-wallet'
  ]

  return (
    <Field label={t('PaymentMethods.fieldPaymentMethods')}>
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
