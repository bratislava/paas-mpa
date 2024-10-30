import SelectRow from '@/components/list-rows/SelectRow'
import { useDefaultPaymentMethod } from '@/hooks/useDefaultPaymentMethod'
import { useTranslation } from '@/hooks/useTranslation'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { usePurchaseStoreUpdateContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreUpdateContext'

export const RememberCardField = () => {
  const { t } = useTranslation()

  const [defaultPaymentMethod] = useDefaultPaymentMethod()
  const { rememberCard, paymentMethod } = usePurchaseStoreContext()
  const onPurchaseStoreUpdate = usePurchaseStoreUpdateContext()

  const handleToggleSaveCard = () => {
    onPurchaseStoreUpdate({ rememberCard: !rememberCard })
  }

  const usedPaymentMethod = paymentMethod ?? defaultPaymentMethod

  return usedPaymentMethod.type === 'payment-card' ? (
    <SelectRow
      label={t('PurchaseScreen.rememberCard')}
      onValueChange={handleToggleSaveCard}
      value={rememberCard}
    />
  ) : null
}
