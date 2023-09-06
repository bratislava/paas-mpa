import { clsx } from 'clsx'
import React from 'react'
import { TextInput as TextInputNative, TextInputProps } from 'react-native'

type Props = Omit<TextInputProps, 'editable'> & {
  hasError?: boolean
  isDisabled?: boolean
}

// TODO associate control with with label

const TextInput = ({ hasError, isDisabled, ...rest }: Props) => {
  return (
    <TextInputNative
      className={clsx('rounded border px-4 py-3', {
        'border-divider focus:border-dark': !isDisabled && !hasError,
        'border-negative': hasError && !isDisabled,
        'border-divider bg-custom-gray-100': isDisabled,
      })}
      editable={!isDisabled}
      {...rest}
    />
  )
}

export default TextInput
