import React from 'react'

import CardContentItem from '@/components/parking-cards/base/CardContentItem'
import ParkingCardBase from '@/components/parking-cards/base/ParkingCardBase'
import ParkingCardContent from '@/components/parking-cards/base/ParkingCardContent'
import { CommonParkingCardProps } from '@/components/parking-cards/ParkingCard'
import Divider from '@/components/shared/Divider'
import Typography from '@/components/shared/Typography'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { formatBalance } from '@/utils/formatBalance'
import { formatValidUntilDate } from '@/utils/formatValidUntilDate'

type BonusCardProps = Pick<
  CommonParkingCardProps,
  'balanceSeconds' | 'originalBalanceSeconds' | 'zoneName' | 'licencePlate' | 'validUntil'
>

const BonusCard = ({
  balanceSeconds,
  originalBalanceSeconds,
  zoneName,
  licencePlate,
  validUntil,
}: BonusCardProps) => {
  const { t } = useTranslation()
  const locale = useLocale()

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

export default BonusCard
