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
  ({ hasError, isDisabled, leftIcon, multiline, className, ...rest }, ref) => {
    const localRef = useRef<TextInputNative>(null)
    const refSetter = useMultipleRefsSetter(localRef, ref)

    const handlePress = useCallback(() => {
      localRef.current?.focus()
    }, [])

    return (
      <Pressable onPress={handlePress} className={clsx(multiline && 'flex-1')}>
        <View
          className={clsx('flex-row items-center rounded border bg-white px-4 py-3 g-3', {
            'border-divider focus:border-dark': !isDisabled && !hasError,
            'border-negative': hasError && !isDisabled,
            'border-divider bg-[#D6D6D6]': isDisabled,
            'flex-1': multiline,
          })}
        >
          {leftIcon ? <View aria-hidden>{leftIcon}</View> : null}
          {/* TODO lineHeight does not work properly on ios, see issue: https://github.com/facebook/react-native/issues/39145 */}
          {/* Quick-fix by setting height instead of lineHeight */}
          {/* Instead of "h-[24px] text-[16px]", it should use only predefined "text-16" */}
          <TextInputNative
            ref={refSetter}
            editable={!isDisabled}
            className={clsx(
              'flex-1 font-inter-400regular text-[16px]',
              !multiline && 'h-[24px]',
              className,
            )}
            multiline={multiline}
            {...rest}
          />
        </View>
      </Pressable>
    )
  },
)

export default TextInput
