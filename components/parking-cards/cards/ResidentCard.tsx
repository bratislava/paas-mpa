import React from 'react'

import ParkingCardBase from '@/components/parking-cards/base/ParkingCardBase'
import ParkingCardContent from '@/components/parking-cards/base/ParkingCardContent'
import { ParkingCardValidityItems } from '@/components/parking-cards/base/ParkingCardValidityItems'
import { CommonParkingCardProps } from '@/components/parking-cards/ParkingCard'
import Divider from '@/components/shared/Divider'
import Typography from '@/components/shared/Typography'

type ResidentCardProps = Pick<
  CommonParkingCardProps,
  'zoneName' | 'licencePlate' | 'validUntil' | 'validFrom'
>

const ResidentCard = ({ zoneName, licencePlate, validUntil, validFrom }: ResidentCardProps) => (
  <ParkingCardBase variant="resident">
    <ParkingCardContent>
      <Typography variant="small">{zoneName}</Typography>

      <Typography variant="small">{licencePlate}</Typography>

      <Divider className="bg-dark" />

      <ParkingCardValidityItems validFrom={validFrom} validUntil={validUntil} />
    </ParkingCardContent>
  </ParkingCardBase>
)

export default ResidentCard
