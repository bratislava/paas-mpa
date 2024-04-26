import { useEffect } from 'react'

import SelectRow from '@/components/list-rows/SelectRow'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useTranslation } from '@/hooks/useTranslation'
import { storedPaymentMethod } from '@/modules/backend/constants/queryOptions'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { usePurchaseStoreUpdateContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreUpdateContext'

export const RememberCardField = () => {
  const t = useTranslation('PurchaseScreen')

  const paymentMethod = useQueryWithFocusRefetch(storedPaymentMethod())

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

  return paymentOption === 'payment-card' ? (
    <SelectRow
      label={paymentMethod.data ? t('useRememberedCard') : t('saveCard')}
      onValueChange={handleToggleSaveCard}
      value={rememberCard}
    />
  ) : null
}
