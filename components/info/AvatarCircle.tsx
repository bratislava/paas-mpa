import { clsx } from 'clsx'
import React from 'react'
import { View } from 'react-native'

import Icon from '@/components/shared/Icon'

type Props = {
  variant?: 'info' | 'success' | 'warning' | 'error' | 'thumbUp' | 'noGps'
}

// TODO icon size and color
const AvatarCircle = ({ variant = 'info' }: Props) => {
  const iconName =
    (
      {
        info: 'info-outline',
        success: 'check',
        warning: 'warning', // TODO outline warning
        error: 'error-outline',
        thumbUp: 'thumb-up',
        noGps: 'location-disabled',
      } as const
    )[variant] ?? 'info'

  const iconClassName =
    (
      {
        info: 'text-info',
        success: 'text-green',
        warning: 'text-warning',
        error: 'text-negative',
        thumbUp: 'text-green',
        noGps: 'text-black',
      } as const
    )[variant] ?? 'info'

  return (
    <View
      className={clsx('flex items-center justify-center self-center rounded-full p-4', {
        'bg-info-light': variant === 'info',
        'bg-green-light': variant === 'success' || variant === 'thumbUp',
        'bg-warning-light': variant === 'warning',
        'bg-negative-light': variant === 'error',
        'bg-light': variant === 'noGps',
      })}
    >
      <Icon name={iconName} className={iconClassName} />
    </View>
  )
}

export default AvatarCircle
