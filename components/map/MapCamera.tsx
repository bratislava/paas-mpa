import { Camera, CameraPadding } from '@rnmapbox/maps'
import { Position } from 'geojson'
import { forwardRef, useEffect, useMemo, useState } from 'react'

import { CITY_BOUNDS, MAP_CENTER } from '@/modules/map/constants'
import { useLocation } from '@/modules/map/hooks/useLocation'
import { getBottomMapPadding } from '@/modules/map/hooks/useMapCenter'
import { isWithinCityBounds } from '@/modules/map/utils/isWithinCityBounds'

type Props = {
  flyToCenter: Position | null
  cameraZoom?: number
  setFlyToCenter: (center: Position) => void
}

const MapCamera = forwardRef<Camera, Props>(({ cameraZoom, flyToCenter, setFlyToCenter }, ref) => {
  const [location] = useLocation()
  const [localFlyToCenter, setLocalFlyToCenter] = useState<Position | undefined>()
  const [isInitialized, setIsInitialized] = useState(false)

  const cameraPadding: CameraPadding = useMemo(() => {
    return {
      paddingBottom: getBottomMapPadding(),
      paddingLeft: 0,
      paddingRight: 0,
      paddingTop: 0,
    }
  }, [])

  useEffect(() => {
    const isWithinCity = isWithinCityBounds(location)
    if (isWithinCity && location) {
      setLocalFlyToCenter([location.coords.longitude, location.coords.latitude])
    }
  }, [setFlyToCenter, location])

  /** To accout for `flyToCenter` being reset to undefined,
   * set to MAP_CENTER only on ititialization when the user is not within the city */
  useEffect(() => {
    if (flyToCenter && flyToCenter !== localFlyToCenter) {
      setLocalFlyToCenter(flyToCenter ?? undefined)
    } else if (!isInitialized) {
      setIsInitialized(true)
      setLocalFlyToCenter(MAP_CENTER)
    }
  }, [flyToCenter, isInitialized, localFlyToCenter])

  return (
    <Camera
      ref={ref}
      followUserLocation={false}
      animationMode="flyTo"
      zoomLevel={cameraZoom ?? (localFlyToCenter ? 14 : 11.5)}
      centerCoordinate={localFlyToCenter}
      maxBounds={CITY_BOUNDS}
      padding={cameraPadding}
    />
  )
})

export default MapCamera
