import React from 'react'

import ParkingCardBase from '@/components/parking-cards/base/ParkingCardBase'
import ParkingCardContent from '@/components/parking-cards/base/ParkingCardContent'
import { ParkingCardValidityItems } from '@/components/parking-cards/base/ParkingCardValidityItems'
import { CommonParkingCardProps } from '@/components/parking-cards/ParkingCard'
import Divider from '@/components/shared/Divider'
import Typography from '@/components/shared/Typography'

type SubscriberCardProps = Pick<
  CommonParkingCardProps,
  'zoneName' | 'licencePlate' | 'validUntil' | 'validFrom'
>

const SubscriberCard = ({ zoneName, licencePlate, validUntil, validFrom }: SubscriberCardProps) => (
  <ParkingCardBase variant="subscriber">
    <ParkingCardContent>
      <Typography variant="small">{zoneName}</Typography>

      <Typography variant="small">{licencePlate}</Typography>

      <Divider className="bg-subscriberCard" />

      <ParkingCardValidityItems validFrom={validFrom} validUntil={validUntil} />
    </ParkingCardContent>
  </ParkingCardBase>
)

export default SubscriberCard
