import React from 'react'
import { View, ViewProps } from 'react-native'

import { clsx } from '@/utils/clsx'

const FlexRow = ({ className, ...rest }: ViewProps) => {
  return <View className={clsx('flex-row justify-between g-4', className)} {...rest} />
}

export default FlexRow
