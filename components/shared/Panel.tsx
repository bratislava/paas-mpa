import { clsx } from 'clsx'
import React, { ReactNode } from 'react'
import { Pressable, View } from 'react-native'

type Props = {
  isPressable?: boolean
  surfaceClassName?: string
  children?: ReactNode
}

const Panel = ({ isPressable = false, surfaceClassName, children }: Props) => {
  // eslint-disable-next-line const-case/uppercase
  const className = clsx(
    'rounded bg-soft p-4',
    isPressable && 'active:opacity-50',
    surfaceClassName,
  )

  return isPressable ? (
    <Pressable className={className}>{children}</Pressable>
  ) : (
    <View className={className}>{children}</View>
  )
}

export default Panel
