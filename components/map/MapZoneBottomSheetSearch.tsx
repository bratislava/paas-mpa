import BottomSheet from '@gorhom/bottom-sheet'
import { PortalHost } from '@gorhom/portal'
import clsx from 'clsx'
import { Feature, Polygon } from 'geojson'
import { forwardRef, useCallback } from 'react'
import { Pressable, TextInput, View } from 'react-native'

import { MapRef } from '@/components/map/Map'
import MapAutocomplete from '@/components/map/MapAutocomplete'
import Button from '@/components/shared/Button'
import FlexRow from '@/components/shared/FlexRow'
import Typography from '@/components/shared/Typography'
import { useTranslation } from '@/hooks/useTranslation'
import { GeocodingFeature, isGeocodingFeature, MapUdrZone } from '@/modules/map/types'
import { findMostCenterPointInPolygon } from '@/modules/map/utils/findPolygonCenter'

type Props = {
  setFlyToCenter?: MapRef['setFlyToCenter']
  isFullHeight: boolean
  setIsFullHeight: (value: boolean) => void
  handleInputBlur: () => void
  bottomSheetRef: BottomSheet | null
}

const MapZoneBottomSheetSearch = forwardRef<TextInput, Props>((props, ref) => {
  const { setFlyToCenter, isFullHeight, setIsFullHeight, handleInputBlur, bottomSheetRef } = props

  const t = useTranslation()

  const handleInputFocus = useCallback(() => {
    setIsFullHeight(true)
  }, [setIsFullHeight])

  const handleCancel = useCallback(() => {
    bottomSheetRef?.collapse()
  }, [bottomSheetRef])

  const handleChoice = useCallback(
    (newValue: GeocodingFeature | Feature<Polygon, MapUdrZone>) => {
      handleInputBlur()
      bottomSheetRef?.collapse()
      if (isGeocodingFeature(newValue)) {
        setFlyToCenter?.(newValue.center)
      } else {
        setFlyToCenter?.(findMostCenterPointInPolygon(newValue.geometry.coordinates))
      }
    },
    [handleInputBlur, setFlyToCenter, bottomSheetRef],
  )

  return (
    <View className={clsx(isFullHeight && 'flex-1')}>
      <View>
        <FlexRow>
          <View className="flex-1">
            <Pressable onPress={handleInputFocus}>
              <View pointerEvents={isFullHeight ? 'auto' : 'none'}>
                {!isFullHeight && (
                  <Typography variant="default-bold" className="pb-1">
                    {t('ZoneBottomSheet.title')}
                  </Typography>
                )}
                <MapAutocomplete
                  ref={ref}
                  optionsPortalName="mapAutocompleteOptions"
                  onValueChange={handleChoice}
                />
              </View>
            </Pressable>
          </View>
          {isFullHeight && (
            <Button variant="plain-dark" onPress={handleCancel} onPressIn={handleInputBlur}>
              {t('Common.cancel')}
            </Button>
          )}
        </FlexRow>
      </View>
      <View className="flex-1">
        {isFullHeight && (
          <Pressable onTouchStart={handleInputBlur}>
            <View className="h-full pt-5">
              <PortalHost name="mapAutocompleteOptions" />
            </View>
          </Pressable>
        )}
      </View>
    </View>
  )
})

export default MapZoneBottomSheetSearch
