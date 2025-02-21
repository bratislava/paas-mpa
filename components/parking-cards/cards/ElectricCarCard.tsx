import React from 'react'

import CardContentItem from '@/components/parking-cards/base/CardContentItem'
import ParkingCardBase from '@/components/parking-cards/base/ParkingCardBase'
import ParkingCardContent from '@/components/parking-cards/base/ParkingCardContent'
import { CommonParkingCardProps } from '@/components/parking-cards/ParkingCard'
import Divider from '@/components/shared/Divider'
import Typography from '@/components/shared/Typography'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { formatValidUntilDate } from '@/utils/formatValidUntilDate'

type ElectricCarCardProps = Pick<CommonParkingCardProps, 'zoneName' | 'licencePlate' | 'validUntil'>

const ElectricCarCard = ({ zoneName, licencePlate, validUntil }: ElectricCarCardProps) => {
  const { t } = useTranslation()
  const locale = useLocale()

  return (
    <ParkingCardBase variant="electric-car">
      <ParkingCardContent>
        <Typography variant="small">{zoneName}</Typography>
        <Typography variant="small">{licencePlate}</Typography>
        <Divider className="bg-electricCarCard" />
        {validUntil ? (
          <CardContentItem
            description={t('ParkingCards.validUntil')}
            value={formatValidUntilDate(validUntil, locale)}
          />
        ) : null}
      </ParkingCardContent>
    </ParkingCardBase>
  )
}

export default ElectricCarCard
