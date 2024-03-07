import React from 'react'
import { View, ViewProps } from 'react-native'

import { clsx } from '@/utils/clsx'

type Props = ViewProps

const Panel = ({ className, children, ...rest }: Props) => {
  return (
    <View className={clsx('rounded bg-soft p-4', className)} {...rest}>
      {children}
    </View>
  )
}

export default Panel
