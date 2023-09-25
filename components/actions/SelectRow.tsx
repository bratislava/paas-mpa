import clsx from 'clsx'
import { Pressable, PressableProps } from 'react-native'

import CheckBox, { CheckBoxProps } from '@/components/shared/CheckBox'
import Icon, { IconName } from '@/components/shared/Icon'
import Typography from '@/components/shared/Typography'

export type SelectRowProps = {
  icon?: IconName
  label: string
  labelClassName?: string
} & CheckBoxProps &
  Omit<PressableProps, 'children'>

const SelectRow = ({
  icon,
  label,
  labelClassName,
  value,
  onValueChange,
  disabled,
  ...restPressableProps
}: SelectRowProps) => {
  return (
    <Pressable
      // TODO onPress toggle checkbox
      // onPress={() => onValueChange()}
      className="flex-row gap-3 py-3"
      {...restPressableProps}
    >
      {icon && <Icon name={icon} />}

      <Typography variant="default-semibold" className={clsx('flex-1', labelClassName)}>
        {label}
      </Typography>

      {/* TODO CheckBox size */}
      <CheckBox value={value} onValueChange={onValueChange} disabled={disabled} />
    </Pressable>
  )
}

export default SelectRow
