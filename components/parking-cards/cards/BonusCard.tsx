import React from 'react'

import CardContentItem from '@/components/parking-cards/base/CardContentItem'
import ParkingCardBase from '@/components/parking-cards/base/ParkingCardBase'
import ParkingCardContent from '@/components/parking-cards/base/ParkingCardContent'
import { CommonParkingCardProps } from '@/components/parking-cards/ParkingCard'
import Divider from '@/components/shared/Divider'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

type BonusCardProps = Pick<CommonParkingCardProps, 'zoneName' | 'licencePlate' | 'validUntil'>

const BonusCard = ({ zoneName, licencePlate, validUntil }: BonusCardProps) => {
  const t = useTranslation('ParkingCards')

  return (
    <ParkingCardBase variant="bonus">
      <ParkingCardContent>
        <Typography variant="small">{zoneName}</Typography>
        <Typography variant="small">{licencePlate}</Typography>
        <Divider dividerClassname="bg-divider" />
        {/* TODO format date */}
        <CardContentItem description={t('validUntil')} value={validUntil ?? ''} />
      </ParkingCardContent>
    </ParkingCardBase>
  )
}

export default BonusCard
