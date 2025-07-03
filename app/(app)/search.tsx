import { PortalHost } from '@gorhom/portal'
import { router } from 'expo-router'
import { useCallback, useRef } from 'react'
import { TextInput, View } from 'react-native'

import MapAutocomplete from '@/components/map/MapAutocomplete'
import ScreenContent from '@/components/screen-layout/ScreenContent'
import ScreenView from '@/components/screen-layout/ScreenView'
import Button from '@/components/shared/Button'
import DismissKeyboard from '@/components/shared/DismissKeyboard'
import FlexRow from '@/components/shared/FlexRow'
import { useTranslation } from '@/hooks/useTranslation'
import { GeocodingFeature } from '@/modules/arcgis/types'
import { isGeocodingFeature, UdrZoneFeature } from '@/modules/map/types'
import { findMostCenterPointInPolygon } from '@/modules/map/utils/findPolygonCenter'
import { useMapStoreContext } from '@/state/MapStoreProvider/useMapStoreContext'

const SearchScreen = () => {
  const { flyTo } = useMapStoreContext()

  const { t } = useTranslation()

  const ref = useRef<TextInput>(null)

  const handleInputBlur = useCallback(() => {
    ref.current?.blur()
  }, [])

  const handleCancel = useCallback(() => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.dismissTo('/')
    }
  }, [])

  const handleChoice = useCallback(
    (newValue: GeocodingFeature | UdrZoneFeature) => {
      handleInputBlur()

      // needs to be in timeout because going to map (handleCancel) rerenders the map which cancels the flyToCenter
      setTimeout(() => {
        if (isGeocodingFeature(newValue)) {
          flyTo?.(newValue.center)
        } else {
          flyTo?.(findMostCenterPointInPolygon(newValue.geometry.coordinates))
        }
      }, 100)

      handleCancel()
    },
    [handleInputBlur, flyTo, handleCancel],
  )

  return (
    <DismissKeyboard>
      <ScreenView options={{ headerShown: false }}>
        <ScreenContent>
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
              <View className="h-full pt-5">
                <PortalHost name="mapAutocompleteOptions" />
              </View>
            </View>
          </View>
        </ScreenContent>
      </ScreenView>
    </DismissKeyboard>
  )
}

export default SearchScreen
