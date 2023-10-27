import { router } from 'expo-router'
import React from 'react'

import PaymentGateMethod from '@/components/controls/payment-methods/PaymentGateMethod'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation } from '@/hooks/useTranslation'
import { useGlobalStoreContext } from '@/state/GlobalStoreProvider/useGlobalStoreContext'

const MethodsField = () => {
  const t = useTranslation('PaymentMethods')

  // TODO potentially get value and setValue functions by props
  const { npk, setNpk } = useGlobalStoreContext()

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
