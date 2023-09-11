import { Icon } from '@rneui/base'
import { clsx } from 'clsx'
import React from 'react'
import { View } from 'react-native'

type Props = {
  variant: 'visitor-card' | 'payment-gate'
}

const AvatarSquare = ({ variant }: Props) => {
  const iconName =
    {
      'visitor-card': 'people',
      'payment-gate': 'payment',
    }[variant] ?? 'info'

  return (
    <View
      className={clsx('flex items-center justify-center self-center rounded p-[10px]', {
        'bg-visitorCard': variant === 'visitor-card',
        'bg-dark': variant === 'payment-gate',
      })}
    >
      <Icon name={iconName} color="white" />
    </View>
  )
}

export default AvatarSquare
