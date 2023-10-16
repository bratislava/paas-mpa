import { clsx } from 'clsx'
import { forwardRef, ReactNode, useCallback, useRef } from 'react'
import {
  Pressable,
  TextInput as TextInputNative,
  TextInputProps as TextInputNativeProps,
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
      <Pressable onPress={handlePress}>
        <View
          className={clsx('flex-row rounded border bg-white px-4 py-3 g-3', {
            'border-divider focus:border-dark': !isDisabled && !hasError,
            'border-negative': hasError && !isDisabled,
            'border-divider bg-[#D6D6D6]': isDisabled,
          })}
        >
          {leftIcon ? <View aria-hidden>{leftIcon}</View> : null}
          {/* TODO font size in input */}
          <TextInputNative ref={refSetter} editable={!isDisabled} className="flex-1" {...rest} />
        </View>
      </Pressable>
    )
  },
)

export default TextInput
