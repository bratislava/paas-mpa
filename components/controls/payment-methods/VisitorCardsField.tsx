import { Link, router } from 'expo-router'
import { View } from 'react-native'

import VisitorCardRow from '@/components/controls/payment-methods/rows/VisitorCardRow'
import Button from '@/components/shared/Button'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useQueryWithFocusRefetch } from '@/hooks/useQueryWithFocusRefetch'
import { useTranslation } from '@/hooks/useTranslation'
import { visitorCardsOptions } from '@/modules/backend/constants/queryOptions'
import { ParkingCardDto } from '@/modules/backend/openapi-generated'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { usePurchaseStoreUpdateContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreUpdateContext'
import { formatBalance } from '@/utils/formatBalance'

const VisitorCardsField = () => {
  const { t } = useTranslation()

  // TODO potentially get value and setValue functions by props
  const { npk } = usePurchaseStoreContext()
  const onPurchaseStoreUpdate = usePurchaseStoreUpdateContext()

  const {
    data: visitorCards,
    isPending,
    isError,
    error,
  } = useQueryWithFocusRefetch(visitorCardsOptions())

  const handleCardPress = (card: ParkingCardDto) => {
    onPurchaseStoreUpdate({ npk: card, paymentOption: null })
    router.back()
  }

  if (isPending) {
    return (
      <Field label="Visitor cards">
        <Typography>Loading...</Typography>
      </Field>
    )
  }

  if (isError) {
    return (
      <Field label="Visitor cards">
        <Typography>Error: {error.message}</Typography>
      </Field>
    )
  }

  return (
    <Field label={t('PaymentMethods.fieldVisitorCards')}>
      {visitorCards.length > 0 ? (
        visitorCards.map((card) => {
          return (
            <PressableStyled key={card.identificator} onPress={() => handleCardPress(card)}>
              <VisitorCardRow
                email={card.name ?? ''}
                balance={
                  card.balanceSeconds
                    ? formatBalance(card.balanceSeconds, card.originalBalanceSeconds)
                    : ''
                }
                selected={card.identificator === npk?.identificator}
              />
            </PressableStyled>
          )
        })
      ) : (
        <View className="flex items-start">
          <Link asChild href="/parking-cards/verification">
            <Button variant="plain-dark" startIcon="add-circle-outline" onPress={router.back}>
              {t('PaymentMethods.addVisitorCard')}
            </Button>
          </Link>
        </View>
      )}
    </Field>
  )
}

export default VisitorCardsField
