import clsx from 'clsx'
import { View, ViewProps } from 'react-native'

import Icon, { IconName } from '@/components/shared/Icon'
import Typography from '@/components/shared/Typography'

export type ListRowProps = {
  icon?: IconName
  label: string
  labelClassName?: string
} & Omit<ViewProps, 'children'>

/**
 * `ListRow` should always be wrapped in `PressableStyled` (+ `Link` if needed)
 *
 * @param icon
 * @param label
 * @param labelClassName
 * @param rest
 * @constructor
 */
const ListRow = ({ icon, label, labelClassName, ...rest }: ListRowProps) => {
  return (
    <View className="flex-row gap-4 py-4" {...rest}>
      {icon ? <Icon name={icon} /> : null}

      <Typography className={clsx('flex-1', labelClassName)}>{label}</Typography>

      <Icon name="chevron-right" />
    </View>
  )
}

export default ListRow
