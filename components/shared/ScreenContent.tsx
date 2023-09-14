import { clsx } from 'clsx'
import React, { ReactNode } from 'react'
import { View } from 'react-native'

type Props = {
  children: ReactNode
  cn?: string
}

const ScreenContent = ({ children, cn }: Props) => {
  return <View className={clsx('p-5 g-5', cn)}>{children}</View>
}

export default ScreenContent
