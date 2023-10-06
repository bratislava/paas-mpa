import clsx from 'clsx'
import { Image, ImageSourcePropType, Pressable, PressableProps } from 'react-native'

import CheckBox from '@/components/shared/CheckBox'
import Icon, { IconName } from '@/components/shared/Icon'
import Typography from '@/components/shared/Typography'

// TODO onPress toggle checkbox may need better implementation

export type SelectRowProps = {
  icon?: IconName
  label: string
  labelClassName?: string
  value: boolean
  onValueChange: (value: boolean) => void
  disabled?: boolean
  iconSource?: ImageSourcePropType
} & Omit<PressableProps, 'children'>

const SelectRow = ({
  icon,
  label,
  labelClassName,
  value,
  onValueChange,
  disabled,
  iconSource,
  ...restPressableProps
}: SelectRowProps) => {
  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      className="flex-row gap-3 py-3"
      {...restPressableProps}
    >
      {icon ? (
        <Icon name={icon} />
      ) : iconSource ? (
        <Image className="h-10 w-10" source={iconSource} />
      ) : null}

      <Typography variant="default-semibold" className={clsx('flex-1', labelClassName)}>
        {label}
      </Typography>

      {/* TODO CheckBox size */}
      <CheckBox value={value} onValueChange={onValueChange} disabled={disabled} />
    </Pressable>
  )
}

export default SelectRow
