/* eslint-disable @typescript-eslint/no-unused-vars */
import BottomSheet from '@gorhom/bottom-sheet'
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
import { View } from 'react-native'
import udrStyle from 'utils/layer-styles/visitors2'

import Typography from '@/components/shared/Typography'
import { useProcessedArcgisData } from '@/hooks/useProcessedMapData'

const MapScreen = () => {
  const camera = useRef<Camera>(null)
  const map = useRef<MapView>(null)
  const [followingUser, setFollowingUser] = useState(true)

  const { isLoading, markersData, zonesData, udrData, odpData } = useProcessedArcgisData()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [bottomSheetContent, setBottomSheetContent] = useState<any>(null)

  // const udrDataByPrice = useMemo(
  //   () => ({
  //     udrDataRegular: {
  //       ...udrData,
  //       features: udrData?.features.filter((udr) => udr.properties?.Zakladna_cena !== 2),
  //     } as FeatureCollection,
  //     udrDataTwoEur: {
  //       ...udrData,
  //       features: udrData?.features.filter((udr) => udr.properties?.Zakladna_cena === 2),
  //     } as FeatureCollection,
  //   }),
  //   [udrData],
  // )

  return (
    <View className="flex-1 items-stretch">
      <MapView
        ref={map}
        className="flex-1"
        // eslint-disable-next-line no-secrets/no-secrets
        styleURL="mapbox://styles/inovaciebratislava/cl5teyncz000614o4le1p295o"
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
          requestsAlwaysUse
          minDisplacement={3}
          animated
        />
        {udrData && (
          <ShapeSource id="udrSource" shape={udrData} onPress={setBottomSheetContent}>
            <FillLayer
              id="udrFill"
              // eslint-disable-next-line unicorn/no-array-reduce
              style={udrStyle.reduce((prev, current) => ({ ...prev, ...current.paint }), {})}
            />
          </ShapeSource>
        )}
      </MapView>
      {bottomSheetContent && (
        <BottomSheet>
          <View className="bg-white">
            <Typography>{JSON.stringify(bottomSheetContent)}</Typography>
            {/* <Button onPress={() => setBottomSheetContent(null)}>Close</Button> */}
          </View>
        </BottomSheet>
      )}
    </View>
  )
}

export default MapScreen
