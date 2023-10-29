import { router } from 'expo-router'

import PaymentGateMethod from '@/components/controls/payment-methods/PaymentGateMethod'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation } from '@/hooks/useTranslation'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'

const MethodsField = () => {
  const t = useTranslation('PaymentMethods')

  // TODO potentially get value and setValue functions by props
  const { npk, setNpk } = usePurchaseStoreContext()

  const handleCardPress = () => {
    setNpk(null)
    router.push('/purchase')
  }

  return (
    <Field label={t('fieldPaymentMethods')}>
      <PressableStyled onPress={handleCardPress}>
        <PaymentGateMethod selected={!npk} />
      </PressableStyled>
    </Field>
  )
}

export default MethodsField
