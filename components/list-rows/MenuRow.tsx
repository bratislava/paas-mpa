import clsx from 'clsx'
import { ReactNode } from 'react'
import { View, ViewProps } from 'react-native'

import Icon, { IconName } from '@/components/shared/Icon'
import Typography from '@/components/shared/Typography'

export type MenuRowProps = {
  startIcon?: IconName
  endSlot?: ReactNode
  label: string
} & ViewProps

// Figma: https://www.figma.com/file/3TppNabuUdnCChkHG9Vft7/paas-mpa?node-id=2677%3A22255&mode=dev

const MenuRow = ({ startIcon, endSlot, label, className, ...rest }: MenuRowProps) => {
  return (
    <View className={clsx('flex-row items-center gap-3 py-2', className)} {...rest}>
      {startIcon && <Icon name={startIcon} size={20} />}

      <Typography variant="default-semibold" className="flex-1">
        {label}
      </Typography>

      {endSlot}
    </View>
  )
}

export default MenuRow
