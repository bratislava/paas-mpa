import BottomSheet from '@gorhom/bottom-sheet'
import { Portal } from '@gorhom/portal'
import { Link, useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Map, { MapRef } from '@/components/map/Map'
import MapPointBottomSheet from '@/components/map/MapPointBottomSheet'
import MapZoneBottomSheet from '@/components/map/MapZoneBottomSheet'
import IconButton from '@/components/shared/IconButton'
import { DEFAULT_FILTERS, MapFilters } from '@/modules/map/constants'
import { MapInterestPoint, MapUdrZone } from '@/modules/map/types'
import { useGlobalStoreContext } from '@/state/hooks/useGlobalStoreContext'

type MapScreenParams = MapFilters

const MapScreen = () => {
  const params = useLocalSearchParams<MapScreenParams>()
  const { setTicketPriceRequest } = useGlobalStoreContext()
  const zoneBottomSheetRef = useRef<BottomSheet>(null)
  const pointBottomSheetRef = useRef<BottomSheet>(null)
  const mapRef = useRef<MapRef>(null)
  const { top } = useSafeAreaInsets()

  const [filters, setFilters] = useState<MapFilters>(DEFAULT_FILTERS)
  const [selectedZone, setSelectedZone] = useState<MapUdrZone | null>(null)
  const [selectedPoint, setMapInterestPoint] = useState<MapInterestPoint | null>(null)

  const handleZoneChange = useCallback(
    (zone: MapUdrZone | null) => {
      setSelectedZone(zone)
      setTicketPriceRequest((prev) => ({
        ...prev,
        // TODO I got an error here without "?" that zone can be null - investigate why Typescript is not complaining
        udr: zone?.UDR_ID.toString(),
      }))
    },
    [setSelectedZone, setTicketPriceRequest],
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
        />
      </Portal>
      {selectedPoint && <MapPointBottomSheet ref={pointBottomSheetRef} point={selectedPoint} />}
      <View className="absolute left-0 px-2.5" style={{ top }}>
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
