import { clsx } from 'clsx'
import React from 'react'
import { Text as TextNative, TextProps } from 'react-native'

type Props = TextProps & {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'default'
    | 'default-semibold'
    | 'default-bold'
    | 'small'
    | 'small-semibold'
    | 'small-bold'
}

const Typography = ({ variant = 'default', children, ...rest }: Props) => {
  return (
    <TextNative
      className={clsx('text-dark', {
        'text-h1 font-bold': variant === 'h1',
        'text-h2 font-bold': variant === 'h2',
        'text-h3 font-bold': variant === 'h3',
        'text-16': variant.startsWith('default'),
        'text-14': variant.startsWith('small'),
        'font-semibold': variant.includes('-semibold'),
        'font-bold': variant.includes('-bold'),
      })}
      {...rest}
    >
      {children}
    </TextNative>
  )
}

export default Typography
