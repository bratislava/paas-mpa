import React from 'react'

import CardContentItem from '@/components/parking-cards/base/CardContentItem'
import ParkingCardBase from '@/components/parking-cards/base/ParkingCardBase'
import ParkingCardContent from '@/components/parking-cards/base/ParkingCardContent'
import { CommonParkingCardProps } from '@/components/parking-cards/ParkingCard'
import Divider from '@/components/shared/Divider'
import Typography from '@/components/shared/Typography'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { formatDate } from '@/utils/formatDate'

type VisitorCardProps = Pick<
  CommonParkingCardProps,
  'cardNumber' | 'remainingCredit' | 'validUntil'
>

const VisitorCard = ({ cardNumber, remainingCredit, validUntil }: VisitorCardProps) => {
  const t = useTranslation('ParkingCards')
  const locale = useLocale()

  return (
    <ParkingCardBase variant="visitor">
      <ParkingCardContent>
        <Typography variant="small">{cardNumber}</Typography>
        <Divider dividerClassname="bg-visitorCard" />
        {/* TODO format remaining credit */}
        <CardContentItem description={t('remainingCredit')} value={remainingCredit ?? ''} />
        {validUntil ? (
          <CardContentItem
            description={t('validUntil')}
            value={formatDate(new Date(validUntil), locale)}
          />
        ) : null}
      </ParkingCardContent>
    </ParkingCardBase>
  )
}

export default VisitorCard
