import { useMemo } from 'react'
import { useWindowDimensions } from 'react-native'
import { useSafeAreaFrame } from 'react-native-safe-area-context'

type Options = {
  safeArea?: boolean
  scale?: boolean
}

// TODO: make screen height dependent?
export const getMapPadding = () => {
  return {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    // Half of the `MapZoneBottomSheet` height when zone is shown
    paddingBottom: 180,
  }
}

export const useMapCenter = (options?: Options) => {
  const { safeArea = false, scale = false } = options ?? {}
  const safeAreaFrame = useSafeAreaFrame()
  const dimensions = useWindowDimensions()

  return useMemo(() => {
    const bottomPadding = getMapPadding().paddingBottom
    const windowWidth = safeArea ? safeAreaFrame.width : dimensions.width
    const windowHeight = safeArea ? safeAreaFrame.height : dimensions.height

    return {
      top: ((windowHeight - bottomPadding) * (scale ? dimensions.scale : 1)) / 2,
      left: (windowWidth * (scale ? dimensions.scale : 1)) / 2,
    }
  }, [safeAreaFrame, dimensions, safeArea, scale])
}
