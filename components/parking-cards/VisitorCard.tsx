import React from 'react'

import CardContentItem from '@/components/parking-cards/base/CardContentItem'
import ParkingCardBase from '@/components/parking-cards/base/ParkingCardBase'
import ParkingCardContent from '@/components/parking-cards/base/ParkingCardContent'
import Divider from '@/components/shared/Divider'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

// TODO props, prolongation button
const VisitorCard = () => {
  const t = useTranslation('ParkingCards')

  return (
    <ParkingCardBase variant="visitor">
      <ParkingCardContent>
        <Typography variant="small">Card number</Typography>
        <Divider dividerClassname="bg-visitorCard" />
        <CardContentItem description={t('remainingCredit')} value="70.5 / 150 h" />
        <CardContentItem description={t('validUntil')} value="April 10, 2023" />
      </ParkingCardContent>
    </ParkingCardBase>
  )
}

export default VisitorCard
