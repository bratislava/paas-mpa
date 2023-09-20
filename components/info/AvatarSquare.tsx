import { clsx } from 'clsx'
import React from 'react'
import { View } from 'react-native'

import Icon, { IconName } from '@/components/shared/Icon'

type Props = {
  variant: 'visitor-card' | 'payment-gate'
}

const AvatarSquare = ({ variant }: Props) => {
  const iconName: IconName =
    (
      {
        'visitor-card': 'people',
        'payment-gate': 'payment',
      } as const
    )[variant] ?? 'info'

  return (
    <View
      className={clsx(
        'flex items-center justify-center self-center rounded p-[10px]',
        variant === 'visitor-card' ? 'bg-visitorCard' : 'bg-dark',
      )}
    >
      <Icon name={iconName} className="text-white" />
    </View>
  )
}

export default AvatarSquare
