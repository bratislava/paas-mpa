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
    | 'button'
}

const Typography = ({ variant = 'default', children, className, ...rest }: Props) => {
  return (
    <TextNative
      className={clsx(
        'font-inter-400regular text-dark',
        {
          'font-inter-700bold text-16': variant === 'button',
          'font-belfast-700bold text-h1': variant === 'h1',
          'font-belfast-700bold text-h2': variant === 'h2',
          'font-belfast-700bold text-h3': variant === 'h3',
          'text-16': variant.startsWith('default'),
          'text-14': variant.startsWith('small'),
          'font-inter-600semibold': variant.includes('-semibold'),
          'font-inter-700bold': variant.includes('-bold'),
        },
        className,
      )}
      {...rest}
    >
      {children}
    </TextNative>
  )
}

export default Typography
