import React from 'react'

import CardContentItem from '@/components/parking-cards/base/CardContentItem'
import ParkingCardBase from '@/components/parking-cards/base/ParkingCardBase'
import ParkingCardContent from '@/components/parking-cards/base/ParkingCardContent'
import { CommonParkingCardProps } from '@/components/parking-cards/ParkingCard'
import Divider from '@/components/shared/Divider'
import Typography from '@/components/shared/Typography'
import { useLocale, useTranslation } from '@/hooks/useTranslation'
import { formatBalance } from '@/utils/formatBalance'
import { formatDate } from '@/utils/formatDate'

type VisitorCardProps = Pick<
  CommonParkingCardProps,
  'zoneName' | 'balanceSeconds' | 'originalBalanceSeconds' | 'validUntil'
>

const VisitorCard = ({
  zoneName,
  balanceSeconds,
  originalBalanceSeconds,
  validUntil,
}: VisitorCardProps) => {
  const { t } = useTranslation()
  const locale = useLocale()

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
        {validUntil ? (
          <CardContentItem
            description={t('ParkingCards.validUntil')}
            value={formatDate(new Date(validUntil), locale)}
          />
        ) : null}
      </ParkingCardContent>
    </ParkingCardBase>
  )
}

export default VisitorCard
