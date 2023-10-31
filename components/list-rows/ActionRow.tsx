import clsx from 'clsx'
import { View } from 'react-native'

import Icon, { IconName } from '@/components/shared/Icon'
import Typography from '@/components/shared/Typography'

export type ActionRowProps = {
  startIcon?: IconName
  endIcon?: IconName
  label: string
  variant?: 'default' | 'negative'
}

const ActionRow = ({ startIcon, endIcon, label, variant = 'default' }: ActionRowProps) => {
  const textColor = variant === 'negative' ? 'text-negative' : ''

  return (
    <View className="flex-row gap-3 py-4">
      {startIcon && <Icon name={startIcon} className={textColor} />}

      <Typography variant="default-semibold" className={clsx('flex-1', textColor)}>
        {label}
      </Typography>

      {endIcon && <Icon name={endIcon} className={textColor} />}
    </View>
  )
}

export default ActionRow
