import clsx from 'clsx'
import { ReactNode } from 'react'
import { View } from 'react-native'

import Icon, { IconName } from '@/components/shared/Icon'
import Typography from '@/components/shared/Typography'

export type ActionRowProps = {
  label: string
  variant?: 'default' | 'negative'
  startIcon?: IconName
  endIcon?: IconName
  endSlot?: ReactNode
}

const ActionRow = ({ label, variant = 'default', startIcon, endIcon, endSlot }: ActionRowProps) => {
  const textColor = variant === 'negative' ? 'text-negative' : ''

  return (
    <View className="flex-row items-center gap-3 py-4">
      {startIcon && <Icon name={startIcon} className={textColor} />}

      <Typography variant="default-semibold" className={clsx('flex-1', textColor)}>
        {label}
      </Typography>

      {endSlot}

      {endIcon && <Icon name={endIcon} className={textColor} />}
    </View>
  )
}

export default ActionRow
