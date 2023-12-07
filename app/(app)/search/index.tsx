import { PortalHost } from '@gorhom/portal'
import { router } from 'expo-router'
import { Feature, Polygon } from 'geojson'
import { useCallback, useRef } from 'react'
import { Pressable, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import MapAutocomplete from '@/components/map/MapAutocomplete'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import FlexRow from '@/components/shared/FlexRow'
import { useTranslation } from '@/hooks/useTranslation'
import { GeocodingFeature, isGeocodingFeature, MapUdrZone } from '@/modules/map/types'
import { findMostCenterPointInPolygon } from '@/modules/map/utils/findPolygonCenter'
import { useMapSearchContext } from '@/state/MapSearchProvider/useMapSearchContext'

const SearchScreen = () => {
  const { flyToCenter } = useMapSearchContext()

  const t = useTranslation()
  const insets = useSafeAreaInsets()

  const ref = useRef<TextInput>(null)

  const handleInputBlur = useCallback(() => {
    ref.current?.blur()
  }, [])

  const handleCancel = useCallback(() => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/')
    }
  }, [])

  const handleChoice = useCallback(
    (newValue: GeocodingFeature | Feature<Polygon, MapUdrZone>) => {
      handleInputBlur()
      if (isGeocodingFeature(newValue)) {
        flyToCenter?.(newValue.center)
      } else {
        flyToCenter?.(findMostCenterPointInPolygon(newValue.geometry.coordinates))
      }
      handleCancel()
    },
    [handleInputBlur, flyToCenter, handleCancel],
  )

  return (
    <ScreenView title={t('title')}>
      <ScreenContent className="flex-1" style={{ paddingTop: insets.top }}>
        <View className="flex-1">
          <View>
            <FlexRow>
              <View className="flex-1">
                <MapAutocomplete
                  ref={ref}
                  optionsPortalName="mapAutocompleteOptions"
                  onValueChange={handleChoice}
                />
              </View>
              <Button variant="plain-dark" onPress={handleCancel} onPressIn={handleInputBlur}>
                {t('Common.cancel')}
              </Button>
            </FlexRow>
          </View>
          {/* Autocomplete results, they are in a Portal so that 
        MapAutocomplete does not need to be remounted and lose state */}
          <View className="flex-1">
            <Pressable onTouchStart={handleInputBlur}>
              <View className="h-full pt-5">
                <PortalHost name="mapAutocompleteOptions" />
              </View>
            </Pressable>
          </View>
        </View>
      </ScreenContent>
    </ScreenView>
  )
}

export default SearchScreen
