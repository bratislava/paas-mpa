import React from 'react'

import ParkingCardBase from '@/components/parking-cards/base/ParkingCardBase'
import ParkingCardContent from '@/components/parking-cards/base/ParkingCardContent'
import { ParkingCardValidityItems } from '@/components/parking-cards/base/ParkingCardValidityItems'
import { CommonParkingCardProps } from '@/components/parking-cards/ParkingCard'
import Divider from '@/components/shared/Divider'
import Typography from '@/components/shared/Typography'

// TODO - this is not in Figma, it's just a fallback for ParkingCardType === 'OTHER'

type OtherCardProps = Pick<
  CommonParkingCardProps,
  'zoneName' | 'licencePlate' | 'validUntil' | 'validFrom'
>

const OtherCard = ({ zoneName, licencePlate, validUntil, validFrom }: OtherCardProps) => (
  <ParkingCardBase variant="other">
    <ParkingCardContent>
      <Typography variant="small">{zoneName}</Typography>

      <Typography variant="small">{licencePlate}</Typography>

      <Divider className="bg-divider" />

      <ParkingCardValidityItems validFrom={validFrom} validUntil={validUntil} />
    </ParkingCardContent>
  </ParkingCardBase>
)

export default OtherCard
