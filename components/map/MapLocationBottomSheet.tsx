import BottomSheet from '@gorhom/bottom-sheet'
import * as Location from 'expo-location'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Linking, Platform, View } from 'react-native'

import AvatarCircleLocationOff from '@/components/info/AvatarCircleLocationOff'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import BottomSheetHandleWithShadow from '@/components/screen-layout/BottomSheet/BottomSheetHandleWithShadow'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import Button from '@/components/shared/Button'
import { useAppFocusEffect } from '@/hooks/useAppFocusEffect'
import { useTranslation } from '@/hooks/useTranslation'
import { useLocationPermission } from '@/modules/map/hooks/useLocationPermission'

const MapLocationBottomSheet = () => {
  const t = useTranslation('LocationBottomSheet')
  const ref = useRef<BottomSheet>(null)
  const [locationPermissionStatus, getLocationPermission] = useLocationPermission()
  const [isLocationOn, setIsLocationOn] = useState(true)

  const reloadLocationStatus = useCallback(() => {
    ;(async () => {
      getLocationPermission()
      const isEnabled = await Location.hasServicesEnabledAsync()
      setIsLocationOn(isEnabled)
    })()
  }, [getLocationPermission])

  const handleOpenSettingsPress = useCallback(async () => {
    if (locationPermissionStatus !== Location.PermissionStatus.GRANTED) {
      Linking.openSettings()
    } else if (!isLocationOn) {
      // https://copyprogramming.com/howto/react-native-open-settings-through-linking-openurl-in-ios
      if (Platform.OS === 'android') {
        Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS')
      } else if (Platform.OS === 'ios') {
        // TODO: test on iOS
        Linking.openURL('App-Prefs:root=Privacy&path=LOCATION')
        // Or this
        // Linking.openURL('App-Prefs:Privacy&path=LOCATION')
      }
    }
  }, [locationPermissionStatus, isLocationOn])

  const handleDismiss = useCallback(() => {
    ref.current?.close()
  }, [])

  // This is done so that when user changes the location settings and refocuses the app
  // the bottom sheet will be updated
  useAppFocusEffect(reloadLocationStatus)

  useEffect(() => {
    reloadLocationStatus()
  }, [reloadLocationStatus])

  if (locationPermissionStatus === Location.PermissionStatus.GRANTED && isLocationOn) {
    return null
  }

  const translationKey =
    locationPermissionStatus === Location.PermissionStatus.GRANTED
      ? 'locationOff'
      : 'locationDenied'

  return (
    <BottomSheet
      ref={ref}
      handleComponent={BottomSheetHandleWithShadow}
      enablePanDownToClose
      enableDynamicSizing
    >
      <BottomSheetContent>
        <ContentWithAvatar
          className="px-0 py-0 pb-3 g-3"
          title={t(`${translationKey}.title`)}
          text={t(`${translationKey}.text`)}
          customAvatarComponent={<AvatarCircleLocationOff />}
        >
          <View className="flex-row justify-between g-3">
            <Button className="flex-1" variant="primary" onPress={handleOpenSettingsPress}>
              {t('openSettings')}
            </Button>
            <Button className="flex-1" variant="tertiary" onPress={handleDismiss}>
              {t('dismiss')}
            </Button>
          </View>
        </ContentWithAvatar>
      </BottomSheetContent>
    </BottomSheet>
  )
}

export default MapLocationBottomSheet
