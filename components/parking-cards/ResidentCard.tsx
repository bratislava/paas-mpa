import React from 'react'

import CardContentItem from '@/components/parking-cards/CardContentItem'
import ParkingCardBase from '@/components/parking-cards/ParkingCardBase'
import ParkingCardContent from '@/components/parking-cards/ParkingCardContent'
import Divider from '@/components/shared/Divider'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

// TODO props
const ResidentCard = () => {
  const t = useTranslation('ParkingCards')

  return (
    <ParkingCardBase variant="resident">
      <ParkingCardContent>
        <Typography variant="small">Card number</Typography>
        <Typography variant="small">Licence plate number</Typography>
        <Divider dividerClassname="bg-dark" />
        <CardContentItem description={t('validUntil')} value="April 10, 2023" />
      </ParkingCardContent>
    </ParkingCardBase>
  )
}

export default ResidentCard
