import { ReactNode } from 'react'
import { View, ViewProps } from 'react-native'

import Icon, { IconName } from '@/components/shared/Icon'
import Typography from '@/components/shared/Typography'
import { cn } from '@/utils/cn'

export type MenuRowProps = {
  label: string
  variant?: 'default' | 'negative'
  startIcon?: IconName
  endIcon?: IconName
  endSlot?: ReactNode
} & ViewProps

// Figma: https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-mpa?node-id=2677%3A22255&mode=dev

const MenuRow = ({
  label,
  startIcon,
  endIcon,
  endSlot,
  variant,
  className,
  ...rest
}: MenuRowProps) => {
  const textColor = variant === 'negative' ? 'text-negative' : ''

  return (
    <View className={cn('flex-row items-center gap-3 py-2', className)} {...rest}>
      {startIcon && <Icon name={startIcon} className={textColor} size={20} />}

      <Typography variant="default-semibold" className={cn('flex-1', textColor)}>
        {label}
      </Typography>

      {endSlot}

      {endIcon && <Icon name={endIcon} className={textColor} size={20} />}
    </View>
  )
}

export default MenuRow
