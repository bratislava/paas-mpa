import { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'

interface Props {
  safeArea?: boolean
  scale?: boolean
}

export const useScreenCenter = (props?: Props) => {
  const { safeArea = false, scale = false } = props ?? {}
  const safeAreaFrame = useSafeAreaFrame()
  const windowDimensions = useWindowDimensions()

  return useMemo(() => {
    const windowWidth = safeArea ? safeAreaFrame.width : windowDimensions.width
    const windowHeight = safeArea ? safeAreaFrame.height : windowDimensions.height

    return {
      top: (windowHeight * (scale ? windowDimensions.scale : 1)) / 2,
      left: (windowWidth * (scale ? windowDimensions.scale : 1)) / 2,
    }
  }, [safeAreaFrame, windowDimensions, safeArea, scale])
}
