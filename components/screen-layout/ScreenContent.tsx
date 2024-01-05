import { clsx } from 'clsx'
import React, { ReactNode } from 'react'
import { View, ViewProps } from 'react-native'

type Props = {
  children: ReactNode
  variant?: 'default' | 'center'
} & ViewProps

const ScreenContent = ({ children, variant, className, ...rest }: Props) => {
  return (
    <View
      className={clsx(
        'flex-1 bg-white p-5 g-5',
        {
          // TODO long Text is not centered horizontally
          'items-center text-center': variant === 'center',
        },
        className,
      )}
      {...rest}
    >
      {children}
    </View>
  )
}

export default ScreenContent
