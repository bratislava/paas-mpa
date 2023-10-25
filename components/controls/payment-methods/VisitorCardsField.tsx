import { useQuery } from '@tanstack/react-query'
import { router } from 'expo-router'
import React from 'react'

import VisitorCardMethod from '@/components/controls/payment-methods/VisitorCardMethod'
import Field from '@/components/shared/Field'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { clientApi } from '@/modules/backend/client-api'
import { useGlobalStoreContext } from '@/state/hooks/useGlobalStoreContext'
import { formatPeriodOfTime } from '@/utils/formatPeriodOfTime'

const VisitorCardsField = () => {
  const t = useTranslation('PaymentMethods')
  const { ticketPriceRequest, setTicketPriceRequest } = useGlobalStoreContext()

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

  const handleCardPress = (npkId: string) => {
    console.log('handleCardPress', npkId)
    setTicketPriceRequest((prev) => ({ ...prev, npkId }))
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
        <PressableStyled
          key={card.identificator}
          onPress={() => handleCardPress(card.identificator)}
        >
          <VisitorCardMethod
            email={card.name ?? ''}
            balance={formatPeriodOfTime(card.balance ?? '')}
            selected={card.identificator === ticketPriceRequest?.npkId}
          />
        </PressableStyled>
      ))}
    </Field>
  )
}

export default VisitorCardsField
