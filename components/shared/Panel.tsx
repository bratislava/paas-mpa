import { clsx } from 'clsx'
import React from 'react'
import { View, ViewProps } from 'react-native'

type Props = ViewProps

const Panel = ({ className, children, ...rest }: Props) => {
  return (
    <View className={clsx('rounded bg-soft p-4', className)} {...rest}>
      {children}
    </View>
  )
}

export default Panel
