import clsx from 'clsx'
import { forwardRef } from 'react'
import { Pressable, PressableProps, View } from 'react-native'

import Icon, { IconName } from '@/components/shared/Icon'
import Typography from '@/components/shared/Typography'

export type ActionRowProps = {
  startIcon?: IconName
  endIcon?: IconName
  label: string
  variant?: 'default' | 'negative'
} & Omit<PressableProps, 'children'>

const ActionRow = forwardRef<View, ActionRowProps>(
  ({ startIcon, endIcon, label, variant = 'default', ...rest }, ref) => {
    const textColor = variant === 'negative' ? 'text-negative' : ''

    return (
      <Pressable ref={ref} className="py-4" {...rest}>
        <View className="flex-row gap-3">
          {startIcon && <Icon name={startIcon} className={textColor} />}

          <Typography variant="default-semibold" className={clsx('flex-1', textColor)}>
            {label}
          </Typography>

          {endIcon && <Icon name={endIcon} className={textColor} />}
        </View>
      </Pressable>
    )
  },
)

export default ActionRow
