import { PropsWithChildren, useCallback } from 'react'
import { LayoutChangeEvent } from 'react-native'
import Animated, { SharedValue, useAnimatedStyle, useSharedValue } from 'react-native-reanimated'

export type BottomSheetTopAttachmentProps = PropsWithChildren & {
  animatedPosition: SharedValue<number>
}

const BottomSheetTopAttachment = ({
  children,
  animatedPosition,
}: BottomSheetTopAttachmentProps) => {
  const sharedHeight = useSharedValue(0)

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: -sharedHeight.value }, { translateY: animatedPosition.value }],
  }))

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      sharedHeight.value = event.nativeEvent.layout.height
    },
    [sharedHeight],
  )

  return (
    <Animated.View
      className="absolute top-0 w-full"
      style={animatedStyles}
      pointerEvents="box-none"
      onLayout={handleLayout}
    >
      {children}
    </Animated.View>
  )
}

export default BottomSheetTopAttachment
