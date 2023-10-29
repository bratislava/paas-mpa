import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import React from 'react'

import VisitorCardMethod from '@/components/controls/payment-methods/VisitorCardMethod'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { ParkingCardDto } from '@/modules/backend/openapi-generated'
import { useGlobalStoreContext } from '@/state/GlobalStoreProvider/useGlobalStoreContext'
import { formatPeriodOfTime } from '@/utils/formatPeriodOfTime'

const VisitorCardsField = () => {
  const t = useTranslation('PaymentMethods')

  // TODO potentially get value and setValue functions by props
  const { npk, setNpk } = useGlobalStoreContext()

  const {
    data: visitorCards,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['VisitorCards'],
    queryFn: () => clientApi.parkingCardsControllerGetActiveVisitorCards(),
    select: (res) => res.data,
  })

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