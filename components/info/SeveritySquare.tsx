import { clsx } from 'clsx'
import { View } from 'react-native'

import Icon, { IconName } from '@/components/shared/Icon'

type Props = {
  variant: 'info' | 'warning' | 'danger'
}

const SeveritySquare = ({ variant }: Props) => {
  const iconName: IconName =
    (
      {
        info: 'info',
        warning: 'warning',
        danger: 'error',
      } as const
    )[variant] ?? 'info'

  return (
    <View
      className={clsx('flex items-center justify-center rounded-lg p-3.5', {
        'bg-green-light': variant === 'info',
        'bg-warning-light': variant === 'warning',
        'bg-negative-light': variant === 'danger',
      })}
    >
      <Icon
        name={iconName}
        className={clsx({
          'text-green': variant === 'info',
          'text-warning': variant === 'warning',
          'text-negative': variant === 'danger',
        })}
        size={20}
      />
    </View>
  )
}

export default SeveritySquare
