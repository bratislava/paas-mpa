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

type BonusCardProps = Omit<CommonParkingCardProps, 'cardNumber'>

const BonusCard = ({
  balanceSeconds,
  originalBalanceSeconds,
  zoneName,
  licencePlate,
  validUntil,
  validFrom,
}: BonusCardProps) => {
  const { t } = useTranslation()

  return (
    <ParkingCardBase variant="bonus">
      <ParkingCardContent>
        <Typography variant="small">{zoneName}</Typography>

        <Typography variant="small">{licencePlate}</Typography>

        <Divider className="bg-divider" />

        <CardContentItem
          description={t('ParkingCards.remainingCredit')}
          value={
            typeof balanceSeconds === 'number'
              ? formatBalance(balanceSeconds, originalBalanceSeconds ?? undefined)
              : ''
          }
        />

        <ParkingCardValidityItems validFrom={validFrom} validUntil={validUntil} />
      </ParkingCardContent>
    </ParkingCardBase>
  )
}

export default BonusCard
