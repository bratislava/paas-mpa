import { ReactNode } from 'react'

import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { cn } from '@/utils/cn'

type Props = {
  variant:
    | 'visitor'
    | 'resident'
    | 'bonus'
    | 'subscriber'
    | 'electric-car'
    | 'tzp'
    | 'social-services'
    | 'other'
  children: ReactNode
}

const ParkingCardBase = ({ variant, children }: Props) => {
  const { t } = useTranslation()

  // TODO test translations
  const translationsMap = {
    visitor: t('ParkingCards.type.visitor'),
    resident: t('ParkingCards.type.resident'),
    bonus: t('ParkingCards.type.bonus'),
    subscriber: t('ParkingCards.type.subscriber'),
    'electric-car': t('ParkingCards.type.electric-car'),
    tzp: t('ParkingCards.type.tzp'),
    'social-services': t('ParkingCards.type.social-services'),
    other: t('ParkingCards.type.other'),
  } satisfies Record<typeof variant, string>

  return (
    <Panel
      className={cn('border', {
        'border-visitorCard bg-visitorCard-light': variant === 'visitor',
        'border-dark bg-dark-light': variant === 'resident',
        'border-divider bg-white': variant === 'bonus',
        'border-subscriberCard bg-subscriberCard-light': variant === 'subscriber',
        'border-electricCarCard bg-electricCarCard-light': variant === 'electric-car',
        'border-tzpCard bg-tzpCard-light': variant === 'tzp',
        'border-socialServicesCard bg-socialServicesCard-light': variant === 'social-services',
        'border-divider bg-dark-light': variant === 'other',
      })}
    >
      <Typography variant="default-semibold">{translationsMap[variant]}</Typography>

      {children}
    </Panel>
  )
}

export default ParkingCardBase
