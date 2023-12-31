import BottomSheet from '@gorhom/bottom-sheet'
import { Portal } from '@gorhom/portal'
import { MapState } from '@rnmapbox/maps'
import { Link, useLocalSearchParams } from 'expo-router'
import { Position } from 'geojson'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useDebouncedCallback } from 'use-debounce'

import Map, { MapRef } from '@/components/map/Map'
import MapLocationBottomSheet from '@/components/map/MapLocationBottomSheet'
import MapPointBottomSheet from '@/components/map/MapPointBottomSheet'
import MapZoneBottomSheet from '@/components/map/MapZoneBottomSheet'
import IconButton from '@/components/shared/IconButton'
import { useLocale } from '@/hooks/useTranslation'
import { DEFAULT_FILTERS, MapFilters } from '@/modules/map/constants'
import { useProcessedArcgisData } from '@/modules/map/hooks/useProcessedArcgisData'
import { MapInterestPoint, MapUdrZone } from '@/modules/map/types'
import { normalizeZone } from '@/modules/map/utils/normalizeZone'
import { reverseGeocode } from '@/modules/map/utils/reverseGeocode'

const MAP_STATE_DEBOUNCE_TIME = 500

type MapScreenParams = MapFilters
type Props = {
  onMapStateChange?: (mapState: MapState) => void
}

const MapScreen = ({ onMapStateChange }: Props) => {
  const params = useLocalSearchParams<MapScreenParams>()
  const zoneBottomSheetRef = useRef<BottomSheet>(null)
  const pointBottomSheetRef = useRef<BottomSheet>(null)
  const mapRef = useRef<MapRef>(null)
  const { top } = useSafeAreaInsets()
  const locale = useLocale()

  const [filters, setFilters] = useState<MapFilters>(DEFAULT_FILTERS)
  const [selectedZone, setSelectedZone] = useState<MapUdrZone | null>(null)
  const [selectedPoint, setMapInterestPoint] = useState<MapInterestPoint | null>(null)
  const [isMapPinShown, setIsMapPinShown] = useState(false)
  const [currentAddress, setCurrentAddress] = useState<string>()

  const handleMapPinVisibilityChange = useCallback((isShown: boolean) => {
    setIsMapPinShown(isShown)
  }, [])

  const handleZoneChange = useCallback(
    (zone: MapUdrZone | null) => {
      setSelectedZone(zone)
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

  const handleCenterChange = useCallback(async (center: Position) => {
    const geocodingResult = await reverseGeocode(center)
    if (geocodingResult.length > 0) {
      setCurrentAddress(geocodingResult[0].place_name)
    }
  }, [])
  const debouncedHandleCenterChange = useDebouncedCallback(
    handleCenterChange,
    MAP_STATE_DEBOUNCE_TIME,
  )

  const stringifiedParams = JSON.stringify(params)

  useEffect(() => {
    if (params) {
      setFilters((oldFilters) => ({ ...oldFilters, ...params }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedParams])

  const normalizedZone = useMemo(
    () => (selectedZone ? normalizeZone(selectedZone, locale) : null),
    [selectedZone, locale],
  )

  const { isLoading, ...processedData } = useProcessedArcgisData()

  return (
    <View className="flex-1 items-stretch">
      <Map
        ref={mapRef}
        onZoneChange={handleZoneChange}
        onPointPress={handlePointPress}
        filters={filters}
        processedData={processedData}
        onMapPinVisibilityChange={handleMapPinVisibilityChange}
        onStateChange={onMapStateChange}
        onCenterChange={debouncedHandleCenterChange}
      />
      <Portal hostName="index">
        <MapZoneBottomSheet
          ref={zoneBottomSheetRef}
          zone={normalizedZone}
          setFlyToCenter={mapRef.current?.setFlyToCenter}
          isZoomedOut={!isMapPinShown}
          address={currentAddress}
        />
      </Portal>
      {selectedPoint && (
        <Portal hostName="index">
          <MapPointBottomSheet ref={pointBottomSheetRef} point={selectedPoint} />
        </Portal>
      )}
      <Portal hostName="index">
        <MapLocationBottomSheet />
      </Portal>
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
