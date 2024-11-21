import { router } from 'expo-router'

import AddVisitorCardButton from '@/components/controls/payment-methods/AddVisitorCardButton'
import PaymentMethodRow from '@/components/controls/payment-methods/rows/PaymentMethodRow'
import VisitorCardRow from '@/components/controls/payment-methods/rows/VisitorCardRow'
import SkeletonPaymentMethod from '@/components/controls/payment-methods/SkeletonPaymentMethod'
import { PaymentMethod } from '@/components/controls/payment-methods/types'
import Divider from '@/components/shared/Divider'
import Field from '@/components/shared/Field'
import { SectionList } from '@/components/shared/List/SectionList'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useTranslation } from '@/hooks/useTranslation'
import { visitorCardsOptions } from '@/modules/backend/constants/queryOptions'
import { ParkingCardDto } from '@/modules/backend/openapi-generated'
import { usePaymentMethodsStoreContext } from '@/state/PaymentMethodsStoreProvider/usePaymentMethodsStoreContext'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { usePurchaseStoreUpdateContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreUpdateContext'
import { formatBalance } from '@/utils/formatBalance'

type Props = {
  isBpkUsedInProlongation?: boolean
}

const isMethodParkingCard = (method: PaymentMethod | ParkingCardDto): method is ParkingCardDto =>
  'identificator' in method

const PaymentMethodsField = ({ isBpkUsedInProlongation }: Props) => {
  const { t } = useTranslation()

  // TODO potentially get value and setValue functions by props
  const { paymentMethod, npk } = usePurchaseStoreContext()
  const onPurchaseStoreUpdate = usePurchaseStoreUpdateContext()

  const { sections: paymentMethodsSections, isLoading } = usePaymentMethodsStoreContext()

  const { data: visitorCards } = useQueryWithFocusRefetch(visitorCardsOptions())

  const handleMethodPress = (method: PaymentMethod | ParkingCardDto) => {
    onPurchaseStoreUpdate(
      isMethodParkingCard(method)
        ? { npk: method, paymentMethod: null }
        : { paymentMethod: method, npk: null },
    )

    router.back()
  }

  if (isLoading) {
    return (
      <Field label={t('PaymentMethods.fieldPaymentMethods')}>
        <SkeletonPaymentMethod />
      </Field>
    )
  }

  const sections = [
    ...paymentMethodsSections,
    ...(visitorCards?.length && !isBpkUsedInProlongation
      ? [
          {
            title: t('PaymentMethods.fieldVisitorCards'),
            data: visitorCards,
          },
        ]
      : []),
  ]

  return (
    <Field label={t('PaymentMethods.fieldPaymentMethods')}>
      <SectionList<ParkingCardDto | PaymentMethod, string>
        estimatedItemSize={70}
        showGradient={false}
        sections={sections}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={(section) =>
          section.data.length > 0 ? (
            <Typography variant="default-bold">{section.title}</Typography>
          ) : null
        }
        renderItem={({ item }) => (
          <PressableStyled onPress={() => handleMethodPress(item)}>
            {isMethodParkingCard(item) ? (
              <VisitorCardRow
                email={item.name ?? ''}
                balance={
                  item.balanceSeconds
                    ? formatBalance(item.balanceSeconds, item.originalBalanceSeconds)
                    : ''
                }
                selected={item.identificator === npk?.identificator}
              />
            ) : (
              <PaymentMethodRow
                method={item}
                selected={
                  !npk && paymentMethod?.type === item.type && paymentMethod?.id === item.id
                }
              />
            )}
          </PressableStyled>
        )}
        ListFooterComponent={
          visitorCards?.length === 0 && !isBpkUsedInProlongation
            ? () => <AddVisitorCardButton />
            : undefined
        }
        ItemSeparatorComponent={() => <Divider className="h-1 bg-transparent" />}
        SectionSeparatorComponent={() => <Divider className="h-5 bg-transparent" />}
      />
    </Field>
  )
}

export default PaymentMethodsField
