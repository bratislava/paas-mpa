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

  return (
    <View
      className={clsx('flex items-center justify-center self-center rounded-full p-4', {
        'bg-info-100': variant === 'info',
        'bg-green-light': variant === 'success' || variant === 'thumbUp',
        'bg-warning-100': variant === 'warning',
        'bg-negative-100': variant === 'error',
        'bg-custom-light': variant === 'noGps',
      })}
    >
      <Icon name={iconName} />
    </View>
  )
}

export default AvatarCircle
