import React from 'react'

import CardContentItem from '@/components/parking-cards/base/CardContentItem'
import ParkingCardBase from '@/components/parking-cards/base/ParkingCardBase'
import ParkingCardContent from '@/components/parking-cards/base/ParkingCardContent'
import { ParkingCardValidityItems } from '@/components/parking-cards/base/ParkingCardValidityItems'
import { CommonParkingCardProps } from '@/components/parking-cards/ParkingCard'
import Divider from '@/components/shared/Divider'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { formatBalance } from '@/utils/formatBalance'

type VisitorCardProps = Pick<
  CommonParkingCardProps,
  'zoneName' | 'balanceSeconds' | 'originalBalanceSeconds' | 'validUntil' | 'validFrom'
>

const VisitorCard = ({
  zoneName,
  balanceSeconds,
  originalBalanceSeconds,
  validUntil,
  validFrom,
}: VisitorCardProps) => {
  const { t } = useTranslation()

  return (
    <ParkingCardBase variant="visitor">
      <ParkingCardContent>
        <Typography variant="small">{zoneName}</Typography>

        <Divider className="bg-visitorCard" />

        <CardContentItem
          description={t('ParkingCards.remainingCredit')}
          value={
            balanceSeconds ? formatBalance(balanceSeconds, originalBalanceSeconds ?? undefined) : ''
          }
        />

        <ParkingCardValidityItems validFrom={validFrom} validUntil={validUntil} />
      </ParkingCardContent>
    </ParkingCardBase>
  )
}

export default VisitorCard
