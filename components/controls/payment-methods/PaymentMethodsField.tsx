import { router } from 'expo-router'

import PaymentMethodRow from '@/components/controls/payment-methods/rows/PaymentMethodRow'
import SkeletonPaymentMethod from '@/components/controls/payment-methods/SkeletonPaymentMethod'
import { PaymentMethod } from '@/components/controls/payment-methods/types'
import Divider from '@/components/shared/Divider'
import Field from '@/components/shared/Field'
import { SectionList } from '@/components/shared/List/SectionList'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { usePaymentMethods } from '@/hooks/usePaymentMethods'
import { useTranslation } from '@/hooks/useTranslation'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { usePurchaseStoreUpdateContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreUpdateContext'

const PaymentMethodsField = () => {
  const { t } = useTranslation()

  // TODO potentially get value and setValue functions by props
  const { paymentMethod, npk } = usePurchaseStoreContext()
  const onPurchaseStoreUpdate = usePurchaseStoreUpdateContext()

  const { sections, isLoading } = usePaymentMethods()

  const handleMethodPress = (method: PaymentMethod) => {
    onPurchaseStoreUpdate({
      paymentMethod: method,
      npk: null,
    })
    router.back()
  }

  if (!isLoading) {
    return (
      <Field label={t('PaymentMethods.fieldPaymentMethods')}>
        <SkeletonPaymentMethod />
      </Field>
    )
  }

  return (
    <Field label={t('PaymentMethods.fieldPaymentMethods')}>
      <SectionList
        estimatedItemSize={70}
        sections={sections}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={(section) =>
          section.data.length > 0 ? (
            <Typography variant="default-bold">{section.title}</Typography>
          ) : null
        }
        renderItem={({ item }) => (
          <PressableStyled onPress={() => handleMethodPress(item)}>
            <PaymentMethodRow
              method={item}
              selected={!npk && paymentMethod?.type === item.type && paymentMethod?.id === item.id}
            />
          </PressableStyled>
        )}
        ItemSeparatorComponent={() => <Divider className="h-1 bg-transparent" />}
        SectionSeparatorComponent={() => <Divider className="h-5 bg-transparent" />}
      />
    </Field>
  )
}

export default PaymentMethodsField
