import { PropsWithChildren, useMemo } from 'react'
import { useWindowDimensions } from 'react-native'
import Animated, { interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated'

export type BottomSheetTopAttachmentProps = PropsWithChildren & {
  snapPoints: (string | number)[]
  animatedPosition: SharedValue<number>
}

const normalizeSnapPoint = (snapPoint: string | number, screenHeight: number) => {
  if (typeof snapPoint === 'number') {
    return snapPoint
  }
  if (snapPoint.at(-1) !== '%') {
    throw new Error('Wrong snap point format. Correct format is e.g. "100%"')
  }
  const [numberString] = snapPoint.split('%')
  const y = Number.parseInt(numberString, 10)

  return Math.round(screenHeight * (y / 100))
}

const BottomSheetTopAttachment = ({
  children,
  snapPoints,
  animatedPosition,
}: BottomSheetTopAttachmentProps) => {
  const { height: screenHeight } = useWindowDimensions()
  const minMaxSnapPoints: number[] = useMemo(() => {
    if (snapPoints.length === 0) {
      return [0, 0]
    }
    const min = normalizeSnapPoint(snapPoints.at(0)!, screenHeight) - 50
    const max = normalizeSnapPoint(snapPoints.at(-1)!, screenHeight) + 50

    return [min, max]
  }, [snapPoints, screenHeight])
  const animatedStyles = useAnimatedStyle(() => {
    const translateY = interpolate(animatedPosition.value, minMaxSnapPoints, [
      minMaxSnapPoints[0] - screenHeight,
      minMaxSnapPoints[1] - screenHeight,
    ])

    return {
      transform: [{ translateY }],
    }
  })

  return (
    <Animated.View className="absolute bottom-0 w-full" style={animatedStyles}>
      {children}
    </Animated.View>
  )
}

export default BottomSheetTopAttachment
