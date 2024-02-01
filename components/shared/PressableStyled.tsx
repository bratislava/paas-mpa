import { forwardRef } from 'react'
import { Pressable, PressableProps, View } from 'react-native'

// TODO styling, maybe some animation/transition, android ripple effect?
const PressableStyled = forwardRef<View, PressableProps>(({ ...props }, ref) => {
  return <Pressable ref={ref} {...props} className="active:opacity-50" />
})

export default PressableStyled
