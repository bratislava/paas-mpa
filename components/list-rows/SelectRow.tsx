import clsx from 'clsx'
import { FC } from 'react'
import { PressableProps } from 'react-native'
import { SvgProps } from 'react-native-svg'

import CheckBox from '@/components/shared/CheckBox'
import Icon, { IconName } from '@/components/shared/Icon'
import Typography from '@/components/shared/Typography'

import PressableStyled from '../shared/PressableStyled'

// TODO onPress toggle checkbox may need better implementation

export type SelectRowProps = {
  icon?: IconName
  label: string
  labelClassName?: string
  value: boolean
  onValueChange: (value: boolean) => void
  disabled?: boolean
  IconComponent?: FC<SvgProps>
} & Omit<PressableProps, 'children'>

const SelectRow = ({
  icon,
  label,
  labelClassName,
  value,
  onValueChange,
  disabled,
  IconComponent,
  ...restPressableProps
}: SelectRowProps) => {
  return (
    <PressableStyled
      onPress={() => onValueChange(!value)}
      disabled={disabled}
      className="flex-row items-center gap-3 py-3"
      {...restPressableProps}
    >
      {icon ? <Icon name={icon} /> : IconComponent ? <IconComponent /> : null}

      <Typography variant="default-semibold" className={clsx('flex-1', labelClassName)}>
        {label}
      </Typography>

      <CheckBox pointerEvents="none" value={value} onChange={onValueChange} disabled={disabled} />
    </PressableStyled>
  )
}

export default SelectRow
