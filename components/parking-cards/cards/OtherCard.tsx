import React from 'react'

import CardContentItem from '@/components/parking-cards/base/CardContentItem'
import ParkingCardBase from '@/components/parking-cards/base/ParkingCardBase'
import ParkingCardContent from '@/components/parking-cards/base/ParkingCardContent'
import { CommonParkingCardProps } from '@/components/parking-cards/ParkingCard'
import Divider from '@/components/shared/Divider'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

// TODO - this is not in Figma, it's just a fallback for ParkingCardType === 'OTHER'

type OtherCardProps = Pick<CommonParkingCardProps, 'zoneName' | 'licencePlate' | 'validUntil'>

const OtherCard = ({ zoneName, licencePlate, validUntil }: OtherCardProps) => {
  const t = useTranslation('ParkingCards')

  return (
    <ParkingCardBase variant="other">
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

export default OtherCard
