import { clsx } from 'clsx'
import { forwardRef, ReactNode, useCallback, useRef } from 'react'
import {
  TextInput as TextInputNative,
  TextInputProps as TextInputNativeProps,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import { useMultipleRefsSetter } from '@/hooks/useMultipleRefsSetter'

export type TextInputProps = Omit<TextInputNativeProps, 'editable'> & {
  hasError?: boolean
  isDisabled?: boolean
  leftIcon?: ReactNode
}

// TODO associate control with label
// eslint-disable-next-line no-secrets/no-secrets
// TODO multiline height on ios, inspiration?: https://stackoverflow.com/questions/35936908/numberoflines-textinput-property-not-working

const TextInput = forwardRef<TextInputNative, TextInputProps>(
  ({ hasError, isDisabled, leftIcon, ...rest }, ref) => {
    const localRef = useRef<TextInputNative>(null)
    const refSetter = useMultipleRefsSetter(localRef, ref)

    const handlePress = useCallback(() => {
      localRef.current?.focus()
    }, [])

    return (
      <TouchableWithoutFeedback onPress={handlePress}>
        <View
          className={clsx('flex-row rounded border bg-white px-4 py-3 g-3', {
            'border-divider focus:border-dark': !isDisabled && !hasError,
            'border-negative': hasError && !isDisabled,
            'border-divider bg-[#D6D6D6]': isDisabled,
          })}
        >
          <View className="h-6 w-6">{leftIcon ?? null}</View>
          <TextInputNative ref={refSetter} editable={!isDisabled} {...rest} />
        </View>
      </TouchableWithoutFeedback>
    )
  },
)

export default TextInput
