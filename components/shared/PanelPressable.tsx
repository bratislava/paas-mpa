import { clsx } from 'clsx'
import React from 'react'
import { Pressable, PressableProps } from 'react-native'

type Props = PressableProps

const PanelPressable = ({ className, children, ...rest }: Props) => {
  return (
    <Pressable className={clsx('rounded bg-soft p-4', 'active:opacity-50', className)} {...rest}>
      {children}
    </Pressable>
  )
}

export default PanelPressable
