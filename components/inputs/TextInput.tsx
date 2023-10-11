import { clsx } from 'clsx'
import { forwardRef, ReactNode, useCallback, useRef } from 'react'
import { TextInput as TextInputNative, TextInputProps, View } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

import { useMultipleRefsSetter } from '@/hooks/useMultipleRefsSetter'

type Props = Omit<TextInputProps, 'editable'> & {
  hasError?: boolean
  isDisabled?: boolean
  leftIcon?: ReactNode
}

// TODO associate control with label
// eslint-disable-next-line no-secrets/no-secrets
// TODO multiline height on ios, inspiration?: https://stackoverflow.com/questions/35936908/numberoflines-textinput-property-not-working

const TextInput = forwardRef<TextInputNative, Props>(
  ({ hasError, isDisabled, leftIcon, ...rest }, ref) => {
    const localRef = useRef<TextInputNative>(null)
    const refSetter = useMultipleRefsSetter(localRef, ref)

    const handlePress = useCallback(() => {
      localRef.current?.focus()
    }, [])

    return (
      <TouchableWithoutFeedback
        className={clsx('flex-row rounded border bg-white px-4 py-3 g-3', {
          'border-divider focus:border-dark': !isDisabled && !hasError,
          'border-negative': hasError && !isDisabled,
          'border-divider bg-[#D6D6D6]': isDisabled,
        })}
        onPress={handlePress}
      >
        <View className="h-6 w-6">{leftIcon ?? null}</View>
        <TextInputNative ref={refSetter} editable={!isDisabled} {...rest} />
      </TouchableWithoutFeedback>
    )
  },
)

export default TextInput
