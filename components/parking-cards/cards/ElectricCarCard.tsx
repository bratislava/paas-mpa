import React from 'react'

import ParkingCardBase from '@/components/parking-cards/base/ParkingCardBase'
import ParkingCardContent from '@/components/parking-cards/base/ParkingCardContent'
import { ParkingCardValidityItems } from '@/components/parking-cards/base/ParkingCardValidityItems'
import { CommonParkingCardProps } from '@/components/parking-cards/ParkingCard'
import Divider from '@/components/shared/Divider'
import Typography from '@/components/shared/Typography'

type ElectricCarCardProps = Pick<
  CommonParkingCardProps,
  'zoneName' | 'licencePlate' | 'validUntil' | 'validFrom'
>

const ElectricCarCard = ({
  zoneName,
  licencePlate,
  validUntil,
  validFrom,
}: ElectricCarCardProps) => (
  <ParkingCardBase variant="electric-car">
    <ParkingCardContent>
      <Typography variant="small">{zoneName}</Typography>

      <Typography variant="small">{licencePlate}</Typography>

      <Divider className="bg-electricCarCard" />

      <ParkingCardValidityItems validFrom={validFrom} validUntil={validUntil} />
    </ParkingCardContent>
  </ParkingCardBase>
)

export default ElectricCarCard
