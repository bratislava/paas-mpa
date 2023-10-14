import BottomSheet from '@gorhom/bottom-sheet'
import { Portal } from '@gorhom/portal'
import { Link, useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { LayoutAnimation, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Map, { MapRef } from '@/components/map/Map'
import MapPointBottomSheet from '@/components/map/MapPointBottomSheet'
import MapZoneBottomSheet from '@/components/map/MapZoneBottomSheet'
import IconButton from '@/components/shared/IconButton'
import { DEFAULT_FILTERS, MapFilters } from '@/modules/map/constants'
import { MapInterestPoint, MapUdrZone } from '@/modules/map/types'

type MapScreenParams = MapFilters

const MapScreen = () => {
  const [selectedZone, setSelectedZone] = useState<MapUdrZone | null>(null)
  const [selectedPoint, setMapInterestPoint] = useState<MapInterestPoint | null>(null)
  const params = useLocalSearchParams<MapScreenParams>()
  const [filters, setFilters] = useState<MapFilters>(DEFAULT_FILTERS)
  const zoneBottomSheetRef = useRef<BottomSheet>(null)
  const pointBottomSheetRef = useRef<BottomSheet>(null)
  const { top } = useSafeAreaInsets()
  const mapRef = useRef<MapRef>(null)
  const handleZoneChange = useCallback(
    (zone: MapUdrZone) => {
      const animation = LayoutAnimation.create(100, 'easeInEaseOut', 'opacity')
      LayoutAnimation.configureNext(animation)
      setSelectedZone(zone)
      zoneBottomSheetRef.current?.snapToIndex(0)
    },
    [setSelectedZone],
  )
  const handlePointPress = useCallback(
    (zone: MapInterestPoint) => {
      setMapInterestPoint(zone)
      zoneBottomSheetRef.current?.snapToIndex(0)
    },
    [setMapInterestPoint],
  )

  const stringifiedParams = JSON.stringify(params)

  useEffect(() => {
    if (params) {
      setFilters((oldFilters) => ({ ...oldFilters, ...params }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedParams])

  return (
    <View className="flex-1 items-stretch">
      <Map
        ref={mapRef}
        onZoneChange={handleZoneChange}
        onPointPress={handlePointPress}
        filters={filters}
      />
      <Portal hostName="index">
        <MapZoneBottomSheet
          ref={zoneBottomSheetRef}
          zone={selectedZone}
          setFlyToCenter={mapRef.current?.setFlyToCenter}
          setBlockZoneMapUpdate={mapRef.current?.setIsZoneUpdateBlocked}
        />
      </Portal>
      {selectedPoint && <MapPointBottomSheet ref={pointBottomSheetRef} point={selectedPoint} />}
      <View className="absolute flex w-full flex-row justify-start px-2.5" style={{ top }}>
        <Link asChild href={{ pathname: '/filters', params: filters }}>
          <IconButton
            name="filter-list"
            // TODO translation
            accessibilityLabel="Open filters"
            variant="white-raised-small"
          />
        </Link>
      </View>
    </View>
  )
}

export default MapScreen
