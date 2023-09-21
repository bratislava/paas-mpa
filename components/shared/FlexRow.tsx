import { clsx } from 'clsx'
import React, { ReactNode } from 'react'
import { View } from 'react-native'

type Props = {
  children: ReactNode
  cn?: string
}

const FlexRow = ({ children, cn }: Props) => {
  return <View className={clsx('flex-row justify-between g-4', cn)}>{children}</View>
}

export default FlexRow
