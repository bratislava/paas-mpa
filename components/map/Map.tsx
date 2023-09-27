/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Camera,
  FillLayer,
  MapView,
  ShapeSource,
  UserLocation,
  UserLocationRenderMode,
  UserTrackingMode,
} from '@rnmapbox/maps'
import React, { useRef, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import udrStyle from 'utils/layer-styles/visitors2'

import { useProcessedArcgisData } from '@/modules/map/hooks/useProcessedMapData'

import { useLocationPermission } from '@/modules/map/hooks/useLocationPermission'
import { MAP_INSETS } from '../../modules/map/constants'

type Props = {
  onBottomSheetContentChange?: (content: any) => void
}

const Map = ({ onBottomSheetContentChange }: Props) => {
  const camera = useRef<Camera>(null)
  const map = useRef<MapView>(null)
  const [followingUser, setFollowingUser] = useState(true)
  useLocationPermission()
  const insets = useSafeAreaInsets()

  const { isLoading, markersData, zonesData, udrData, odpData } = useProcessedArcgisData()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bottomSheetContent, setBottomSheetContent] = useState<any>(null)

  // useEffect(() => {
  //   onBottomSheetContentChange?.(bottomSheetContent)
  // }, [bottomSheetContent, onBottomSheetContentChange])

  return (
    <MapView
      ref={map}
      className="flex-1"
      // eslint-disable-next-line no-secrets/no-secrets
      styleURL="mapbox://styles/inovaciebratislava/cl5teyncz000614o4le1p295o"
      scaleBarPosition={{
        top: insets.top + MAP_INSETS.top,
        left: insets.left + MAP_INSETS.left,
      }}
    >
      <Camera
        ref={camera}
        followUserLocation={followingUser}
        followUserMode={UserTrackingMode.Follow}
        animationMode="flyTo"
        followZoomLevel={14}
      />
      <UserLocation
        androidRenderMode="gps"
        renderMode={UserLocationRenderMode.Normal}
        showsUserHeadingIndicator
        visible
        minDisplacement={3}
        animated
      />
      {udrData && (
        <ShapeSource id="udrSource" shape={udrData} onPress={setBottomSheetContent}>
          <FillLayer
            id="udrFill"
            style={udrStyle.reduce((prev, current) => ({ ...prev, ...current.paint }), {})}
          />
        </ShapeSource>
      )}
    </MapView>
  )
}

export default Map
