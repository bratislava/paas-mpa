import React from 'react'

import CardContentItem from '@/components/parking-cards/base/CardContentItem'
import ParkingCardBase from '@/components/parking-cards/base/ParkingCardBase'
import ParkingCardContent from '@/components/parking-cards/base/ParkingCardContent'
import Divider from '@/components/shared/Divider'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

// TODO props
const BonusCard = () => {
  const t = useTranslation('ParkingCards')

  return (
    <ParkingCardBase variant="bonus">
      <ParkingCardContent>
        <Typography variant="small">Licence plate number</Typography>
        <Divider dividerClassname="bg-divider" />
        <CardContentItem description={t('validUntil')} value="April 10, 2023" />
      </ParkingCardContent>
    </ParkingCardBase>
  )
}

export default BonusCard
