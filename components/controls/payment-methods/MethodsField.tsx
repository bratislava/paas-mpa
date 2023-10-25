import { router } from 'expo-router'
import React from 'react'

import PaymentGateMethod from '@/components/controls/payment-methods/PaymentGateMethod'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import { useTranslation } from '@/hooks/useTranslation'
import { useGlobalStoreContext } from '@/state/hooks/useGlobalStoreContext'

const MethodsField = () => {
  const t = useTranslation('PaymentMethods')
  const { ticketPriceRequest, setTicketPriceRequest } = useGlobalStoreContext()

  const handleCardPress = () => {
    setTicketPriceRequest((prev) => ({ ...prev, npkId: '' }))
    router.push('/purchase')
  }

  return (
    <Field label={t('fieldPaymentMethods')}>
      <PressableStyled onPress={handleCardPress}>
        <PaymentGateMethod selected={!ticketPriceRequest?.npkId} />
      </PressableStyled>
    </Field>
  )
}

export default MethodsField
