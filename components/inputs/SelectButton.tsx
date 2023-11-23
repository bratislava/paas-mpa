import clsx from 'clsx'
import { forwardRef } from 'react'
import { PressableProps, View } from 'react-native'

import Icon from '@/components/shared/Icon'
import PressableStyled from '@/components/shared/PressableStyled'
import Typography from '@/components/shared/Typography'

type Props = {
  hasError?: boolean
  isDisabled?: boolean
  value?: string
  placeholder?: string
} & Omit<PressableProps, 'disabled'>

const SelectButton = forwardRef<View, Props>(
  ({ hasError, isDisabled, value, placeholder, ...rest }, ref) => {
    return (
      <PressableStyled ref={ref} disabled={isDisabled} {...rest}>
        <View
          className={clsx('flex-row rounded border bg-white px-4 py-3 g-3', {
            'border-divider focus:border-dark': !isDisabled && !hasError,
            'border-negative': hasError && !isDisabled,
            'border-divider bg-[#D6D6D6]': isDisabled,
          })}
        >
          {value ? (
            <Typography className="flex-1 font-inter-400regular text-16">{value}</Typography>
          ) : placeholder ? (
            <Typography className="flex-1 font-inter-400regular text-16 text-placeholder">
              {placeholder}
            </Typography>
          ) : null}
          <Icon name="arrow-drop-down" className="text-dark" />
        </View>
      </PressableStyled>
    )
  },
)

export default SelectButton
