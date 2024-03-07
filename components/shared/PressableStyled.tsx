import { forwardRef } from 'react'
import { Pressable, PressableProps, View } from 'react-native'

import { clsx } from '@/utils/clsx'

// TODO styling, maybe some animation/transition, android ripple effect?
const PressableStyled = forwardRef<View, PressableProps>(({ className, ...props }, ref) => {
  return <Pressable ref={ref} {...props} className={clsx('active:opacity-50', className)} />
})

export default PressableStyled
