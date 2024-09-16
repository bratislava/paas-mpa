import BottomSheet from '@gorhom/bottom-sheet'
import * as Location from 'expo-location'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Linking, Platform, View } from 'react-native'
import { useReducedMotion } from 'react-native-reanimated'

import AvatarCircleLocationOff from '@/components/info/AvatarCircleLocationOff'
import BottomSheetContent from '@/components/screen-layout/BottomSheet/BottomSheetContent'
import BottomSheetHandleWithShadow from '@/components/screen-layout/BottomSheet/BottomSheetHandleWithShadow'
import ContentWithAvatar from '@/components/screen-layout/ContentWithAvatar'
import Button from '@/components/shared/Button'
import { useAppFocusEffect } from '@/hooks/useAppFocusEffect'
import { useTranslation } from '@/hooks/useTranslation'
import { useLocationPermission } from '@/modules/map/hooks/useLocationPermission'

const MapLocationBottomSheet = () => {
  const { t } = useTranslation()
  const ref = useRef<BottomSheet>(null)
  const reducedMotion = useReducedMotion()

  const { locationPermissionStatus, getLocationPermission } = useLocationPermission()
  const [isLocationOn, setIsLocationOn] = useState(true)

  const reloadLocationStatus = useCallback(async () => {
    if (locationPermissionStatus === Location.PermissionStatus.UNDETERMINED) {
      await getLocationPermission()
    }

    const isEnabled = await Location.hasServicesEnabledAsync()
    setIsLocationOn(isEnabled)
  }, [getLocationPermission, locationPermissionStatus])

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

  const isGranted = locationPermissionStatus === Location.PermissionStatus.GRANTED
  const title = isGranted
    ? t('LocationBottomSheet.locationOff.title')
    : t('LocationBottomSheet.locationDenied.title')
  const text = isGranted
    ? t('LocationBottomSheet.locationOff.text')
    : t('LocationBottomSheet.locationDenied.text')

  return (
    <BottomSheet
      ref={ref}
      key="mapLocationBottomSheet"
      handleComponent={BottomSheetHandleWithShadow}
      enablePanDownToClose
      enableDynamicSizing
      animateOnMount={!reducedMotion}
    >
      <BottomSheetContent>
        <ContentWithAvatar
          className="px-0 py-0 pb-3 g-3"
          title={title}
          text={text}
          customAvatarComponent={<AvatarCircleLocationOff />}
        >
          <View className="flex-row justify-between g-3">
            <Button className="flex-1" variant="primary" onPress={handleOpenSettingsPress}>
              {t('LocationBottomSheet.openSettings')}
            </Button>
            <Button className="flex-1" variant="tertiary" onPress={handleDismiss}>
              {t('LocationBottomSheet.dismiss')}
            </Button>
          </View>
        </ContentWithAvatar>
      </BottomSheetContent>
    </BottomSheet>
  )
}

export default MapLocationBottomSheet
