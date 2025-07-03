import { forwardRef, ReactNode, useRef, useState } from 'react'
import {
  LayoutChangeEvent,
  TextInput as TextInputNative,
  TextInputProps as TextInputNativeProps,
  View,
} from 'react-native'

import { useMultipleRefsSetter } from '@/hooks/useMultipleRefsSetter'
import { cn } from '@/utils/cn'

export type TextInputProps = Omit<TextInputNativeProps, 'editable'> & {
  hasError?: boolean
  isDisabled?: boolean
  leftIcon?: ReactNode
  viewClassName?: string
}

// TODO associate control with label
// eslint-disable-next-line no-secrets/no-secrets
// TODO multiline height on ios, inspiration?: https://stackoverflow.com/questions/35936908/numberoflines-textinput-property-not-working

const TextInput = forwardRef<TextInputNative, TextInputProps>(
  (
    {
      hasError,
      isDisabled,
      leftIcon,
      multiline,
      className,
      viewClassName,
      pointerEvents,
      onBlur,
      onFocus,
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false)
    const localRef = useRef<TextInputNative>(null)
    const refSetter = useMultipleRefsSetter(localRef, ref)

    const [iconWidth, setIconWidth] = useState<number>()

    const onLeftIconLayout = (event: LayoutChangeEvent) =>
      setIconWidth(event.nativeEvent.layout.width)

    return (
      <View className={cn('relative', viewClassName)} pointerEvents={pointerEvents}>
        {/* TODO lineHeight does not work properly on ios, see issue: https://github.com/facebook/react-native/issues/39145 */}
        {/* Quick-fix by setting height instead of lineHeight */}
        {/* Instead of "text-[16px]" and height, it should use only predefined "text-base" */}
        <TextInputNative
          ref={refSetter}
          style={{ paddingLeft: iconWidth }}
          maxFontSizeMultiplier={1.2}
          editable={!isDisabled}
          textAlignVertical={multiline ? 'top' : 'center'}
          className={cn(
            'min-h-[52px] items-center rounded border bg-white py-3 pr-4 font-inter-400regular text-[16px]',
            {
              'border-divider': !isDisabled && !hasError,
              'border-dark': !isDisabled && !hasError && isFocused,
              'border-negative': hasError && !isDisabled,
              'border-divider bg-[#D6D6D6]': isDisabled,
              'flex-1 shrink items-center': multiline,
              'pl-4': !leftIcon,
            },
            className,
          )}
          numberOfLines={multiline ? undefined : 1}
          multiline={multiline}
          pointerEvents={pointerEvents}
          onFocus={(e) => {
            onFocus?.(e)
            setIsFocused(true)
          }}
          onBlur={(e) => {
            onBlur?.(e)
            setIsFocused(false)
          }}
          {...rest}
        />

        {leftIcon ? (
          <View
            pointerEvents="none"
            onLayout={onLeftIconLayout}
            className="absolute h-full justify-center pl-4 pr-2"
          >
            {leftIcon}
          </View>
        ) : null}
      </View>
    )
  },
)

export default TextInput
