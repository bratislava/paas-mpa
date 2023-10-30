import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'

import VisitorCardMethod from '@/components/controls/payment-methods/VisitorCardMethod'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { visitorCardsOptions } from '@/modules/backend/constants/queryOptions'
import { ParkingCardDto } from '@/modules/backend/openapi-generated'
import { usePurchaseStoreContext } from '@/state/PurchaseStoreProvider/usePurchaseStoreContext'
import { formatPeriodOfTime } from '@/utils/formatPeriodOfTime'

const VisitorCardsField = () => {
  const t = useTranslation('PaymentMethods')

  // TODO potentially get value and setValue functions by props
  const { npk, setNpk } = usePurchaseStoreContext()

  const { data: visitorCards, isPending, isError, error } = useQuery(visitorCardsOptions())

  const handleCardPress = (card: ParkingCardDto) => {
    console.log('handleCardPress', card.identificator)
    setNpk(card)
    router.push('/purchase')
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
    <Field label={t('fieldVisitorCards')}>
      {visitorCards.map((card) => (
        <PressableStyled key={card.identificator} onPress={() => handleCardPress(card)}>
          <VisitorCardMethod
            email={card.name ?? ''}
            balance={`${formatPeriodOfTime(card.balance)} / ${formatPeriodOfTime(
              card.originalBalance,
            )}`}
            selected={card.identificator === npk?.identificator}
          />
        </PressableStyled>
      ))}
    </Field>
  )
}

export default VisitorCardsField
