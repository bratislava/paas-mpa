import React from 'react'
import { View, ViewProps } from 'react-native'
import { cn } from '@/utils/cn'

type Props = ViewProps

const Panel = ({ className, children, ...rest }: Props) => {
  return (
    <View className={cn('rounded bg-soft p-4', className)} {...rest}>
      {children}
    </View>
  )
}

export default Panel
