import { clsx } from 'clsx'
import React from 'react'
import { TextInput as TextInputNative, TextInputProps } from 'react-native'

type Props = Omit<TextInputProps, 'editable'> & {
  hasError?: boolean
  isDisabled?: boolean
}

// TODO associate control with label
// eslint-disable-next-line no-secrets/no-secrets
// TODO multiline height on ios, inspiration?: https://stackoverflow.com/questions/35936908/numberoflines-textinput-property-not-working

const TextInput = ({ hasError, isDisabled, ...rest }: Props) => {
  return (
    <TextInputNative
      className={clsx('rounded border bg-white px-4 py-3', {
        'border-divider focus:border-dark': !isDisabled && !hasError,
        'border-negative': hasError && !isDisabled,
        'border-divider bg-[#D6D6D6]': isDisabled,
      })}
      editable={!isDisabled}
      {...rest}
    />
  )
}

export default TextInput
