import clsx from 'clsx'
import { View, ViewProps } from 'react-native'

import Icon, { IconName } from '@/components/shared/Icon'
import Typography from '@/components/shared/Typography'

export type ListRowProps = {
  icon: IconName
  label: string
  labelClassName?: string
} & Omit<ViewProps, 'children'>

const ListRow = ({ icon, label, labelClassName, ...rest }: ListRowProps) => {
  return (
    <View className="flex-row gap-3 py-3" {...rest}>
      <Icon name={icon} />

      <Typography variant="default-semibold" className={clsx('flex-1', labelClassName)}>
        {label}
      </Typography>

      <Icon name="chevron-right" />
    </View>
  )
}

export default ListRow
