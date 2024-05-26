import { useEffect } from 'react'

import SelectRow from '@/components/list-rows/SelectRow'
import { useDefaultPaymentOption } from '@/hooks/useDefaultPaymentOption'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useTranslation } from '@/hooks/useTranslation'
import { storedPaymentMethodOptions } from '@/modules/backend/constants/queryOptions'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { usePurchaseStoreUpdateContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreUpdateContext'

export const RememberCardField = () => {
  const { t } = useTranslation()

  const paymentMethod = useQueryWithFocusRefetch(storedPaymentMethodOptions())

  const [defaultPaymentOption] = useDefaultPaymentOption()
  const { rememberCard, paymentOption } = usePurchaseStoreContext()
  const onPurchaseStoreUpdate = usePurchaseStoreUpdateContext()

  const handleToggleSaveCard = () => {
    onPurchaseStoreUpdate({ rememberCard: !rememberCard })
  }

  useEffect(() => {
    if (paymentMethod.data) {
      onPurchaseStoreUpdate({ rememberCard: true })
    }
  }, [onPurchaseStoreUpdate, paymentMethod.data])

  const usedPaymentOption = paymentOption || defaultPaymentOption

  return usedPaymentOption === 'payment-card' ? (
    <SelectRow
      label={paymentMethod.data ? t('PurchaseScreen.useRememberedCard') : t('PurchaseScreen.rememberCard')}
      onValueChange={handleToggleSaveCard}
      value={rememberCard}
    />
  ) : null
}
