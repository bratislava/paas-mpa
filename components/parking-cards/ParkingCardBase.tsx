import { clsx } from 'clsx'
import React, { ReactNode } from 'react'

import Panel from '@/components/shared/Panel'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'

type Props = {
  variant: 'visitor' | 'resident' | 'bonus'
  children: ReactNode
}

const ParkingCardBase = ({ variant, children }: Props) => {
  const t = useTranslation('ParkingCards')

  return (
    <Panel
      className={clsx('border', {
        'border-visitorCard bg-visitorCard-light': variant === 'visitor',
        'border-dark bg-dark-light': variant === 'resident',
        // TODO bonus
      })}
    >
      <Typography variant="default-semibold">{t(`type.${variant}`)}</Typography>

      {children}
    </Panel>
  )
}

export default ParkingCardBase
