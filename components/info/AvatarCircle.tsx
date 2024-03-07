import { View } from 'react-native'

import Icon from '@/components/shared/Icon'
import { clsx } from '@/utils/clsx'

type Props = {
  variant?: 'info' | 'success' | 'warning' | 'error'
}

const AvatarCircle = ({ variant = 'info' }: Props) => {
  const iconName =
    (
      {
        info: 'info-outline',
        success: 'check',
        warning: 'warning', // TODO outline warning
        error: 'error-outline',
      } as const
    )[variant] ?? 'info'

  const iconClassName =
    (
      {
        info: 'text-info',
        success: 'text-green',
        warning: 'text-warning',
        error: 'text-negative',
      } as const
    )[variant] ?? 'info'

  return (
    <View
      className={clsx('flex items-center justify-center rounded-full p-6', {
        'bg-info-light': variant === 'info',
        'bg-green-light': variant === 'success',
        'bg-warning-light': variant === 'warning',
        'bg-negative-light': variant === 'error',
      })}
    >
      <Icon name={iconName} className={iconClassName} size={40} />
    </View>
  )
}

export default AvatarCircle
