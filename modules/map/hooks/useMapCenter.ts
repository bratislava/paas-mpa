import { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'

type Options = {
  safeArea?: boolean
  scale?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getBottomMapPadding = (height: number) => {
  return 150
}

export const useMapCenter = (options?: Options) => {
  const { safeArea = false, scale = false } = options ?? {}
  const safeAreaFrame = useSafeAreaFrame()
  const dimensions = useWindowDimensions()

  console.log('height', dimensions.height)

  return useMemo(() => {
    const bottomPadding = getBottomMapPadding(dimensions.height)
    const windowWidth = safeArea ? safeAreaFrame.width : dimensions.width
    const windowHeight = safeArea ? safeAreaFrame.height : dimensions.height

    return {
      top: ((windowHeight - bottomPadding) * (scale ? dimensions.scale : 1)) / 2,
      left: (windowWidth * (scale ? dimensions.scale : 1)) / 2,
    }
  }, [safeAreaFrame, dimensions, safeArea, scale])
}
