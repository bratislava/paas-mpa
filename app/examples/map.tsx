import { BottomSheet, Button, Text } from '@rneui/themed'
import {
  Camera,
  FillLayer,
  MapView,
  ShapeSource,
  UserLocation,
  UserLocationRenderMode,
  UserTrackingMode,
} from '@rnmapbox/maps'
import { FeatureCollection } from 'geojson'
import { useArcgis } from 'hooks/useArcgis'
import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import udrStyle from 'utils/layer-styles/visitors2'
import { processData } from 'utils/mapUtils'

const MapScreen = () => {
  const camera = useRef<Camera>(null)
  const map = useRef<MapView>(null)
  const [followingUser, setFollowingUser] = useState(true)

  const { data: rawZonesData } = useArcgis(
    'https://nest-proxy.bratislava.sk/geoportal/hsite/rest/services/parkovanie/Hranica_RZ/MapServer/1',
    { format: 'geojson' },
  )

  const { data: rawAssistantsData } = useArcgis(
    'https://nest-proxy.bratislava.sk/geoportal/hsite/rest/services/doprava/Asistenti_PAAS/MapServer/51',
    { format: 'geojson' },
  )

  const { data: rawParkomatsData } = useArcgis(
    'https://nest-proxy.bratislava.sk/geoportal/hsite/rest/services/doprava/Parkomaty/MapServer/17',
    { format: 'geojson' },
  )

  const { data: rawPartnersData } = useArcgis(
    'https://nest-proxy.bratislava.sk/geoportal/hsite/rest/services/parkovanie/Zmluvn%C3%AD_partneri_PAAS/MapServer/128',
    { format: 'geojson' },
  )

  const { data: rawParkingLotsData } = useArcgis(
    'https://nest-proxy.bratislava.sk/geoportal/hsite/rest/services/parkovanie/Parkovisk%C3%A1/MapServer/118',
    { format: 'geojson' },
  )

  const { data: rawBranchesData } = useArcgis(
    'https://nest-proxy.bratislava.sk/geoportal/hsite/rest/services/parkovanie/Pobo%C4%8Dka/MapServer/87',
    { format: 'geojson' },
  )

  const { data: rawUdrData } = useArcgis(
    'https://nest-proxy.bratislava.sk/geoportal/hsite/rest/services/parkovanie/UDR_P/MapServer/40',
    { format: 'geojson' },
  )

  const { data: rawOdpData } = useArcgis(
    'https://nest-proxy.bratislava.sk/geoportal/hSite/rest/services/parkovanie/ODP/MapServer/3',
    { format: 'geojson' },
  )

  const [isLoading, setLoading] = useState(true)
  const [bottomSheetContent, setBottomSheetContent] = useState<any>(null)
  const [markersData, setMarkersData] = useState<FeatureCollection | null>(null)
  const [zonesData, setZonesData] = useState<FeatureCollection | null>(null)
  const [udrData, setUdrData] = useState<FeatureCollection | null>(null)
  const [odpData, setOdpData] = useState<FeatureCollection | null>(null)

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

  useEffect(() => {
    if (
      rawAssistantsData &&
      rawParkomatsData &&
      rawPartnersData &&
      rawParkingLotsData &&
      rawBranchesData &&
      rawUdrData &&
      rawOdpData &&
      rawZonesData
    ) {
      const { markersData, udrData, odpData, zonesData } = processData({
        rawZonesData,
        rawAssistantsData,
        rawParkomatsData,
        rawPartnersData,
        rawParkingLotsData,
        rawBranchesData,
        rawUdrData,
        rawOdpData,
      })
      setMarkersData(markersData)
      setZonesData(zonesData)
      setUdrData(udrData)
      setOdpData(odpData)
      setLoading(false)
    }
  }, [
    rawAssistantsData,
    rawParkomatsData,
    rawPartnersData,
    rawParkingLotsData,
    rawBranchesData,
    rawUdrData,
    rawOdpData,
    rawZonesData,
  ])

  return (
    <View style={styles.page}>
      <MapView
        ref={map}
        style={styles.map}
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
              style={udrStyle.reduce((prev, current) => ({ ...prev, ...current.paint }), {})}
            />
          </ShapeSource>
        )}
      </MapView>
      <BottomSheet
        modalProps={{ style: { backgroundColor: 'white' } }}
        isVisible={!!bottomSheetContent}
      >
        <View style={styles.bottomSheetContainer}>
          <Text>{JSON.stringify(bottomSheetContent)}</Text>
          <Button onPress={() => setBottomSheetContent(null)}>Close</Button>
        </View>
      </BottomSheet>
    </View>
  )
}

export default MapScreen

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  page: {
    alignItems: 'stretch',
    flex: 1,
  },
  bottomSheetContainer: {
    backgroundColor: 'white',
  },
})
