import { clsx } from 'clsx'
import React, { ReactNode } from 'react'

import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

type Props = {
  variant: 'visitor' | 'resident' | 'bonus' | 'subscriber' | 'electric-car' | 'tzp' | 'other'
  children: ReactNode
}

const ParkingCardBase = ({ variant, children }: Props) => {
  const t = useTranslation('ParkingCards')

  return (
    <Panel
      className={clsx('border', {
        'border-visitorCard bg-visitorCard-light': variant === 'visitor',
        'border-dark bg-dark-light': variant === 'resident',
        'border-divider bg-white': variant === 'bonus',
        'border-subscriberCard bg-subscriberCard-light': variant === 'subscriber',
        'border-electricCarCard bg-electricCarCard-light': variant === 'electric-car',
        'border-tzpCard bg-tzpCard-light': variant === 'tzp',
        'border-divider bg-dark-light': variant === 'other',
      })}
    >
      <Typography variant="default-semibold">{t(`type.${variant}`)}</Typography>

      {children}
    </Panel>
  )
}

export default ParkingCardBase
