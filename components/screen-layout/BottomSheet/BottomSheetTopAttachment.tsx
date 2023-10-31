import { PropsWithChildren, useCallback, useState } from 'react'
import { LayoutChangeEvent, useWindowDimensions } from 'react-native'
import Animated, { interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated'

export type BottomSheetTopAttachmentProps = PropsWithChildren & {
  animatedPosition: SharedValue<number>
}

const BottomSheetTopAttachment = ({
  children,
  animatedPosition,
}: BottomSheetTopAttachmentProps) => {
  const { height: screenHeight } = useWindowDimensions()
  const [height, setHeight] = useState(0)
  const animatedStyles = useAnimatedStyle(() => {
    const translateY = interpolate(animatedPosition.value, [0, screenHeight], [0, screenHeight])

    return {
      transform: [{ translateY: -height }, { translateY }],
    }
  })

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setHeight(event.nativeEvent.layout.height)
  }, [])

  return (
    <Animated.View className="absolute top-0 w-full" style={animatedStyles} onLayout={handleLayout}>
      {children}
    </Animated.View>
  )
}

export default BottomSheetTopAttachment
