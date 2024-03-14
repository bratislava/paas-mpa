import { forwardRef } from 'react'
import { Pressable, PressableProps, View } from 'react-native'

import { cn } from '@/utils/cn'
// TODO styling, maybe some animation/transition, android ripple effect?
const PressableStyled = forwardRef<View, PressableProps>(({ className, ...props }, ref) => {
  return <Pressable ref={ref} {...props} className={cn('active:opacity-50', className)} />
})

export default PressableStyled
