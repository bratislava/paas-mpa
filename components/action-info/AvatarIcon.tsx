import { Icon } from '@rneui/base'
import { clsx } from 'clsx'
import React from 'react'
import { View } from 'react-native'

type Props = {
  variant?: 'info' | 'success' | 'warning' | 'error'
}

// TODO icon size and color
const AvatarIcon = ({ variant = 'info' }: Props) => {
  const iconName =
    {
      info: 'info-outline',
      success: 'check',
      warning: 'warning', // TODO outline warning
      error: 'error-outline',
    }[variant] ?? 'info'

  return (
    <View
      className={clsx('flex items-center justify-center self-center rounded-full p-4', {
        'text-info-500 bg-info-100': variant === 'info',
        'bg-green-light text-green': variant === 'success',
        'text-warning-500 bg-warning-100': variant === 'warning',
        'bg-negative-100 text-negative-700': variant === 'error',
      })}
    >
      <Icon name={iconName} />
    </View>
  )
}

export default AvatarIcon
